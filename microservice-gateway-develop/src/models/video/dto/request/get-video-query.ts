import { PaginateQuery } from './paginate-query';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetVideoQuery extends PaginateQuery {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId: string;
}
