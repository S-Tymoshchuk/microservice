import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReasonEnum } from '../../../user/enums/reason-enum';

export class ReportVideoRequest {
  @ApiProperty({ required: false })
  @IsEnum(ReasonEnum)
  @IsString()
  reason: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
}
