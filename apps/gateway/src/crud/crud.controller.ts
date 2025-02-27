import { ReqCoverLetterDto } from '@common/dtos/crud/cover-letter-req.dto';
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { SafeHeaders } from '../decorators/safe-headers.decorator';
import { handleAxiosError } from '../utils/axios-error-handler';
import { UpdateCoverLetterDto } from '@common/dtos/crud/update-cover-letter.dto';
import { ReplyCoverLetterDto } from '@common/dtos/crud/cover-letter-reply.dto';

@ApiTags('Cover Letter CRUD')
@ApiSecurity('bearer')
@Controller('coverletters')
export class CrudController {
  private crudUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.crudUrl = this.configService.get<string>('crudUrl');
  }

  @ApiBody({ type: ReqCoverLetterDto, required: true })
  @Post()
  async create(
    @SafeHeaders() headers,
    @Body() body: ReqCoverLetterDto,
  ): Promise<boolean> {
    const endpoint = `${this.crudUrl}`;
    const conf = { headers };
    try {
      console.log(body, headers);

      const response = await firstValueFrom(
        this.httpService.post(endpoint, body, conf),
      );
      return response.data;
    } catch (error) {
      console.log(error);

      handleAxiosError(error);
    }
  }

  @ApiQuery({ name: 'pno', type: Number, required: true })
  @Get()
  async list(
    @SafeHeaders() headers,
    @Query() query,
  ): Promise<ReplyCoverLetterDto[]> {
    const endpoint = `${this.crudUrl}`;
    const conf: AxiosRequestConfig = {
      params: query,
      headers: headers,
    };
    try {
      const response = await firstValueFrom(
        this.httpService.get(endpoint, conf),
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @ApiParam({ name: 'Id', type: 'string', required: true })
  @Get(':id')
  async findById(
    @SafeHeaders() headers,
    @Param('id') id: string,
  ): Promise<ReplyCoverLetterDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.crudUrl}/${id}`, {
          headers: headers,
        }),
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @ApiParam({ name: 'Id', type: 'string', required: true })
  @ApiBody({ type: UpdateCoverLetterDto, required: true })
  @Patch(':id')
  async updateBody(
    @SafeHeaders() headers,
    @Param('id') id: string,
    @Body() updateCoverLetterBody: UpdateCoverLetterDto,
  ): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(`${this.crudUrl}/${id}`, updateCoverLetterBody, {
          headers: headers,
        }),
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @ApiParam({ name: 'Id', type: 'string' })
  @Delete(':id')
  async remove(
    @SafeHeaders() headers,
    @Param('id') id: string,
  ): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.crudUrl}/${id}`, {
          headers: headers,
        }),
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
