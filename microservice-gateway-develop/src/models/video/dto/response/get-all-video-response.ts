import { ApiProperty } from '@nestjs/swagger';

export class Video {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  isPinned: boolean;

  @ApiProperty()
  view: string;
}

export class GetAllVideoResponse {
  @ApiProperty({ type: Video, isArray: true })
  videos: Video[];
}
