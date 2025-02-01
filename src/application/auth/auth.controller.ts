import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {}
