import { ConflictException, NotFoundException } from '@nestjs/common';

export class NotFoundUserException extends NotFoundException {}
export class NotExistUserOAuthException extends NotFoundException {}
export class CannotFollowYourSelfException extends ConflictException {}
