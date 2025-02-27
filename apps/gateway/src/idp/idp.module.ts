import { Module } from '@nestjs/common';
import { IdpController } from './idp.controller';

@Module({
  controllers: [IdpController],
  imports: [],
})
export class IdpModule {}
