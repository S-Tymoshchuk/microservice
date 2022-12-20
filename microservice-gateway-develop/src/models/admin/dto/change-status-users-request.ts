import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { StatusUsersEnum } from '../enums/status-users-enum';

export class ChangeStatusUsersRequest {
  @ApiProperty()
  @IsEnum(StatusUsersEnum)
  @IsString()
  status: string;
}
