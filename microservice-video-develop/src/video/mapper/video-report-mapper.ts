import { GetReportsResponse } from 'clap-proto';

export class VideoReportMapper {
  static getVideoReportsResponse(videoReport): GetReportsResponse {
    const userIds = [];
    const reports = videoReport
      ? videoReport.map((el) => {
          userIds.push(el.userId);
          userIds.push(el.video.ownerId);

          return {
            id: el.id,
            createdAt: el.createdAt,
            reason: el.reason,
            description: el.description,
            userId: el.userId,
            videoId: el.video.id,
            videoTitle: el.video.title,
            videoOwnerId: el.video.ownerId,
            report: el.video.report,
            status: el.video.status,
            videoUpload: el.video.createdAt,
          };
        })
      : [];

    return { reports, userIds };
  }

  static getReviewedReportsResponse(videoReport): GetReportsResponse {
    const userIds = [];
    const reports = videoReport
      ? videoReport.map((el) => {
          userIds.push(el.video.ownerId);

          return {
            id: el.id,
            createdAt: el.createdAt,
            reason: el.reason,
            description: el.description,
            userId: el.userId,
            videoId: el.video.id,
            videoTitle: el.video.title,
            videoOwnerId: el.video.ownerId,
            report: el.video.report,
            status: el.video.status,
            videoUpload: el.video.createdAt,
          };
        })
      : [];

    return { reports, userIds };
  }
}
