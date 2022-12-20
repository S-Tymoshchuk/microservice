import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserInfoRequest {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  @Matches(/^[0-9a-zA-z@$!%*#^()+-=;':"|{},<>\/?&_ -]*$/)
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  @Matches(/^[A-Za-z][0-9a-zA-z_ -]*$/)
  @IsOptional()
  username: string;
}
