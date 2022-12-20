import { UserImagesTypeEnum } from '../../enums/uploud-img-enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class UploadImgTypeRequest {
  @ApiProperty({ required: false })
  @IsEnum(UserImagesTypeEnum)
  @IsString()
  type: string;
}
