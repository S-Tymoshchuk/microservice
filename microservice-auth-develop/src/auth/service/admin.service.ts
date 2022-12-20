import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@database/entities/role.entity';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { User } from '@database/entities/user.entity';
import { GetListUsersRequest } from 'clap-proto';
import { CreateUsersQueryBuilder } from '../utils/get-users-query-builder';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getListUsers(query: GetListUsersRequest): Promise<{ users: User[]; count: number }> {
    const count = await this.userRepository.count();

    const users = await this.userRepository.find({
      where: CreateUsersQueryBuilder(query),
    });

    return { users, count };
  }

  async checkRole(metadata): Promise<void> {
    const user = metadata.getMap().user;
    const checkUserRole = await this.roleRepository.findOne({
      where: {
        id: user.role,
      },
    });

    if (checkUserRole.slug !== 'User') {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: "You don't have permission",
      });
    }
  }
}
