import { PaginateQuery } from './paginate-query';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReasonEnum } from '../../../user/enums/reason-enum';

export class ReportFilterQuery extends PaginateQuery {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  creator: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  videoId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  dates: string[];

  @ApiProperty({ required: false })
  @IsEnum(ReasonEnum)
  @IsString()
  @IsOptional()
  reason: string;
}
