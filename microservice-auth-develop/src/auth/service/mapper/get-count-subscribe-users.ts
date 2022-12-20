export class GetCountSubscribeUsers {
  static getCountSubscribe(user): { subscribe: number } | number {
    return user ? user.subscribers : 0;
  }
}
