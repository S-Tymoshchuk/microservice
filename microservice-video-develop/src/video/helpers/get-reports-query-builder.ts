import { Between, Like } from 'typeorm';
import { StatusEnum } from '@enums/status-enum';

export const CreateReportsQueryBuilder = (query) => {
  const filterVideo = query.videoId
    ? { videoId: query.videoId }
    : { video: { status: StatusEnum.DEFAULT } };

  const filterTitle = query.title
    ? { video: { title: Like(`%${query.title}%`) } }
    : {};

  const filterReason = query.reason ? { reason: query.reason } : {};

  const filterDate = query.dates
    ? { createdAt: Between(new Date(query.dates[0]), new Date(query.dates[1])) }
    : {};

  return { ...filterReason, ...filterDate, ...filterTitle, ...filterVideo };
};
