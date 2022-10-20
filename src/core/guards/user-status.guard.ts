import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UsersDao } from 'src/users/dao/users.dao';
import { RequestWithUserContextType } from 'src/core/types/request-with-user-context.type';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { USER_STATUS_KEY } from 'src/core/decorators/user-status.decorator';

@Injectable()
export class UserStatusesGuard implements CanActivate {
  constructor(
    private readonly usersDao: UsersDao,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userStatuses = this.reflector.getAllAndOverride<UserStatusesEnum[]>(
      USER_STATUS_KEY,
      [context.getHandler(), context.getClass()],
    );
    const request: RequestWithUserContextType = context
      .switchToHttp()
      .getRequest();

    return userStatuses.includes(request.userContext.userStatus);
  }
}
