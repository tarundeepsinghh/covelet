import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuid } from 'uuid';

export function RequestLoggerMiddlewareFactory(TAG: string) {
  return function RequestLoggerMiddleware(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void,
  ) {
    if (!req.headers['x-request-id']) {
      req.headers['x-request-id'] = uuid();
    }
    const reqID = req.headers['x-request-id'];
    console.log(
      // eslint-disable-next-line prettier/prettier
      `${TAG.toUpperCase()} -> [${reqID}] (${req.method}) ${req.url}`,
    );
    next();
  };
}
