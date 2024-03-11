import { ApiController } from '@libs/swagger';

import { UserService } from './user.service';

@ApiController('users', '회원')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
