export class GetSubscriberListMapper {
  static getSubscriberListMapper(subscriber: any, countVideos: { ownerId: string; count: number }[]): any | [] {
    return subscriber
      ? {
          id: subscriber.id,
          email: subscriber.email,
          username: subscriber.username,
          status: subscriber.status,
          backgroundUrl: subscriber.backgroundUrl,
          avatarUrl: subscriber.avatarUrl,
          description: subscriber.description,
          countSubscribers: Number(subscriber.countSubscribers),
          countVideos: GetSubscriberListMapper.findCount(subscriber.id, countVideos),
        }
      : [];
  }

  static findCount(userId, countVideos): number {
    const result = countVideos?.find((el) => el.ownerId === userId);
    if (!result) {
      return 0;
    }
    return result.count;
  }
}
