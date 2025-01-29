import { InternalServerErrorException } from '@nestjs/common';

export class KakaoGetTokenFailedException extends InternalServerErrorException {}
export class KakaoGetUserFailedException extends InternalServerErrorException {}
