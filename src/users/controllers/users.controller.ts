import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Public } from 'src/core/decorators/public.decorator';
import { MainRoutingEnum } from 'src/core/enums/main-routing.enum';
import { UniqueEmailGuard } from 'src/core/guards/unique-email.guard';
import { UsersInterceptor } from 'src/core/interceptors/users.interceptor';
import { SchemaValidatePipe } from 'src/core/pipes/schema-validate.pipe';
import { RegistrationDto } from 'src/users/controllers/dto/registration.dto';
import { RegistrationSchema } from 'src/users/controllers/schemas/registration.schema';
import { UsersManager } from 'src/users/managers/users.manager';
import { RegistrationResponse } from 'src/users/services/responses/registration.response';
import { LoginDto } from 'src/users/controllers/dto/login.dto';
import { LoginSchema } from 'src/users/controllers/schemas/login.schema';

@Controller(MainRoutingEnum.USERS)
@UseInterceptors(UsersInterceptor)
export class UsersController {
  constructor(private readonly usersManager: UsersManager) {}

  @Public()
  @UseGuards(UniqueEmailGuard)
  @Post('registration')
  async registration(
    @Body(new SchemaValidatePipe(RegistrationSchema))
    registrationDto: RegistrationDto,
  ): Promise<RegistrationResponse> {
    return this.usersManager.registration(registrationDto);
  }

  @Public()
  @Post('login')
  async login(
    @Body(new SchemaValidatePipe(LoginSchema))
    loginDto: LoginDto,
  ): Promise<RegistrationResponse> {
    return this.usersManager.login(loginDto);
  }
}
