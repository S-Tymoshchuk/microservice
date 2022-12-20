import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    default: '01 Jan 1970 00:00:00 GMT',
  })
  @IsString()
  birthDate: string;
}
