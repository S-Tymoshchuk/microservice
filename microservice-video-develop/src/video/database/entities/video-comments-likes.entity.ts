import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoComments } from '@database/entities/video-comments.entity';

@Entity()
export class VideoCommentsLikesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  commentId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => VideoComments,
    (comment: VideoComments) => comment.commentsLikes,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'commentId' })
  comments: VideoComments;
}
