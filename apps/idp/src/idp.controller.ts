import { AlreadyRegisteredException } from '@common/api-errors';
import LoginReqDto from '@common/dtos/idp/login-req.dto';
import RegisterReqDto from '@common/dtos/idp/register-req.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  HttpCode,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { IdpService } from './idp.service';

@Controller()
export class IdpController {
  constructor(
    private readonly idpService: IdpService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyBearerToken(
    bearerToken: string,
  ): Promise<{ jwt: string; userId: number }> {
    if (!bearerToken) {
      throw new UnauthorizedException();
    }
    const jwt = bearerToken.split(' ')[1];
    try {
      const uidString = (await this.jwtService.verifyAsync(
        jwt,
      )) as unknown as string;
      const userId = parseInt(uidString);
      return { jwt, userId };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }

  @Post('register')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async register(
    @Body() newUserDetails: RegisterReqDto,
  ): Promise<Partial<User>> {
    try {
      const createdUser = await this.idpService.register(newUserDetails);
      return createdUser;
    } catch (error) {
      if (!error.code) throw new InternalServerErrorException();
      switch (error.code) {
        case 'ER_DUP_ENTRY':
          throw AlreadyRegisteredException;
        default:
          console.error(error);
          throw new InternalServerErrorException();
      }
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() credentials: LoginReqDto): Promise<string> {
    const result = await this.idpService.getUserSecret(credentials.email);
    if (!result) {
      throw new UnauthorizedException();
    }
    const { secret, id: userId } = result;

    // Check if password is valid
    if (!(await argon2.verify(secret, credentials.password))) {
      throw new UnauthorizedException();
    }
    // Generate a new jwt and upsert into the token table
    try {
      const token = await this.jwtService.signAsync(String(userId));
      await this.idpService.saveToken(userId, token);
      return token;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @Get('logout')
  async logout(@Headers('Authorization') bearerToken: string): Promise<void> {
    const { userId } = await this.verifyBearerToken(bearerToken);
    await this.idpService.clearTokensForUser(userId);
  }

  @Get('verify')
  async verify(@Headers('Authorization') bearerToken: string): Promise<string> {
    if (!bearerToken || bearerToken.length < 10) {
      throw new UnauthorizedException();
    }
    try {
      const { userId, jwt } = await this.verifyBearerToken(bearerToken);
      const foundUserId = await this.idpService.getUserIdFromToken(jwt);
      if (!foundUserId || foundUserId !== userId)
        throw new UnauthorizedException();
      return userId.toString();
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}
