import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AdminService } from './service/admin.service';
import { ChangeStatusUserResponse, GetListUsersRequest } from 'clap-proto';
import { AuthService } from './service/auth.service';
import { GetUserResponse } from './dto/response/get-user-response';
import { User } from '@database/entities/user.entity';
import { AuthJWT } from '@decorators/auth-jwt.decorator';
import { RoleEnum } from './common/types/role.enum';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService, private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'GetListUsers')
  @AuthJWT({ roleGuard: [RoleEnum.Admin] })
  getListUsers(query: GetListUsersRequest): Promise<{ users: User[] }> {
    return this.adminService.getListUsers(query);
  }

  @GrpcMethod('AuthService', 'GetUserInfoById')
  @AuthJWT({ roleGuard: [RoleEnum.Admin] })
  async getUserInfoById({ id }): Promise<GetUserResponse | []> {
    return this.authService.getUserInfo(id);
  }

  @GrpcMethod('AuthService', 'ChangeStatusUser')
  @AuthJWT({ roleGuard: [RoleEnum.Admin] })
  async changeStatusUser({ id, status }): Promise<ChangeStatusUserResponse> {
    return this.authService.changeStatusUser(id, status);
  }
}
