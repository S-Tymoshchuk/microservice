import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FullSearchResponse, GetAllSearchVideoResponse } from './dto/response/get-all-search-video-response';
import { PaginateSearchQuery } from './dto/request/paginate-search-query';
import { VideoServiceGateway } from './video.service-gateway';
import { SEARCH_TAG } from '@docs/tags';

@ApiTags(SEARCH_TAG)
@Controller()
export class SearchController {
  constructor(private readonly videoService: VideoServiceGateway) {}

  @ApiOkResponse({ type: FullSearchResponse })
  @Get('search')
  getSearchVideo(@Query() query: PaginateSearchQuery) {
    return this.videoService.getSearchVideo(query);
  }
}
