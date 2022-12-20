import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthName, AuthService, CreateCommentResponse, VideoName, VideoService } from 'clap-proto';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateCommentsRequest } from './dto/request/create-comments-request';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

@Injectable()
export class CommentsService implements OnModuleInit {
  private svcVideo: VideoService;
  private svcAuth: AuthService;

  @Inject(VideoName)
  private readonly clientVideo: ClientGrpc;

  @Inject(AuthName)
  private readonly clientAuth: ClientGrpc;

  public onModuleInit(): void {
    this.svcVideo = this.clientVideo.getService<VideoService>('VideoService');
    this.svcAuth = this.clientAuth.getService<AuthService>('AuthService');
  }

  createComment(body: CreateCommentsRequest, metadata: Metadata): Observable<CreateCommentResponse> {
    return this.svcVideo.createComment(body, metadata);
  }

  createLikeComment(commentId: string, metadata: Metadata): Observable<any> {
    return this.svcVideo.createLikeComment({ id: commentId }, metadata);
  }

  removeComment(commentId: string, metadata): Observable<any> {
    return this.svcVideo.removeComment({ id: commentId }, metadata);
  }
}
