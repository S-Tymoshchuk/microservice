import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoEntity } from '@database/entities/video.entity';
import { ReactionTypeEnum } from '@enums/reaction-type.enum';

@Entity()
export class VideoReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReactionTypeEnum })
  type: string;

  @Column()
  videoId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => VideoEntity, (video: VideoEntity) => video.histories)
  @JoinColumn({ name: 'videoId' })
  video: VideoEntity;
}
