import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateQuery } from './paginate-query';
import { CategoryNameEnum } from '../../../../enums/category-name.enum';
import { Transform } from 'class-transformer';

export class PaginateSearchQuery extends PaginateQuery {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({ isArray: true, enum: CategoryNameEnum, required: false })
  @Transform(({ value }) => (!Array.isArray(value) ? [value] : value))
  @IsOptional()
  categories: CategoryNameEnum[];
}
