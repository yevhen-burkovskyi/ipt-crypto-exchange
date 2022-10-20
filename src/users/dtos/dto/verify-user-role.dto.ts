import { RolesEnum } from 'src/core/enums/roles.enum';

export interface VerifyUserRoleDto {
  userId: string;
  roleName: RolesEnum[];
}
