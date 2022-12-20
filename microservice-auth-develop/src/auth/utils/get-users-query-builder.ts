import { GetListUsersRequest } from 'clap-proto';
import { Between, In } from 'typeorm';

export const CreateUsersQueryBuilder = (query: GetListUsersRequest) => {
  const filterUser = query.userName ? { username: In([...query.userName]) } : {};
  const filterEmail = query.email ? { email: In([...query.email]) } : {};
  const filterDate = query.dates ? { createdAt: Between(new Date(query.dates[0]), new Date(query.dates[1])) } : {};

  return { ...filterUser, ...filterEmail, ...filterDate };
};
