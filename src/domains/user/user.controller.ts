import { PassportJwtGuard } from '@libs/passport';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('사용자')
@Controller('users')
@UseGuards(PassportJwtGuard)
export class UserController {}
