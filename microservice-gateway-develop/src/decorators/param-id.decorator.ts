import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ParamId {
  @ApiProperty()
  @IsString()
  id: string;
}
