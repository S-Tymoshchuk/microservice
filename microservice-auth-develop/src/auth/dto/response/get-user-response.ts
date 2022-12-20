import { StatusEnum } from '../../common/types/status.enum';

export interface GetUserResponse {
  backgroundUrl: string;
  avatarUrl: string;
  countSubscribe: number;
  bio: string;
  id: string;
  birthDate: Date;
  email: string;
  status: StatusEnum;
  username: string;
  description: string;
  isPrivate: boolean;
  countSubscribeIds: string[];
  role: string;
}
