import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentsRequest {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  videoId: string;
}
