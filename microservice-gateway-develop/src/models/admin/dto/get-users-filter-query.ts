import { PaginateQuery } from '../../video/dto/request/paginate-query';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetUsersFilterQuery extends PaginateQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  dates: string[];

  @ApiProperty({ isArray: true, type: String, required: false })
  @IsString({ each: true })
  @Transform(({ value }) => (!Array.isArray(value) ? [value] : value))
  @IsOptional()
  userName: string[];

  @ApiProperty({ isArray: true, type: String, required: false })
  @IsString({ each: true })
  @Transform(({ value }) => (!Array.isArray(value) ? [value] : value))
  @IsOptional()
  email: string[];
}
