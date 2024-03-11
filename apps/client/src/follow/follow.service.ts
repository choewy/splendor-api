import { FollowRepository } from '@libs/entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}
}
