import { UserRepository } from '@libs/entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}
}
