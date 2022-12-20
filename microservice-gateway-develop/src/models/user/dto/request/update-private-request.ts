import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdatePrivateRequest {
  @ApiProperty()
  @IsBoolean()
  isPrivate: boolean;
}
