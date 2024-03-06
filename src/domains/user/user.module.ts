import { TypeOrmExModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { UserRepository } from './repositories';
import { UserService } from './services';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmExModule.forFeature([UserRepository])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
