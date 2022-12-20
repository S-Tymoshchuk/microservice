import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoEntity } from '@database/entities/video.entity';
import { VideoCommentsLikesEntity } from '@database/entities/video-comments-likes.entity';

@Entity()
export class VideoComments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  videoId: string;

  @Column()
  text: string;

  @Column()
  userId: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => VideoEntity, (video: VideoEntity) => video.histories)
  @JoinColumn({ name: 'videoId' })
  video: VideoEntity;

  @OneToMany(() => VideoCommentsLikesEntity, (videos) => videos.comments)
  commentsLikes: VideoCommentsLikesEntity[];
}
