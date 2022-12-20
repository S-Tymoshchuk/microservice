import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { StatusEnum } from '../enums/status-reports-enum';

export class ChangeStatusReport {
  @ApiProperty()
  @IsEnum(StatusEnum)
  @IsString()
  status: string;
}
