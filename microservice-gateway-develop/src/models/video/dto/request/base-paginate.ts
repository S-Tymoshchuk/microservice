import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class BasePaginate {
  @ApiProperty({ required: false, example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  pageSize: number;

  @ApiProperty({ required: false, example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page: number;
}
