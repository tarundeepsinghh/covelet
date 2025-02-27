import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

export interface RequestWithUserId extends ExpressRequest {
  userId: number;
}

export const UserIdHandler = (data: unknown, ctx: ExecutionContext) => {
  const request: ExpressRequest = ctx.switchToHttp().getRequest();
  const headers = request.headers;

  // Check for the presence of the headers
  if (!headers || !headers['x-user-id']) {
    console.warn('unable to extract user id from headers');
    throw new UnauthorizedException();
  }
  console.log('headers are present');

  // Check that conversion of header value to number is possible
  try {
    return parseInt(headers['x-user-id'] as string);
  } catch (error) {
    console.warn(
      'unable to parse user id from header as a number',
      headers['x-user-id'],
    );
    throw new UnauthorizedException();
  }
};

export const UserId = createParamDecorator(UserIdHandler);
