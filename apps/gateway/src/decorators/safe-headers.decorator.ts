import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SafeHeaders = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const {
      raw: { headers },
    } = ctx.switchToHttp().getRequest();
    const safeHeaders = {
      authorization: headers['authorization'],
      'content-type': headers['content-type'],
      'user-agent': 'CovLet Gateway',
      'x-user-id': headers['x-user-id'],
      'x-request-id': headers['x-request-id'],
    };
    console.table([headers, safeHeaders]);
    return safeHeaders;
  },
);
