import { In, Like } from 'typeorm';
import { GetUsersByIdRequest } from 'clap-proto';

export const CreateUsersReportQueryBuilder = (query: GetUsersByIdRequest) => {
  const filterUser = { id: In(query.users) };
  const filterCreator = query.creator ? { username: Like(`%${query.creator}%`) } : {};

  return { ...filterUser, ...filterCreator };
};
