import { PaginateQuery } from '../../../video/dto/request/paginate-query';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetCreatorsQuery extends PaginateQuery {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search: string;
}
