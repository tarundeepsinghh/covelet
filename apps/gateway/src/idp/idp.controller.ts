import LoginReqDto from '@common/dtos/idp/login-req.dto';
import RegisterReqDto from '@common/dtos/idp/register-req.dto';
import RegisterResDto from '@common/dtos/idp/register-res.dto';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { firstValueFrom } from 'rxjs';
import { handleAxiosError } from '../utils/axios-error-handler';

@Controller('')
@ApiTags('Identity & Auth')
export class IdpController {
  private idpUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.idpUrl = this.configService.get<string>('idpUrl');
  }

  @Post('register')
  @HttpCode(200)
  @ApiBody({ type: RegisterReqDto })
  @ApiOkResponse({
    description: 'Returns the newly created user object',
    type: RegisterResDto,
  })
  @ApiConflictResponse({
    description:
      'A conflict is returned if a user with the email already exists',
  })
  @ApiBadRequestResponse({
    description:
      'Returned if there are validation errors in the submitted body',
  })
  async register(@Body() registerDto: RegisterReqDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.idpUrl}/register`, registerDto),
      );
      return plainToInstance(RegisterResDto, response.data);
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginReqDto })
  @ApiOkResponse({
    description:
      'Perform validation of user credentials and return a jwt token on successful validation',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description:
      'Returned if the server is unable to verify the users credentials successfully',
  })
  @ApiBadRequestResponse({
    description:
      'Returned if there are validation errors in the submitted body',
  })
  async login(@Body() credentials: LoginReqDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post<string>(`${this.idpUrl}/login`, credentials),
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @Get('logout')
  @ApiSecurity('bearer')
  @ApiOkResponse({
    description: 'Returns a 200 status code with no response body on success',
  })
  @ApiUnauthorizedResponse({
    description:
      'A 401 response is returned if the bearer token cannot be validated',
  })
  async logout(@Headers() headers) {
    try {
      await firstValueFrom(
        this.httpService.get<void>(`${this.idpUrl}/logout`, { headers }),
      );
      return;
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
