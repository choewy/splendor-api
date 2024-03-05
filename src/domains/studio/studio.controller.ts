import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('스튜디오')
@Controller('studio')
export class StudioController {}
