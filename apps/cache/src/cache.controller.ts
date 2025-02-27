import { GeneratorWithBodyDto } from '@common/dtos/cache/generator-with-body.dto';
import { GeneratorDto } from '@common/dtos/generator/generator.dto';
import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Controller()
export class CacheController {
  private inMemoryCache = new Map<string, string>();

  private generateHash(genReq: GeneratorDto) {
    const dataAsString = JSON.stringify(genReq);
    const hash = crypto.createHash('sha512');
    hash.update(dataAsString);
    return hash.digest('hex');
  }

  @Post('/check')
  getValue(@Body() coverLetterBody: GeneratorDto) {
    const hash = this.generateHash(coverLetterBody);
    if (!this.inMemoryCache.has(hash)) {
      throw new NotFoundException('Key not found in cache');
    }
    return this.inMemoryCache.get(hash);
  }

  @Post('/create')
  createCache(@Body() coverLetterBody: GeneratorWithBodyDto) {
    try {
      const { body, ...genReq } = coverLetterBody;
      const hash = this.generateHash(genReq);
      this.inMemoryCache.set(hash, body);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('/flush')
  flush(@Headers('X-ADMIN-KEY') adminKey: string) {
    if (!adminKey || adminKey !== 'beans') {
      throw new UnauthorizedException();
    }
    this.inMemoryCache.clear();
  }
}
