import { InternalServiceException } from '@common/api-errors';
import { Body, Controller, Post } from '@nestjs/common';
import { CacheService } from './cache.service';
import { GeneratorService } from './generator.service';
import { GeneratorDto } from '@common/dtos/generator/generator.dto';

@Controller()
export class GeneratorController {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly cache: CacheService,
  ) {}

  @Post()
  async generate(@Body() generatorReqBody: GeneratorDto) {
    // Check if a coverletter is available in the cache (CACHE HIT)
    let body = await this.cache.check(generatorReqBody);
    if (body) {
      return body;
    }
    body = await this.generatorService.generate(generatorReqBody);
    if (body === '') {
      throw InternalServiceException;
    }
    const success = await this.cache.add({ ...generatorReqBody, body });
    if (!success) {
      throw InternalServiceException;
    }
    return body;
  }
}
