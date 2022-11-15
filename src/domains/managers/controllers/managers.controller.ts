import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SetRole } from 'src/core/decorators/roles.decorator';
import { SetUserStatus } from 'src/core/decorators/user-status.decorator';

import { MainRoutingEnum } from 'src/core/enums/main-routing.enum';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { UserStatusesGuard } from 'src/core/guards/user-status.guard';
import { SchemaValidatePipe } from 'src/core/pipes/schema-validate.pipe';
import { BasicResponse } from 'src/core/utils/dtos/responses/basic.response';
import { ManagersManager } from 'src/domains/managers/managers/managers.manager';
import { RegisterNewManagerSchema } from 'src/domains/managers/dtos/schemas/register-new-manager.schema';
import { ManagerEmailDto } from 'src/domains/managers/dtos/dto/manager-email.dto';
import { UniqueEmailGuard } from 'src/core/guards/unique-email.guard';

@Controller(MainRoutingEnum.MANAGERS)
export class ManagersController {
  constructor(private readonly managersManager: ManagersManager) {}

  @SetRole(RolesEnum.ADMIN)
  @SetUserStatus(UserStatusesEnum.ACTIVE)
  @UseGuards(RolesGuard, UserStatusesGuard, UniqueEmailGuard)
  @Post()
  async registerNewManager(
    @Body(new SchemaValidatePipe(RegisterNewManagerSchema))
    managerEmailDto: ManagerEmailDto,
  ): Promise<BasicResponse> {
    return this.managersManager.registerNewManager(managerEmailDto);
  }
}
