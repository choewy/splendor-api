import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './services';

@Module({
  imports: [TypeOrmExModule.forFeature([UserRepository])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
