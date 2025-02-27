import { HttpService } from '@nestjs/axios';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { firstValueFrom } from 'rxjs';
import { handleAxiosError } from '../utils/axios-error-handler';

export interface IRequestWithUserId extends FastifyRequest {
  userId: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private url: string;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.url = `${this.configService.get<string>('idpUrl')}`;
  }

  async use(
    req: FastifyRequest['raw'],
    reply: FastifyReply['raw'],
    next: () => void,
  ) {
    const headers = req.headers;
    if (!headers['authorization']) {
      throw new UnauthorizedException();
    }
    try {
      const response = await firstValueFrom(
        this.httpService.get<number>(`${this.url}/verify`, { headers }),
      );
      const userId = response.data;
      req.headers['x-user-id'] = userId.toString();
      console.log(req.headers);
      next();
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
