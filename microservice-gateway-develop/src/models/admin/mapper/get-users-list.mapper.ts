import { User } from 'clap-proto';

export class GetUsersListMapper {
  static getUsersListMapper(user: User, countVideos: { ownerId: string; count: number }[]): User | [] {
    return user
      ? {
          id: user.id,
          email: user.email,
          username: user.username,
          status: user.status,
          createdAt: user.createdAt,
          count: 0,
          ...countVideos.find((el) => el.ownerId === user.id),
        }
      : [];
  }
}
