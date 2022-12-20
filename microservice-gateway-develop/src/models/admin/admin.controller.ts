import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ADMIN_PATH } from '@docs/path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Meta } from '@decorators/meta.decorator';
import { Metadata } from '@grpc/grpc-js';
import { ADMIN_TAG } from '@docs/tags';
import { GetUsersFilterQuery } from './dto/get-users-filter-query';
import { ParamId } from '@decorators/param-id.decorator';
import { ChangeStatusUsersRequest } from './dto/change-status-users-request';
import { ReportFilterQuery } from '../video/dto/request/report-filter-query';
import { PaginateQuery } from '../video/dto/request/paginate-query';
import { ChangeStatusReport } from './dto/change-status.report';

@ApiBearerAuth()
@ApiTags(ADMIN_TAG)
@Controller(ADMIN_PATH)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getListUsers(@Query() query: GetUsersFilterQuery, @Meta() metadata: Metadata) {
    return this.adminService.getListUsers(query, metadata);
  }

  @Get('users/:id')
  getUserInfoById(@Param() param: ParamId, @Meta() metadata: Metadata) {
    return this.adminService.getUserInfoById(param.id, metadata);
  }

  @Get('users/:id/video')
  getUserContentById(@Param() param: ParamId, @Meta() metadata: Metadata) {
    return this.adminService.getUserContentById(param.id, metadata);
  }

  @Patch('users/:id')
  changeStatusUser(@Param() param: ParamId, @Body() body: ChangeStatusUsersRequest, @Meta() metadata: Metadata) {
    return this.adminService.changeStatusUser(param.id, body, metadata);
  }

  @Get('reports')
  getReports(@Query() query: ReportFilterQuery, @Meta() metadata: Metadata) {
    return this.adminService.getReports(query, metadata);
  }

  @Get('reviewed')
  getReviewedReports(@Query() query: PaginateQuery, @Meta() metadata: Metadata) {
    return this.adminService.getReviewedReports(query, metadata);
  }

  @Patch('reports/status/:id')
  updateStatusReport(@Param() param: ParamId, @Body() body: ChangeStatusReport, @Meta() metadata: Metadata) {
    return this.adminService.updateStatusReport(param, body, metadata);
  }

  @Get('videos')
  getVideoContent(@Meta() metadata: Metadata) {
    return this.adminService.getVideoContent(metadata);
  }
}
