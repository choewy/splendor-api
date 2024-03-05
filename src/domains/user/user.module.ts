import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { UserService } from './services';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmExModule.forFeature([UserRepository])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
