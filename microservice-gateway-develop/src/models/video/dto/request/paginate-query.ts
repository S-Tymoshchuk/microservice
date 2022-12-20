import { BasePaginate } from './base-paginate';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginateQuery extends BasePaginate {
  @ApiProperty({ required: false, description: 'Any fields', example: 'createdAt' })
  @IsString()
  @IsOptional()
  field: string;

  @ApiProperty({ required: false, example: 'desc' })
  @IsString()
  @IsOptional()
  sort: string;
}
