import { IsInt, IsNotEmpty } from 'class-validator';

export class FollowParamDto {
  @IsNotEmpty()
  @IsInt()
  toId: number;
}
