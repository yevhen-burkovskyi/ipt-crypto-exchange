import { UserEntity } from 'src/core/entities/user.entity';
import { MainRoutingEnum } from 'src/core/enums/main-routing.enum';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { ServerUtils } from 'src/core/utils/server.utils';
import { ApproveEmailDto } from 'src/domains/users/dtos/dto/approve-email.dto';
import { ApproveUsersIdentityDto } from 'src/domains/users/dtos/dto/approve-users-identity.dto';
import { PersonalInformationDto } from 'src/domains/users/dtos/dto/personal-information.dto';
import { RegistrationDto } from 'src/domains/users/dtos/dto/registration.dto';
import { RegistrationResponse } from 'src/domains/users/dtos/responses/registration.response';
import { UserResponse } from 'src/domains/users/dtos/responses/user.response';
import { UsersResponse } from 'src/domains/users/dtos/responses/users.response';
import { MOCK_STRING } from 'test/utils/test.conts';

export const USER_FOR_REGISTRATION: RegistrationDto = {
  email: 'some@gmail.com',
  password: 'test1234',
};

export const USER_WITH_PASSWORD_INFO = {
  id: MOCK_STRING,
  password: MOCK_STRING,
  userSalt: MOCK_STRING,
  email: MOCK_STRING,
  profile: null,
  status: UserStatusesEnum.ACTIVE,
  role: null,
  fileUploads: null,
};

export const USER_PERSONAL_INFORMATION: PersonalInformationDto = {
  firstName: MOCK_STRING,
  lastName: MOCK_STRING,
  DOB: new Date(Date.now() - ServerUtils.take18YearsInMs()),
  COR: MOCK_STRING,
  COB: MOCK_STRING,
  phoneNumber: MOCK_STRING,
};

export const APPROVE_EMAIL_QUERY: ApproveEmailDto = {
  approveToken: MOCK_STRING,
};

export const APPROVE_USERS_IDENTITY: ApproveUsersIdentityDto = {
  userIds: [MOCK_STRING],
};

export const CREATE_INCORRECT_OBJECT = (obj: any) => ({
  ...obj,
  incorrectField: 'I`m incorrect!',
});

export const EXCLUDE_PASSWORD_INFO_FROM_OBJECT = (obj: any) => {
  const tmp: any = { ...obj };

  delete tmp.password;
  delete tmp.userSalt;

  return tmp;
};

export const MODIFY_USER_STATUS = (
  usr: UserEntity,
  newStatus: UserStatusesEnum,
): UserEntity => ({ ...usr, status: newStatus });

export const GENERATE_USER_RESPONSE = (): UserResponse => ({ user: null });

export const GENERATE_REGISTRATION_RESPONSE = (
  user: UserEntity = null,
): RegistrationResponse => ({ token: null, user });

export const GENERATE_USERS_RESPONSE = (): UsersResponse => ({ users: null });

export const GENERATE_USER_ROUTE = (path: string): string =>
  MainRoutingEnum.USERS + '/' + path;
