import { Injectable } from '@nestjs/common';

import { ManagersDao } from 'src/domains/managers/dao/managers.dao';
import { RegisterNewManagerDto } from 'src/domains/managers/dtos/dto/register-new-manager.dto';

@Injectable()
export class ManagersService {
  constructor(private readonly managersDao: ManagersDao) {}

  async registerNewManager(payload: RegisterNewManagerDto): Promise<void> {
    await this.managersDao.registerNewManager(payload);
  }
}
