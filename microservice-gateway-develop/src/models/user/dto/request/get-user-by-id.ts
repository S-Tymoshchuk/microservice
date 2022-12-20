import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetUserById {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId: string;
}
