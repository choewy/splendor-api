import { DonationEntity, StudioEntity, UserEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

class DonationDto implements Pick<DonationEntity, 'id' | 'amount' | 'nickname' | 'message' | 'imageUrl' | 'createdAt'> {
  id: number;
  amount: number;
  nickname: string;
  message: string | null;
  imageUrl: string | null;
  createdAt: Date;

  constructor(donation: DonationEntity) {
    this.id = donation.id;
    this.amount = donation.amount;
    this.nickname = donation.nickname;
    this.message = donation.message;
    this.imageUrl = donation.imageUrl;
    this.createdAt = donation.createdAt;
  }
}

class UserDto implements Pick<UserEntity, 'id' | 'nickname' | 'profileImageUrl'> {
  id: number;
  nickname: string;
  profileImageUrl: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.profileImageUrl = user.profileImageUrl;
  }
}

class StudioDto implements Pick<StudioEntity, 'id'> {
  id: number;

  constructor(studio: StudioEntity) {
    this.id = studio.id;
  }
}

export class KafkaDonationDto {
  donation: DonationDto;
  sender: UserDto;
  recipient: UserDto;
  studio: StudioDto;

  constructor(donation: DonationEntity, sender: UserEntity, recipient: UserEntity, studio: StudioEntity) {
    this.donation = new DonationDto(donation);
    this.sender = new UserDto(sender);
    this.recipient = new UserDto(recipient);
    this.studio = new StudioDto(studio);
  }
}

export class KafkaDonationMessage extends KafkaMessage<KafkaDonationDto> {
  constructor(donation: DonationEntity, sender: UserEntity, recipient: UserEntity, studio: StudioEntity) {
    super(new KafkaDonationDto(donation, sender, recipient, studio));
  }
}
