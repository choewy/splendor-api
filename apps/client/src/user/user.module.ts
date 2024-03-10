import { UserRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmLibsModule.forFeature([UserRepository])],
  controllers: [],
  providers: [],
})
export class UserModule {}
