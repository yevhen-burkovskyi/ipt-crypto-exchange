import { RegistrationDtoWithRole } from 'src/domains/users/dtos/types/registration-dto-with-role.type';

export type RegistrationDtoWithUserSalt = RegistrationDtoWithRole & {
  userSalt: string;
};
