import { DonationEntity, StudioEntity, UserEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

export class KafkaDonationMessage extends KafkaMessage {
  static readonly KEY = 'donation';

  constructor(donation: DonationEntity, sender: UserEntity, recipient: UserEntity, studio: StudioEntity) {
    super(KafkaDonationMessage.KEY, {
      id: donation.id,
      amount: donation.amount,
      nickname: donation.nickname,
      message: donation.message,
      imageUrl: donation.imageUrl,
      sender: {
        id: sender.id,
        nickname: sender.nickname,
        profileImageUrl: sender.profileImageUrl,
      },
      recipient: {
        id: recipient.id,
        nickname: recipient.nickname,
        profileImageUrl: recipient.profileImageUrl,
      },
      studio: { id: studio.id },
      createdAt: donation.createdAt,
    });
  }
}
