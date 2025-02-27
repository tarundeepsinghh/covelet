import { Module } from '@nestjs/common';
import { CrudController } from './crud.controller';

@Module({
  controllers: [CrudController],
  imports: [],
})
export class CrudModule {}
