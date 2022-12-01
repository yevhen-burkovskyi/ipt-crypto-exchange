import { MainRoutingEnum } from 'src/core/enums/main-routing.enum';

export const GENERATE_FILE_UPLOADS_ROUTE = (path: string): string =>
  MainRoutingEnum.FILE_UPLOADS + '/' + path;
