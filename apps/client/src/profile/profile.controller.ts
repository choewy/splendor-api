import { ApiController } from '@libs/swagger';

import { ProfileService } from './profile.service';

@ApiController('profile', '프로필')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
}
