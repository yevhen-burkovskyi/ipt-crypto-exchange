import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';
import { UsersManager } from 'src/domains/users/managers/users.manager';

@Injectable()
export class UniqueEmailGuard implements CanActivate {
  constructor(private readonly usersManager: UsersManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request?.body?.email;

    if (email) {
      const isEmailExists = await this.usersManager.isEmailExists(email);
      if (!isEmailExists) {
        return true;
      }
    }

    throw new ForbiddenException(ErrorMessagesEnum.UNIQUE_EMAIL);
  }
}
