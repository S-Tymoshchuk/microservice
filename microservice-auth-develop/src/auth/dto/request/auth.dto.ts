import { IsEmail, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  GetUserProfileRequest,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
} from 'clap-proto';

export class LoginRequestDto implements LoginRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}

export class RegisterRequestDto implements RegisterRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  public readonly password: string;

  @IsString()
  public readonly username: string;

  @IsString()
  public readonly birthDate: string;
}

export class ForgotPasswordRequestDto implements ForgotPasswordRequest {
  @IsEmail()
  public readonly email: string;
}

export class ChangePasswordRequestDto implements ChangePasswordRequest {
  @IsString()
  @MinLength(8)
  @IsOptional()
  public readonly password: string;

  @IsString()
  @IsOptional()
  token: string;

  @IsString()
  @IsOptional()
  currentPassword: string;
}

export class RefreshRequestDto implements RefreshRequest {
  @IsString()
  public readonly refreshToken: string;
}

export class GetUserProfileRequestDto implements GetUserProfileRequest {
  @IsString()
  @IsUUID()
  userId: string;
}
