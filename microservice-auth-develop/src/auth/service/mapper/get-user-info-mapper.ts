import { User } from '@database/entities/user.entity';
import { GetUsersResponse } from '../../dto/response/get-users-response';

export class GetUserInfoMapper {
  static getUserInfoResponse(user: User): GetUsersResponse | [] {
    return user
      ? {
          userId: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl || '',
          userDescription: user.description || '',
        }
      : [];
  }
}
