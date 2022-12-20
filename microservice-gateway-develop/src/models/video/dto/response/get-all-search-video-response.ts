import { ApiProperty } from '@nestjs/swagger';
import { ServiceApiResponse } from '@decorators/abstract-service-api';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class Category {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;
}

export class VideoSearch {
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
  view: number;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  comments: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  previewUrl: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  userDescription: string;

  @ApiProperty({ isArray: true, type: Category })
  categories: Category[];
}

export class Creator {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  backgroundUrl: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  countSubscribers: number;

  @ApiProperty()
  countVideos: number;
}

export class GetAllSearchVideoResponse extends ServiceApiResponse<VideoSearch> {
  @ApiModelProperty({ type: VideoSearch, isArray: true })
  rows: VideoSearch;
}

export class GetAllSearchCreatorResponse extends ServiceApiResponse<Creator> {
  @ApiModelProperty({ type: Creator, isArray: true })
  rows: Creator;
}

export class FullSearchResponse {
  @ApiProperty()
  videos: GetAllSearchVideoResponse;

  @ApiProperty()
  creators: GetAllSearchCreatorResponse;
}
