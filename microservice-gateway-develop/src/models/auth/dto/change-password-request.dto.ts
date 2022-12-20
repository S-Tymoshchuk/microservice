import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChangePasswordRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  token: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;
}
