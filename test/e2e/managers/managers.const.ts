import { MainRoutingEnum } from 'src/core/enums/main-routing.enum';
import { ManagerEmailDto } from 'src/domains/managers/dtos/dto/manager-email.dto';

export const CREATE_MANAGER: ManagerEmailDto = {
  email: 'some@gmail.com',
};

export const GENERATE_MANAGERS_ROUTE = (path: string): string =>
  MainRoutingEnum.MANAGERS + '/' + path;
