import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GeneratorWithBodyDto } from '@common/dtos/cache/generator-with-body.dto';
import { AxiosError } from 'axios';
import { GeneratorDto } from '@common/dtos/generator/generator.dto';

@Injectable()
export class CacheService {
  private BaseUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.BaseUrl = `${this.configService.get<string>('cacheUrl')}`;
  }

  async check(generatorReqBody: GeneratorDto): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<string>(
          `${this.BaseUrl}/check`,
          generatorReqBody,
          { timeout: 5000 },
        ),
      );
      return response.data;
    } catch (error) {
      if (!error.isAxiosError) {
        console.error(error);
        return '';
      }
      if ((error as AxiosError).response.status === 404) {
        console.log('Cache Missed');
        return '';
      }
      console.error(`Error: ${error.response.status} : ${error.response.data}`);
    }
  }

  async add(generatorReq: GeneratorWithBodyDto): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<true>(`${this.BaseUrl}/create`, generatorReq),
      );
      return response.data;
    } catch (error) {
      console.error('Error in CacheService.add()', error);
      return false;
    }
  }
}
