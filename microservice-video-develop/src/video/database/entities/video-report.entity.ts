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
import { ReasonEnum } from '@enums/reason-enum';
import { StatusEnum } from '@enums/status-enum';

@Entity()
export class VideoReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReasonEnum })
  reason: string;

  @Column()
  videoId: string;

  @Column({ default: null })
  description: string;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.DEFAULT })
  status: StatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => VideoEntity, (video: VideoEntity) => video.id)
  @JoinColumn({ name: 'videoId' })
  video: VideoEntity;
}
