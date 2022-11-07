import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RequestWithUserContextType } from 'src/core/types/request-with-user-context.type';
import { ROLES_KEY } from 'src/core/decorators/roles.decorator';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { UsersManager } from 'src/domains/users/managers/users.manager';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly usersManager: UsersManager,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.getAllAndOverride<RolesEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request: RequestWithUserContextType = context
      .switchToHttp()
      .getRequest();
    return this.usersManager.verifyUserRole({
      userId: request.userContext.userId,
      roleName: role,
    });
  }
}
