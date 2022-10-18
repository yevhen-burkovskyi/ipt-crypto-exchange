import { Injectable } from '@nestjs/common';

import { UsersSerice } from 'src/users/services/users.service';
import { RegistrationDto } from 'src/users/controllers/dto/registration.dto';
import { RegistrationResponse } from 'src/users/services/responses/registration.response';
import { LoginDto } from 'src/users/controllers/dto/login.dto';

@Injectable()
export class UsersManager {
  constructor(private readonly usersService: UsersSerice) {}

  registration(payload: RegistrationDto): Promise<RegistrationResponse> {
    return this.usersService.registration(payload);
  }

  login(payload: LoginDto): Promise<RegistrationResponse> {
    return this.usersService.login(payload);
  }
}
