import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEnum } from '../../common/types/role.enum';
import { StatusEnum } from '../../common/types/status.enum';
import { UserFollowerEntity } from '@database/entities/user-folower.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  username!: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'timestamp', nullable: true })
  birthDate!: Date;

  @Column({ type: 'varchar', nullable: true })
  bio: string;

  @Column({
    type: 'text',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status!: StatusEnum;

  @Column({ type: 'varchar', nullable: true })
  backgroundUrl!: string;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl!: string;

  @Column({ type: 'enum', enum: RoleEnum })
  role: RoleEnum;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isPrivate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserFollowerEntity, (follower) => follower.following, { eager: false })
  @JoinColumn({ referencedColumnName: 'followingId' })
  followings: UserFollowerEntity[];

  @OneToMany(() => UserFollowerEntity, (follower) => follower.follower, { eager: false })
  @JoinColumn({ referencedColumnName: 'followerId' })
  followers: UserFollowerEntity[];
}
