import { SetMetadata } from '@nestjs/common';

import { UserStatusesEnum } from '../enums/user-statuses.enum';

export const USER_STATUS_KEY = 'user-status';
export const SetUserStatus = (...statuses: UserStatusesEnum[]) =>
  SetMetadata(USER_STATUS_KEY, statuses);
