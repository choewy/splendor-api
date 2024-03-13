import { DonationEntity, StudioEntity, UserEntity } from '@libs/entity';
import { KafkaMessage } from '@libs/kafka';

export class KafkaDonationMessage extends KafkaMessage<{
  donation: Pick<DonationEntity, 'id' | 'amount' | 'nickname' | 'message' | 'imageUrl' | 'createdAt'>;
  sender: Pick<UserEntity, 'id' | 'nickname' | 'profileImageUrl'>;
  recipient: Pick<UserEntity, 'id' | 'nickname' | 'profileImageUrl'>;
  studio: Pick<StudioEntity, 'id'>;
}> {
  constructor(donation: DonationEntity, sender: UserEntity, recipient: UserEntity, studio: StudioEntity) {
    super({
      donation: {
        id: donation.id,
        amount: donation.amount,
        nickname: donation.nickname,
        message: donation.message,
        imageUrl: donation.imageUrl,
        createdAt: donation.createdAt,
      },
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
    });
  }
}
