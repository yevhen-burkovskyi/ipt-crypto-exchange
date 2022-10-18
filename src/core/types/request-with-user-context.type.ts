import { Request } from 'express';

import { TokenBodyDto } from 'src/users/services/dto/token-body.dto';

export type RequestWithUserContextType = Request & {
  userContext?: TokenBodyDto;
};
