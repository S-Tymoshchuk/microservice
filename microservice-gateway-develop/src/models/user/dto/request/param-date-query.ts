import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ParamDateQuery {
  @ApiProperty({ required: false, isArray: true, type: String })
  @IsString({ each: true })
  @IsOptional()
  dates: string[];
}
