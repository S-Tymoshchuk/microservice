import { CategoryNameEnum } from '@enums/category-name.enum';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VideoEntity } from '@database/entities/video.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @Column({ type: 'enum', enum: CategoryNameEnum })
  public name: string;

  @Column()
  videoId: string;

  @ManyToOne(() => VideoEntity, (video: VideoEntity) => video.categories)
  @JoinColumn({ name: 'videoId' })
  video: VideoEntity;
}
