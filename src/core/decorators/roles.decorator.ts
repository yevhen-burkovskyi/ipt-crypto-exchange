import { SetMetadata } from '@nestjs/common';

import { RolesEnum } from 'src/core/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const SetRole = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
