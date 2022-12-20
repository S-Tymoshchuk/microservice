import { GetUserProfileResponse } from 'clap-proto';
import { Exclude, Expose } from 'class-transformer';
import { RoleEnum } from '../../common/types/role.enum';
import { StatusEnum } from '../../common/types/status.enum';

@Exclude()
export class GetUserProfileResponseDto implements GetUserProfileResponse {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  birthDate: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  backgroundUrl: string;

  @Expose()
  bio: string;

  @Expose()
  roleId: RoleEnum;

  @Expose()
  status: StatusEnum;
}
