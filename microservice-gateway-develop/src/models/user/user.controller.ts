import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { USER_TAG } from '@docs/tags';
import { USER_PATH } from '@docs/path';
import { ParamId } from '@decorators/param-id.decorator';
import { Meta } from '@decorators/meta.decorator';
import { GetVideoAboutRequest } from './dto/request/get-video-about-request';
import { ParamDateQuery } from './dto/request/param-date-query';
import { Metadata } from '@grpc/grpc-js';
import { UserService } from './user.service';
import { UpdateUserInfoRequest } from './dto/request/update-user-info-request';
import { UpdatePrivateRequest } from './dto/request/update-private-request';
import { GetUrlVideoResponse } from '../video/dto/response/get-url-video-response';
import { UploadVideoDecorator } from '@decorators/upload-video.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadImgTypeRequest } from './dto/request/upload-img-type-request';
import { UploadImgResponse } from 'clap-proto';
import { PaginateQuery } from '../video/dto/request/paginate-query';
import { GetUserById } from './dto/request/get-user-by-id';
import { GetCreatorsQuery } from './dto/request/get-creators-query';
import { GetCreatorsResponse } from './dto/response/get-creators-response';

@ApiTags(USER_TAG)
@Controller(USER_PATH)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Post('about-me/:id')
  getWatchedVideo(@Param() param: ParamId, @Body() body: GetVideoAboutRequest, @Meta() metadata) {
    return this.userService.getWatchedVideo({ id: param.id, type: body.type }, metadata);
  }

  @ApiBearerAuth()
  @Get('dashboard')
  getStudioInfo(@Meta() metadata) {
    return this.userService.getStudioInfo(metadata);
  }

  @ApiBearerAuth()
  @Get('statistic')
  getStatisticInfo(@Query() query: ParamDateQuery, @Meta() metadata) {
    return this.userService.getStatisticInfo(query, metadata);
  }

  @ApiBearerAuth()
  @Post('subscribe/:id')
  userSubscribe(@Param() param: ParamId, @Meta() metadata) {
    return this.userService.userSubscribe(param, metadata);
  }

  @ApiBearerAuth()
  @Get()
  getUserInfo(@Query() query: GetUserById, @Meta() metadata: Metadata) {
    return this.userService.getUserInfo(query, metadata);
  }

  @ApiBearerAuth()
  @Patch()
  updateUserInfo(@Body() body: UpdateUserInfoRequest, @Meta() metadata: Metadata) {
    return this.userService.updateUserInfo(body, metadata);
  }

  @ApiBearerAuth()
  @Patch('private')
  updatePrivate(@Body() body: UpdatePrivateRequest, @Meta() metadata: Metadata) {
    return this.userService.updatePrivate(body, metadata);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GetUrlVideoResponse })
  @Post('upload-img/:type')
  @UploadVideoDecorator()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadImg(
    @UploadedFile()
    file: Express.Multer.File,
    @Param() { type }: UploadImgTypeRequest,
    @Meta() meta: Metadata,
  ): Promise<UploadImgResponse> {
    const send = {
      binary: file.buffer,
      mime: file.mimetype,
      originalName: file.originalname,
    };
    return this.userService.uploadImg(send, type, meta);
  }

  @ApiBearerAuth()
  @Delete('remove-img/:type')
  deleteImg(@Param() { type }: UploadImgTypeRequest, @Meta() metadata: Metadata) {
    return this.userService.deleteImg(type, metadata);
  }

  @ApiBearerAuth()
  @Get('subscriptions')
  getMySubscriptions(@Query() query: PaginateQuery, @Meta() metadata: Metadata) {
    return this.userService.getMySubscriptions(query, metadata);
  }

  @ApiBearerAuth()
  @Delete('unsubscribe/:id')
  userUnSubscribe(@Param() param: ParamId, @Meta() metadata) {
    return this.userService.userUnSubscribe(param, metadata);
  }

  @ApiOkResponse({ type: GetCreatorsResponse })
  @Get('creators')
  getCreators(@Query() query: GetCreatorsQuery, @Meta() metadata) {
    return this.userService.getCreators(query, metadata);
  }
}
