import { TokenBodyDto } from 'src/users/services/dto/token-body.dto';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';

export type UserContext = TokenBodyDto & { userStatus: UserStatusesEnum };
