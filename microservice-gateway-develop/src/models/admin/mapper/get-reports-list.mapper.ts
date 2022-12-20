import { Reports } from 'clap-proto';

export class GetReportsListMapper {
  static getReportsListMapper(
    report: Reports,
    users: { users: { userId: string; username: string }[] },
  ): Reports & { createdBy: string; ownerName: string } {
    return {
      id: report.id,
      createdAt: report.createdAt,
      reason: report.reason,
      description: report.description,
      userId: report.userId,
      videoId: report.videoId,
      videoTitle: report.videoTitle,
      videoOwnerId: report.videoOwnerId,
      report: report.report,
      status: report.status,
      videoUpload: report.videoUpload,
      createdBy: Object.keys(users).length == 0 ? null : GetReportsListMapper.findUsers(report.userId, users),
      ownerName: Object.keys(users).length == 0 ? null : GetReportsListMapper.findUsers(report.videoOwnerId, users),
    };
  }

  static findUsers(userId, { users }): string {
    const result = users.find((el) => el.userId === userId);
    if (!result) {
      return null;
    }
    return result.username;
  }
}
