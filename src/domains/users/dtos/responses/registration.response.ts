import { UserResponse } from 'src/domains/users/dtos/responses/user.response';

export interface RegistrationResponse extends UserResponse {
  token: string;
}
