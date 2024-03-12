import { ForbiddenWordRepository, StudioRepository } from '@libs/entity';
import { TypeOrmLibsModule } from '@libs/typeorm';
import { Module } from '@nestjs/common';

import { ForbiddenWordsController } from './forbidden-words.controller';
import { ForbiddenWordsService } from './forbidden-words.service';

@Module({
  imports: [TypeOrmLibsModule.forFeature([StudioRepository, ForbiddenWordRepository])],
  controllers: [ForbiddenWordsController],
  providers: [ForbiddenWordsService],
})
export class ForbiddenWordsModule {}
