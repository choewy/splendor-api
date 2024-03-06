import { PaginationType } from '@common/implements';

import { FollowerDto } from './follower.dto';

export class FollowerPaginationDto extends PaginationType(FollowerDto) {}
