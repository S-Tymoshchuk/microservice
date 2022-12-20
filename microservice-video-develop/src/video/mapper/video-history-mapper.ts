import { Video } from 'clap-proto';

export class VideoHistoryMapper {
  static getVideoHistoryResponse(videoHistory): Video | [] {
    return videoHistory
      ? {
          id: videoHistory.video.id,
          url: videoHistory.video.url,
          title: videoHistory.video.title,
          ownerId: videoHistory.video.ownerId,
          duration: videoHistory.video.duration,
          view: videoHistory.video.view,
          createdAt: videoHistory.video.createdAt,
          isPinned: videoHistory.video.isPinned,
          categories: videoHistory.categories,
        }
      : [];
  }
}
