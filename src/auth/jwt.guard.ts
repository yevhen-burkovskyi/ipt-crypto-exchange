import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from 'src/core/decorators/public.decorator';
import { JwtValidationResultDto } from 'src/auth/dto/jwt-validation-result.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const jwtAuthHeader = request.headers?.authorization;
    if (isPublic && !jwtAuthHeader) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: Error, res: JwtValidationResultDto): any {
    if (err || !res.isValid) {
      throw err || new UnauthorizedException();
    }
    return res;
  }
}
