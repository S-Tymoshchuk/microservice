import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PinnedVideoRequest {
  @ApiProperty()
  @IsBoolean()
  isPinned: boolean;
}
