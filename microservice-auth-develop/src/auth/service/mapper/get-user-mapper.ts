import { User } from '@database/entities/user.entity';
import { GetUserResponse } from '../../dto/response/get-user-response';
import { UserFollowerEntity } from '@database/entities/user-folower.entity';

export class GetUserMapper {
  static getUseResponse(user: User, countSubscribe: UserFollowerEntity[], userId: string): GetUserResponse | [] {
    return user
      ? {
          id: user.id,
          email: user.email,
          birthDate: user.birthDate,
          bio: user.bio,
          status: user.status,
          backgroundUrl: user.backgroundUrl,
          avatarUrl: user.avatarUrl,
          username: user.username,
          description: user.description,
          isPrivate: user.isPrivate,
          role: user.role,
          countSubscribe: countSubscribe.length,
          countSubscribeIds: countSubscribe?.length
            ? countSubscribe.map((el) => el.followingId).filter((el) => el !== userId)
            : [],
        }
      : [];
  }
}
