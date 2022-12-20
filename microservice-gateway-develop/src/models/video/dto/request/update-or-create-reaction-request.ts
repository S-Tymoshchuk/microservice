import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateOrCreateReactionRequest {
  @ApiProperty()
  @IsString()
  type: string;
}
