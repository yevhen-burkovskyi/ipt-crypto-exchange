import { UserResponse } from 'src/users/dtos/responses/user.response';

export interface RegistrationResponse extends UserResponse {
  token: string;
}
