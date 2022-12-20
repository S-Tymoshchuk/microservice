export class GetUsersMySubscribe {
  static getUsersMySubscribeResponse(user) {
    const userIds = [];
    const subscribers = user
      ? user.map((el) => {
          userIds.push(el.id);
          return {
            id: el.id,
            email: el.email,
            username: el.username || '',
            bio: el.bio || '',
            status: el.status || '',
            backgroundUrl: el.backgroundUrl || '',
            avatarUrl: el.avatarUrl || '',
            description: el.description || '',
            countSubscribers: el.subscribers,
          };
        })
      : [];

    return { subscribers, userIds };
  }
}
