import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';
import { ChangePasswordRequestDto, ForgotPasswordRequestDto, LoginRequestDto, RegisterRequestDto } from '../dto/request/auth.dto';
import { User } from '@database/entities/user.entity';
import {
  ChangePasswordResponse,
  ChangeStatusUserResponse,
  ForgotPasswordResponse,
  GetUsersByIdRequest,
  LoginResponse,
  RefreshRequest,
  UpdatePrivateRequest,
  UpdatePrivateResponse,
  UpdateUserImgRequest,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  UserSubscribeResponse,
} from 'clap-proto';
import { MailerService } from '@nestjs-modules/mailer';
import { StatusEnum } from '../common/types/status.enum';
import { RoleEnum } from '../common/types/role.enum';
import { GetUserInfoMapper } from './mapper/get-user-info-mapper';
import { GetUsersResponse } from '../dto/response/get-users-response';
import { GetUserProfileResponseDto } from '../dto/response/get-user-profile.response.dto';
import { plainToInstance } from 'class-transformer';
import { UserFollowerEntity } from '@database/entities/user-folower.entity';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GetUserMapper } from './mapper/get-user-mapper';
import { GetUserResponse } from '../dto/response/get-user-response';
import { CreateUsersReportQueryBuilder } from '../utils/get-users-report-query-builder';
import { GetUsersMySubscribe } from './mapper/get-users-my-subscribe';
import { AppDataSource } from '@config/typeorm.config-datasource';
import { GetCountSubscribeUsers } from './mapper/get-count-subscribe-users';

@Injectable()
export class AuthService {
  queryRunner;
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailingService: MailerService,
    @InjectRepository(UserFollowerEntity)
    private readonly userFollowerRepository: Repository<UserFollowerEntity>,
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    this.queryRunner = AppDataSource.initialize();
  }

  public async register(
    registerRequestDto: RegisterRequestDto,
  ): Promise<{ error: null | string; token: string; refreshToken: string; status: HttpStatus.OK | HttpStatus.CONFLICT }> {
    let user: User = await this.repository.findOne({ where: { email: registerRequestDto.email } });
    const error: any = {};
    if (user) {
      error.email = 'A user with such email already exists';
    }

    const username: User = await this.repository.findOne({ where: { username: registerRequestDto.username } });

    if (username) {
      error.username = 'This nickname is already taken. Please try another one';
    }

    if (error.email || error.username) {
      return { token: '', refreshToken: '', status: HttpStatus.CONFLICT, error: JSON.stringify(error) };
    }

    user = new User();

    user.email = registerRequestDto.email;
    user.password = this.jwtService.encodePassword(registerRequestDto.password);
    user.username = registerRequestDto.username;
    user.birthDate = new Date(registerRequestDto.birthDate);
    user.status = StatusEnum.ACTIVE;
    user.role = RoleEnum.User;
    const savedUser = await this.repository.save(user);

    await this.mailingService.sendMail({
      to: user.email,
      subject: 'Registration',
      text: `Welcome to CLAP, ${registerRequestDto.username}! Your account has been successfully created!`,
    });

    const token: string = await this.jwtService.generateToken(savedUser);

    const refreshToken: string = await this.jwtService.generateRefreshToken(savedUser);

    return { token, refreshToken, status: HttpStatus.OK, error: null };
  }

  public async login({ email, password }: LoginRequestDto): Promise<LoginResponse> {
    const user: User = await this.repository.findOne({ where: { email } });

    const error: any = {};

    if (!user) {
      error.email = "User with such email doesn't exist";
      return { status: HttpStatus.NOT_FOUND, error: JSON.stringify(error), token: null, refreshToken: null };
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
      error.email = "Email and password don't matсh.";
      error.password = "Email and password don't matсh.";
    }

    if (error.email || error.password) {
      return { status: HttpStatus.NOT_FOUND, error: JSON.stringify(error), token: null, refreshToken: null };
    }

    const token: string = await this.jwtService.generateToken(user);

    const refreshToken: string = await this.jwtService.generateRefreshToken(user);

    return { token, refreshToken, status: HttpStatus.OK, error: null };
  }

  public async refresh({ refreshToken }: RefreshRequest): Promise<LoginResponse> {
    try {
      const decoded = this.jwtService.verifyRefreshToken(refreshToken);

      const user = await this.repository.findOne({ where: { id: decoded.sub } });

      if (!user) {
        return { status: HttpStatus.NOT_FOUND, error: 'User not found', token: null, refreshToken: null };
      }

      const token: string = await this.jwtService.generateToken(user);
      const newRefreshToken: string = await this.jwtService.generateRefreshToken(user);

      return { token, refreshToken: newRefreshToken, status: HttpStatus.OK, error: null };
    } catch (e) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Unauthorized',
      });
    }
  }

  public async forgotPassword({ email }: ForgotPasswordRequestDto): Promise<ForgotPasswordResponse> {
    const user: User = await this.repository.findOne({ where: { email } });

    if (!user) {
      return { status: HttpStatus.NOT_FOUND, error: ["User with such email doesn't exist"], token: null };
    }

    const token: string = await this.jwtService.generateRefreshToken(user);

    await this.mailingService.sendMail({
      to: user.email,
      subject: 'Change your password',
      text: `http://localhost:3000/new-password?token=${token}`,
    });

    // TODO: we should not return this token directly to a user
    return { status: HttpStatus.OK, error: null, token: '' };
  }

  public async changePassword(body: ChangePasswordRequestDto, metadata): Promise<ChangePasswordResponse> {
    if (body.token) {
      const decoded = this.jwtService.verifyRefreshToken(body.token);

      if (!decoded) {
        return { status: HttpStatus.FORBIDDEN, error: ['Token is invalid'] };
      }

      await this.repository.update({ id: decoded.sub }, { password: this.jwtService.encodePassword(body.password) });

      return { status: HttpStatus.OK, error: null };
    } else {
      const userId = metadata.getMap().user?.sub;
      const user = await this.repository.findOne({ where: { id: userId } });

      if (!user) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'User not found',
        });
      }

      const checkCurrentPassword = this.jwtService.isPasswordValid(body.currentPassword, user.password);
      if (!checkCurrentPassword) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'The current password did not match',
        });
      }

      await this.repository.update({ id: userId }, { password: this.jwtService.encodePassword(body.password) });

      return { status: HttpStatus.OK, error: null };
    }
  }

  async getUsersByIds(query: GetUsersByIdRequest): Promise<{ users: (GetUsersResponse | [])[] }> {
    const result = await this.repository
      .find({ where: CreateUsersReportQueryBuilder(query) })
      .then((res) => res.map(GetUserInfoMapper.getUserInfoResponse));

    return { users: result };
  }

  async getUserProfile(userId: string): Promise<GetUserProfileResponseDto> {
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) throw new RpcException('No such user!');
    return plainToInstance(GetUserProfileResponseDto, user);
  }
  async userSubscribe(followingId: string, userId: string): Promise<UserSubscribeResponse> {
    const findUser = await this.repository.findOne({ where: { id: followingId } });

    if (!findUser) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }

    if (followingId === userId) {
      throw new RpcException({ code: status.INVALID_ARGUMENT, message: 'You cannot subscribe to yourself' });
    }

    const createSubscribe = await this.userFollowerRepository.create({ followingId, followerId: userId });

    const checkSubscribe = await this.userFollowerRepository.findOne({ where: { followingId, followerId: userId } });

    if (checkSubscribe) {
      throw new RpcException({ code: status.ALREADY_EXISTS, message: 'You are already subscribed to this user' });
    }

    await this.userFollowerRepository.save(createSubscribe);

    return { status: HttpStatus.OK, error: null };
  }

  async getUserInfo(userId: string): Promise<GetUserResponse | []> {
    const countSubscriber = await this.userFollowerRepository.find({ where: { followerId: userId } });

    return this.repository
      .findOne({ where: { id: userId } })
      .then((res) => GetUserMapper.getUseResponse(res, countSubscriber, userId));
  }

  async updateUserInfo(body: UpdateUserInfoRequest, userId: string): Promise<UpdateUserInfoResponse> {
    const checkPermission = await this.repository.findOne({
      where: {
        id: userId,
      },
    });

    if (checkPermission?.id !== userId) {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: `You don't have permission`,
      });
    }
    await this.repository.update({ id: userId }, { ...body });

    return { status: HttpStatus.OK, error: null };
  }

  async updatePrivate(body: UpdatePrivateRequest, userId: string): Promise<UpdatePrivateResponse> {
    const checkPermission = await this.repository.findOne({
      where: {
        id: userId,
      },
    });

    if (checkPermission?.id !== userId) {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: `You don't have permission`,
      });
    }
    await this.repository.update({ id: userId }, { ...body });

    return { status: HttpStatus.OK, error: null };
  }

  updateUserImg(body: UpdateUserImgRequest, userId: string): void {
    this.repository.update({ id: userId }, { ...body }).then();
  }

  async changeStatusUser(userId: string, status: StatusEnum): Promise<ChangeStatusUserResponse> {
    await this.repository.update({ id: userId }, { status });

    return { status: HttpStatus.OK, error: null };
  }

  async getMySubscriptions(userId: string) {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.followings', 'following')
      .loadRelationCountAndMap('following.subscribers', 'user.followings', 'followings2')
      .where('following.follower = :userId', { userId })
      .getMany()
      .then(GetUsersMySubscribe.getUsersMySubscribeResponse);
  }

  async userUnSubscribe(followingId: string, followerId: string): Promise<UserSubscribeResponse> {
    const userFollowing = await this.userFollowerRepository.findOne({
      where: { followingId, followerId },
    });
    if (!userFollowing) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `User following not found`,
      });
    }
    await this.userFollowerRepository.softDelete({
      followingId,
      followerId,
    });

    return { status: HttpStatus.OK, error: null };
  }

  async getStatisticSubscribers(dates: string[], userId: string) {
    const queryRunner = await this.queryRunner;
    const result = await queryRunner.manager
      .query(
        `select count(*) filter ( where "followingId" = $1 and "deletedAt" is null)::int as follower,
               count(*) filter ( where "followingId" = $1
          and "createdAt" between $2 and $3 and "deletedAt" is null)::int as newfollower,
          count(*) filter ( where "followingId" = $1
          and "createdAt" between $2 and $3 and "deletedAt" is not null)::int as unfollower
          from user_followers;`,
        [userId, dates[0], dates[1]],
      )
      .then((res) => (res ? res[0] : {}));

    return {
      followerStatistic: result,
    };
  }

  async getCountSubscribeById(userId: string): Promise<any> {
    const result = await this.repository
      .createQueryBuilder('user')
      .loadRelationCountAndMap('user.subscribers', 'user.followings', 'follower')
      .where('user.id = :userId', { userId })
      .getOne();

    return { countSubscribers: GetCountSubscribeUsers.getCountSubscribe(result) };
  }

  async getCreators(query, userId: string) {
    const qb = await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.followings', 'following')
      .leftJoinAndSelect('user.followers', 'follower')
      .loadRelationCountAndMap('following.subscribers', 'user.followings', 'follower');

    if (userId) {
      qb.where('following.followerId != :userId or following IS NULL', { userId });
    }

    if (query.search) {
      qb.andWhere(`user.username ilike :search`, {
        search: `%${query.search.toLowerCase()}%`,
      });
    }

    return qb.getMany().then((res) => GetUsersMySubscribe.getUsersMySubscribeResponse(res.filter((el) => el.id !== userId)));
  }
}
