import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserContext } from 'src/core/types/user-context.type';
import { RequestWithUserContextType } from 'src/core/types/request-with-user-context.type';

export const Context = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserContext => {
    const request: RequestWithUserContextType = ctx.switchToHttp().getRequest();
    return request.userContext as UserContext;
  },
);
