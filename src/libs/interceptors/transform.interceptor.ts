import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { finalize, map, Observable } from 'rxjs';

export const IgnoredPropertyName = Symbol('IgnoredPropertyName');

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    const ip = request.headers['x-forwarded-for']
      ? (request.headers['x-forwarded-for'] as string).split(',')[0].trim()
      : request.ip;

    const now = Date.now();
    const timestamp = new Date().toISOString();

    if (url === '/api/v1/health') {
      return next.handle();
    }

    Logger.log(`info ${timestamp} ip: ${ip} method: ${method} url: ${url}`);

    const isIgnored = context.getHandler()[IgnoredPropertyName];
    if (isIgnored) {
      return next.handle();
    }

    return next.handle().pipe(
      map((response: any) => {
        if (response && response.status && response.info) {
          return response;
        }
        return {
          statusCode: response?.statusCode,
          data: response?.data,
          meta: response?.meta,
          message: response?.message,
        };
      }),
      finalize(() => {
        Logger.log(`Execution time... ${Date.now() - now}ms`);
      })
    );
  }
}

export function TransformInterceptorIgnore() {
  return function transformInterceptorIgnore(
    _target,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value[IgnoredPropertyName] = true;
  };
}
