import { AppNames } from '@common/constants';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class ResponseLogger implements NestInterceptor<any, any> {
  private TAG: string;

  constructor(appName: AppNames) {
    this.TAG = appName.toUpperCase();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const reqID = req.headers['x-request-id'];
    const reqString = `[${reqID}] (${req.method}) ${req.url}`;
    return next.handle().pipe(
      map((data) => {
        console.log(`${this.TAG} <- ${reqString} - ${JSON.stringify(data)}`);
        return data;
      }),
      catchError((err) => {
        console.log(`${this.TAG} <- ${reqString} - ${JSON.stringify(err)}`);
        return throwError(() => err);
      }),
    );
  }
}
