import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { UsersDao } from 'src/users/dao/users.dao';
import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';

@Injectable()
export class UniqueEmailGuard implements CanActivate {
  constructor(private readonly usersDao: UsersDao) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request?.body?.email;

    if (email) {
      const isEmailExists = await this.usersDao.isEmailExists(email);
      if (!isEmailExists) {
        return true;
      }
    }

    throw new ForbiddenException(ErrorMessagesEnum.UNIQUE_EMAIL);
  }
}
