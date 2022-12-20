import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '@database/entities/category.entity';
import { VideoHistory } from '@database/entities/video-history.entity';
import { VideoReaction } from '@database/entities/video-reaction.entity';
import { VideoViews } from '@database/entities/video-view.entity';
import { VideoComments } from '@database/entities/video-comments.entity';
import { VideoReport } from '@database/entities/video-report.entity';
import { StatusEnum } from '@enums/status-enum';

@Entity()
export class VideoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: null })
  url: string;

  @Column({ default: null })
  previewUrl: string;

  @Column({ default: null })
  quality720: string;

  @Column({ default: null })
  quality1080: string;

  @Column({ default: false })
  isTransform: boolean;

  @Column({ default: null })
  hashVideo: string;

  @Column({ default: null })
  title: string;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  ownerId: string;

  @Column({ default: null })
  duration: number;

  @Column({ default: false })
  isPinned: boolean;

  @Column({
    default: 0,
  })
  view: number;

  @Column({
    default: 0,
  })
  report: number;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.DEFAULT })
  status: StatusEnum;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Category, (category) => category.video, {
    cascade: true,
  })
  categories: Category[];

  @OneToMany(() => VideoHistory, (videos) => videos.video)
  histories: VideoHistory[];

  @OneToMany(() => VideoReaction, (videos) => videos.video)
  reactions: VideoReaction[];

  @OneToMany(() => VideoViews, (videos) => videos.video)
  views: VideoViews[];

  @OneToMany(() => VideoComments, (videos) => videos.video)
  comments: VideoComments[];

  @OneToMany(() => VideoReport, (videos) => videos.video)
  reports: VideoReport[];
}
