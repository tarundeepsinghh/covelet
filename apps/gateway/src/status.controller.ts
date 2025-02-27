import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, forkJoin } from 'rxjs';

@Controller('status')
export class StatusController {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  async statusBoard() {
    const idpHealth = this.http.get(
      `${this.config.get<string>('idpUrl')}/health`,
    );

    const crudHealth = this.http.get(
      `${this.config.get<string>('crudUrl')}/health`,
    );

    const generatorHealth = this.http.get(
      `${this.config.get<string>('generatorUrl')}/health`,
    );

    const cacheHealth = this.http.get(
      `${this.config.get<string>('cacheUrl')}/health`,
    );

    const results = (
      await firstValueFrom(
        forkJoin([idpHealth, crudHealth, generatorHealth, cacheHealth]),
      )
    ).map((response) => response.data);

    return {
      idp: results[0],
      crud: results[1],
      generator: results[2],
      cache: results[3],
    };
  }
}
