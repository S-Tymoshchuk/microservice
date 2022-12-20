import { Body, Controller, Inject, OnModuleInit, Patch, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { LoginRequestDto } from './dto/login.dto';
import { ApiAcceptedResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AUTH_TAG } from '@docs/tags';
import { RegisterRequestDto } from './dto/register-request.dto';
import {
  AuthName,
  AuthService,
  ChangePasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginResponse,
  RefreshRequest,
  RegisterRequest,
} from 'clap-proto';
import { ChangePasswordRequestDto } from './dto/change-password-request.dto';
import { Meta } from '@decorators/meta.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags(AUTH_TAG)
@Controller('/auth')
export class AuthController implements OnModuleInit {
  private svc: AuthService;

  @Inject(AuthName)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthService>('AuthService');
  }

  @ApiBody({ type: RegisterRequestDto })
  @ApiCreatedResponse()
  @Post('/register')
  private async register(@Body() registerRequest: RegisterRequest) {
    return this.svc.register(registerRequest).toPromise();
  }

  @ApiCreatedResponse()
  @Post('/login')
  private async login(@Body() loginRequest: LoginRequestDto) {
    return this.svc.login(loginRequest).toPromise();
  }

  @ApiCreatedResponse()
  @Post('/forgotPassword')
  private async forgotPassword(@Body() body: ForgotPasswordRequestDto): Promise<Observable<ForgotPasswordResponse>> {
    const forgotPasswordRequest: ForgotPasswordRequest = { email: body.email };
    return this.svc.forgotPassword(forgotPasswordRequest);
  }

  @ApiAcceptedResponse()
  @Patch('/changePassword')
  private async changePassword(
    @Body() body: ChangePasswordRequestDto,
    @Meta() metadata,
  ): Promise<Observable<ChangePasswordResponse>> {
    return this.svc.changePassword(body, metadata);
  }

  @ApiBearerAuth()
  @ApiOkResponse()
  @Post('/refresh')
  private async refresh(@Body() body: RefreshTokenDto): Promise<Observable<LoginResponse>> {
    const refreshRequest: RefreshRequest = { refreshToken: body.refreshToken };
    return this.svc.refresh(refreshRequest);
  }
}
