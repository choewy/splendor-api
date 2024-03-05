import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmExModule.forFeature([UserRepository])],
  controllers: [UserController],
})
export class UserModule {}
