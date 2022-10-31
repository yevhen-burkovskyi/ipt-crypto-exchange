import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { CacheManager } from 'src/cache/managers/cache.manager';
import { RequestWithUserContextType } from 'src/core/types/request-with-user-context.type';

@Injectable()
export class SendEmailTimeout implements CanActivate {
  constructor(private readonly cacheManager: CacheManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUserContextType = context
      .switchToHttp()
      .getRequest();
    const userId = request?.userContext?.userId;
    return this.cacheManager.emailTimeoutVerefication(userId);
  }
}
