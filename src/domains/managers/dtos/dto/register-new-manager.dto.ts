import { RolesEntity } from 'src/core/entities/roles.entity';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { ManagerEmailDto } from 'src/domains/managers/dtos/dto/manager-email.dto';

export interface RegisterNewManagerDto extends ManagerEmailDto {
  role: RolesEntity;
  password: string;
  userSalt: string;
  status: UserStatusesEnum;
}
