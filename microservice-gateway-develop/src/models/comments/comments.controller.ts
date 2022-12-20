import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentsRequest } from './dto/request/create-comments-request';
import { Meta } from '@decorators/meta.decorator';
import { COMMENTS_TAG } from '@docs/tags';
import { COMMENT_PATH } from '@docs/path';
import { ParamId } from '@decorators/param-id.decorator';

@ApiBearerAuth()
@ApiTags(COMMENTS_TAG)
@Controller(COMMENT_PATH)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  createComment(@Body() body: CreateCommentsRequest, @Meta() metadata) {
    return this.commentsService.createComment(body, metadata);
  }

  @Get('like/:id')
  createCommentLike(@Param() param: ParamId, @Meta() metadata) {
    return this.commentsService.createLikeComment(param.id, metadata);
  }

  @Delete(':id')
  removeComment(@Param() param: ParamId, @Meta() metadata) {
    return this.commentsService.removeComment(param.id, metadata);
  }
}
