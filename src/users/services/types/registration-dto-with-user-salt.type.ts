import { RegistrationDto } from 'src/users/controllers/dto/registration.dto';

export type RegistrationDtoWithUserSalt = RegistrationDto & {
  userSalt: string;
};
