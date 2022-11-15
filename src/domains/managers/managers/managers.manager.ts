import { HttpStatus, Injectable } from '@nestjs/common';
import { ManagersResponsesEnum } from 'src/core/enums/managers-responses.enum';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';

import { BasicResponse } from 'src/core/utils/dtos/responses/basic.response';
import { ServerUtils } from 'src/core/utils/server.utils';
import { BcryptManager } from 'src/modules/bcrypt/managers/bcrypt.manager';
import { RolesManager } from 'src/modules/roles/managers/roles.manager';
import { SmtpManager } from 'src/modules/smtp/managers/smtp.manager';
import { ManagerEmailDto } from 'src/domains/managers/dtos/dto/manager-email.dto';
import { RegisterNewManagerDto } from 'src/domains/managers/dtos/dto/register-new-manager.dto';
import { ManagersService } from 'src/domains/managers/services/managers.service';

@Injectable()
export class ManagersManager {
  constructor(
    private readonly managersService: ManagersService,
    private readonly rolesManager: RolesManager,
    private readonly bcryptManager: BcryptManager,
    private readonly smtpManager: SmtpManager,
  ) {}

  async registerNewManager(payload: ManagerEmailDto): Promise<BasicResponse> {
    const managerRole = await this.rolesManager.getRoleByName(
      RolesEnum.MANAGER,
    );
    const randomPassword = ServerUtils.generateManagerPassword();
    const encryptResponse = await this.bcryptManager.encrypt(randomPassword);
    const managerWithRoleDto: RegisterNewManagerDto = {
      email: payload.email,
      role: managerRole,
      password: encryptResponse.encryptedPassword,
      userSalt: encryptResponse.salt,
      status: UserStatusesEnum.ACTIVE,
    };

    await this.managersService.registerNewManager(managerWithRoleDto);

    const emailForManagerDto = {
      managerEmail: payload.email,
      password: randomPassword,
    };

    this.smtpManager.sendEmailWithManagerCredentals(emailForManagerDto);

    return ServerUtils.createCommonResponse(
      ManagersResponsesEnum.MANAGER_CREATED,
      HttpStatus.CREATED,
    );
  }
}
