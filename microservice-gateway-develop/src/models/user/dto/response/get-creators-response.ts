import { ApiProperty } from '@nestjs/swagger';
import { ServiceApiResponse } from '@decorators/abstract-service-api';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
export class Creators {
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

export class GetCreatorsResponse extends ServiceApiResponse<Creators> {
  @ApiModelProperty({ type: Creators, isArray: true })
  rows: Creators;
}
