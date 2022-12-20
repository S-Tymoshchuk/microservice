import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoComments } from '@database/entities/video-comments.entity';
import {
  CreateCommentRequest,
  CreateLikeCommentResponse,
  RemoveCommentResponse,
} from 'clap-proto';
import { VideoCommentsLikesEntity } from '@database/entities/video-comments-likes.entity';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { VideoEntity } from '@database/entities/video.entity';

@Injectable()
export class VideoCommentService {
  constructor(
    @InjectRepository(VideoComments)
    private readonly videoComments: Repository<VideoComments>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectRepository(VideoCommentsLikesEntity)
    private readonly videoCommentsLike: Repository<VideoCommentsLikesEntity>,
  ) {}

  async createComment(
    commentBody: CreateCommentRequest,
    userId: string,
  ): Promise<VideoComments> {
    const comment = this.videoComments.create({ ...commentBody, userId });
    return this.videoComments.save(comment);
  }

  async createLikeComment(
    commentId: string,
    userId: string,
  ): Promise<CreateLikeCommentResponse> {
    const checkLike = await this.videoCommentsLike.findOne({
      where: {
        commentId,
        userId,
      },
    });

    if (!checkLike) {
      const commentLike = this.videoCommentsLike.create({ commentId, userId });
      await this.videoCommentsLike.save(commentLike);
    } else {
      await this.videoCommentsLike.remove(checkLike);
    }
    return { status: HttpStatus.OK, error: null };
  }

  async removeComment(
    commentId: string,
    userId: string,
  ): Promise<RemoveCommentResponse> {
    const commentPermission = await this.videoComments.findOne({
      where: { id: commentId },
    });

    const ownerVideo = await this.videoRepository.findOne({
      where: {
        id: commentPermission.videoId,
      },
    });

    if (!commentPermission) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Comment not found',
      });
    }

    if (
      userId === String(commentPermission.userId) ||
      userId === String(ownerVideo.ownerId)
    ) {
      await this.videoComments.delete({ id: commentId });
    } else {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: "You don't have permission.",
      });
    }
    return { status: HttpStatus.OK, error: null };
  }
}
