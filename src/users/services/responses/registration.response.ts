import { UserEntity } from 'src/core/entities/user.entity';

export interface RegistrationResponse {
  user: UserEntity;
  token: string;
}
