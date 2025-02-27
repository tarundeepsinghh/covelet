import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { UserId, UserIdHandler } from './user-id.decorator';

describe('UserId decorator', () => {
  describe('Decorator', () => {
    it('should be defined', () => {
      expect(UserId).toBeDefined();
    });
  });

  describe('UserIdHandler', () => {
    it('should return the custom value for the parameter', () => {
      const TestUID = 3;
      const headers: IncomingHttpHeaders = {
        'x-user-id': TestUID.toString(),
      };
      const req = { headers } as IncomingMessage; // Mock the req by setting its type
      const ctx = new ExecutionContextHost([req, null]);
      const uid = UserIdHandler(null, ctx);
      expect(typeof uid).toBe('number');
      expect(uid).toBe(3);
    });

    it('should throw an Unauthorized exception if header is missing', () => {
      const headers: IncomingHttpHeaders = {};
      const req = { headers } as IncomingMessage; // Moch the req by setting its type
      const ctx = new ExecutionContextHost([req, null]);
      expect(() => UserIdHandler(null, ctx)).toThrowError(
        UnauthorizedException,
      );
    });
  });
});
