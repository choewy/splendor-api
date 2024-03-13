import { KafkaDonationMessage, KafkaTopics } from '@libs/common';
import {
  BlockRepository,
  DonationEntity,
  DonationRepository,
  ForbiddenWordRepository,
  StudioEntity,
  StudioRepository,
  UserDonationsEntity,
  UserEntity,
  UserRepository,
  UserWalletEntity,
} from '@libs/entity';
import { KafkaProducer, KafkaSendMessageCommand } from '@libs/kafka';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateDonationCommand } from './commands';

@Injectable()
export class DonationService {
  constructor(
    private readonly kafkaProducer: KafkaProducer,
    private readonly userRepository: UserRepository,
    private readonly studioRepository: StudioRepository,
    private readonly blockRepository: BlockRepository,
    private readonly forbiddenWordRepository: ForbiddenWordRepository,
    private readonly donationRepository: DonationRepository,
  ) {}

  async getSender(senderId: number, amount: number) {
    const user = await this.userRepository.findOne({
      relations: { userWallet: true },
      where: { id: senderId },
    });

    if (user === null) {
      throw new NotFoundException('not found user');
    }

    const { userWallet, ...sender } = user;

    if (userWallet.credit < amount) {
      throw new ConflictException('insufficient credit');
    }

    return this.userRepository.create(sender);
  }

  async getRecipient(recipientId: number) {
    const recipient = await this.userRepository.findOne({
      where: { id: recipientId },
    });

    if (recipient === null) {
      throw new NotFoundException('not found recipient');
    }

    return recipient;
  }

  async getStudio(recipientId: number) {
    const studio = await this.studioRepository.findOne({
      relations: { studioDonationSetting: true },
      where: { user: { id: recipientId } },
    });

    if (studio === null) {
      throw new NotFoundException('not found studio');
    }

    if (studio.studioDonationSetting.status === false) {
      throw new ConflictException('donating is diabled');
    }

    return studio;
  }

  async validateBlocked(userId: number, recipientId: number) {
    const existsBlock = await this.blockRepository.existsBy({
      userId: recipientId,
      targetId: userId,
    });

    if (existsBlock) {
      throw new ForbiddenException('you have been blocked');
    }
  }

  async validateDonationMinOrMaxCredit(studio: StudioEntity, amount: number) {
    if (studio.studioDonationSetting.min > amount) {
      throw new ConflictException('amount is less than the specified min amount');
    }

    if (studio.studioDonationSetting.max < amount) {
      throw new ConflictException('amount is more than the specified max amount');
    }
  }

  async validateForbiddenWords(studioId: number, nickname?: string, message?: string) {
    if (nickname == null && message == null) {
      return;
    }

    const forbiddenWords = await this.forbiddenWordRepository.findBy({
      studio: { id: studioId },
      status: true,
    });

    if (forbiddenWords.length > 0) {
      const regExp = new RegExp(forbiddenWords.map(({ word }) => word.trim()).join('|'));

      if (regExp.exec(nickname)) {
        throw new BadRequestException('the nickname contains prohibited words');
      }

      if (regExp.exec(message)) {
        throw new BadRequestException('the message contains prohibited words');
      }
    }
  }

  async createDonationTransaction(sender: UserEntity, recipient: UserEntity, command: CreateDonationCommand) {
    return this.donationRepository.transaction(async (em) => {
      const userWalletRepository = em.getRepository(UserWalletEntity);
      const userDonationsRepository = em.getRepository(UserDonationsEntity);
      const donationRepository = em.getRepository(DonationEntity);

      await userWalletRepository
        .createQueryBuilder()
        .update()
        .set({ credit: () => `credit - ${command.amount}` })
        .where({ userId: sender.id })
        .execute();

      await userWalletRepository
        .createQueryBuilder()
        .update()
        .set({ point: () => `point + ${command.amount}` })
        .where({ userId: command.recipientId })
        .execute();

      await userDonationsRepository
        .createQueryBuilder()
        .update()
        .set({ sentCount: () => 'sentCount + 1', sentAmount: () => `sentAmount + ${command.amount}` })
        .where({ userId: sender.id })
        .execute();

      await userDonationsRepository
        .createQueryBuilder()
        .update()
        .set({ receivedCount: () => 'receivedCount + 1', receivedAmount: () => `receivedAmount + ${command.amount}` })
        .where({ userId: command.recipientId })
        .execute();

      return donationRepository.save({
        recipient,
        sender,
        amount: command.amount,
        nickname: command.nickname ?? sender.nickname,
        message: command.message ?? null,
        imageUrl: command.imageUrl ?? null,
      });
    });
  }

  async createDonation(senderId: number, command: CreateDonationCommand) {
    const sender = await this.getSender(senderId, command.amount);
    const recipient = await this.getRecipient(command.recipientId);
    const studio = await this.getStudio(command.recipientId);

    await this.validateBlocked(senderId, command.recipientId);
    await this.validateDonationMinOrMaxCredit(studio, command.amount);
    await this.validateForbiddenWords(studio.id, command.nickname, command.message);

    const donation = await this.createDonationTransaction(sender, recipient, command);
    const kafkaMessages = [new KafkaDonationMessage(donation, sender, recipient, studio)];
    const kafkaSendMessageCommand = new KafkaSendMessageCommand(KafkaTopics.Donation, kafkaMessages);
    await this.kafkaProducer.send(kafkaSendMessageCommand);
  }
}
