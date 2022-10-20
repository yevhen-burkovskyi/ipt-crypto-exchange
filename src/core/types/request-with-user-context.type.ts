import { Request } from 'express';

import { UserContext } from 'src/core/types/user-context.type';

export type RequestWithUserContextType = Request & {
  userContext?: UserContext;
};
