import { HttpService } from '@nestjs/axios';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { handleAxiosError } from '../utils/axios-error-handler';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GeneratorDto } from '@common/dtos/generator/generator.dto';

@Controller('generator')
@ApiTags('Generator')
export class GeneratorController {
  private genUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.genUrl = this.configService.get<string>('generatorUrl');
  }

  @Post()
  @HttpCode(200)
  @ApiSecurity('bearer')
  @ApiBody({ type: GeneratorDto })
  @ApiOkResponse({
    description: 'Returns the Generatred coverLetter according to inputs ',
    type: String,
  })
  @ApiConflictResponse({
    description:
      'A conflict is returned if there is a issue in third party-api',
  })
  @ApiBadRequestResponse({
    description: 'Returned if there somthing went wrong',
  })
  async generate(@Body() generatorReqBody: GeneratorDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.genUrl}`, generatorReqBody, {
          timeout: 30000,
        }),
      );
      const coverLetterBody = response.data;
      return coverLetterBody;
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
