import { ApiProperty } from '@nestjs/swagger';

export class GetSaveVideoResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  previewUrl: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  hashVideo: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ isArray: true, type: String })
  category: string[];
}
