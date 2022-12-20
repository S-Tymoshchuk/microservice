import { Video } from 'clap-proto';

export class VideoReactionMapper {
  static getVideoReactionResponse(videoReaction): Video | [] {
    return videoReaction
      ? {
          id: videoReaction.video.id,
          url: videoReaction.video.url,
          title: videoReaction.video.title,
          ownerId: videoReaction.video.ownerId,
          duration: videoReaction.video.duration,
          view: videoReaction.video.view,
          createdAt: videoReaction.video.createdAt,
          isPinned: videoReaction.video.isPinned,
          type: videoReaction.type,
          categories: videoReaction.categories,
        }
      : [];
  }
}
