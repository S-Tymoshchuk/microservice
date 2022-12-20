import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { AboutMeEnum } from '../../enums/about-me-enum';

export class GetVideoAboutRequest {
  @ApiProperty()
  @IsString()
  @IsEnum(AboutMeEnum)
  type: string;
}
