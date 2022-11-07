import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UsersManager } from 'src/domains/users/managers/users.manager';
import { Public } from 'src/core/decorators/public.decorator';
import { SetRole } from 'src/core/decorators/roles.decorator';
import { SetUserStatus } from 'src/core/decorators/user-status.decorator';
import { Context } from 'src/core/decorators/user-context.decorator';
import { UniqueEmailGuard } from 'src/core/guards/unique-email.guard';
import { UserStatusesGuard } from 'src/core/guards/user-status.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { SchemaValidatePipe } from 'src/core/pipes/schema-validate.pipe';
import { UsersInterceptor } from 'src/core/interceptors/users.interceptor';
import { MainRoutingEnum } from 'src/core/enums/main-routing.enum';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { RegistrationSchema } from 'src/domains/users/dtos/schemas/registration.schema';
import { LoginSchema } from 'src/domains/users/dtos/schemas/login.schema';
import { PersonalInformationSchema } from 'src/domains/users/dtos/schemas/personal-information.schema';
import { UserContext } from 'src/core/types/user-context.type';
import { RegistrationResponse } from 'src/domains/users/dtos/responses/registration.response';
import { UserResponse } from 'src/domains/users/dtos/responses/user.response';
import { PersonalInformationDto } from 'src/domains/users/dtos/dto/personal-information.dto';
import { LoginDto } from 'src/domains/users/dtos/dto/login.dto';
import { RegistrationDto } from 'src/domains/users/dtos/dto/registration.dto';
import { SendEmailTimeout } from 'src/core/guards/email-timeout.guard';
import { ApproveEmailSchema } from 'src/domains/users/dtos/schemas/approve-email.schema';
import { ApproveEmailDto } from 'src/domains/users/dtos/dto/approve-email.dto';
import { BasicResponse } from 'src/core/utils/dtos/responses/basic.response';

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
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new SchemaValidatePipe(LoginSchema))
    loginDto: LoginDto,
  ): Promise<RegistrationResponse> {
    return this.usersManager.login(loginDto);
  }

  @SetRole(RolesEnum.USER)
  @SetUserStatus(UserStatusesEnum.I_AM_NEW_HERE)
  @UseGuards(RolesGuard, UserStatusesGuard)
  @Patch('personal-information')
  async personalInformation(
    @Body(new SchemaValidatePipe(PersonalInformationSchema))
    personalInformationDto: PersonalInformationDto,
    @Context()
    userContext: UserContext,
  ): Promise<UserResponse> {
    await this.usersManager.setUserPersonalInformation(
      personalInformationDto,
      userContext.userId,
    );
    return this.usersManager.getUserByUserId(userContext.userId);
  }

  @SetRole(RolesEnum.USER)
  @SetUserStatus(UserStatusesEnum.EMAIL_VERIFICATION)
  @UseGuards(RolesGuard, UserStatusesGuard, SendEmailTimeout)
  @Get('send-email-approve')
  async sendEmailApprove(
    @Context() userContext: UserContext,
  ): Promise<BasicResponse> {
    return this.usersManager.sendEmailApprove(userContext.userId);
  }

  @Public()
  @Get('approve-email')
  async approveEmail(
    @Query(new SchemaValidatePipe(ApproveEmailSchema))
    approveEmailDto: ApproveEmailDto,
  ) {
    return this.usersManager.activateUserEmail(approveEmailDto);
  }
}
