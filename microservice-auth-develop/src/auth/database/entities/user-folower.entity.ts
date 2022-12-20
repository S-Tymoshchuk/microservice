import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@database/entities/user.entity';

@Entity({ name: 'user_followers' })
export class UserFollowerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followingId: string;

  @Column()
  followerId: string;

  @ManyToOne(() => User, (user) => user.followings)
  @JoinColumn({ name: 'followingId' })
  following: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
