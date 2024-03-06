import { PaginationType } from '@common/implements';

import { FollowingDto } from './following.dto';

export class FollowingPaginationDto extends PaginationType(FollowingDto) {}
