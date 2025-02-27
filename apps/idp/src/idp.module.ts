import { Environments } from '@common/constants';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheckModule } from '@libs/health-check';
import config from './config';
import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';
import { IdpController } from './idp.controller';
import { IdpService } from './idp.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.idp.env',
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSerice: ConfigService) => {
        return {
          type: 'mysql',
          host: configSerice.get<string>('database.host'),
          port: configSerice.get<number>('database.port'),
          username: configSerice.get<string>('database.user'),
          password: configSerice.get<string>('database.pass'),
          database: configSerice.get<string>('database.name'),
          entities: [User, Token],
          synchronize:
            configSerice.get<string>('env') === Environments[0] ? true : false,
        };
      },
    }),
    TypeOrmModule.forFeature([User, Token]),
    HealthCheckModule,
  ],
  controllers: [IdpController],
  providers: [IdpService],
})
export class IdpModule {}
