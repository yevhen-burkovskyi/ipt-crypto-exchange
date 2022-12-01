import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserEntity } from 'src/core/entities/user.entity';

export interface Response<T> {
  data: T;
}

@Injectable()
export class UsersInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data?.hasOwnProperty('user') && data.user) {
          return { ...data, user: this.excludeHiddenFields(data.user) };
        } else if (data?.hasOwnProperty('users') && data.users) {
          const users = [];
          for (const user of data.users) {
            users.push(this.excludeHiddenFields(user));
          }
          return { ...data, users };
        }

        return data;
      }),
    );
  }

  private excludeHiddenFields(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
      status: user.status,
      role: user.role,
      fileUploads: user.fileUploads,
    };
  }
}
