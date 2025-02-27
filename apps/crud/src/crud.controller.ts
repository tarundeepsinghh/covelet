import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CoverLetterService } from './crud.service';
import { UserId } from './decorators/user-id.decorator';
import { ReqCoverLetterDto } from '@common/dtos/crud/cover-letter-req.dto';
import { ReplyCoverLetterDto } from '@common/dtos/crud/cover-letter-reply.dto';
import { UpdateCoverLetterDto } from '@common/dtos/crud/update-cover-letter.dto';

@Controller()
export class CoverLetterController {
  constructor(private readonly coverLetterService: CoverLetterService) {}

  @Post()
  async create(
    @UserId() userId: number,
    @Body() coverLetterDto: ReqCoverLetterDto,
  ): Promise<boolean> {
    const res = await this.coverLetterService.create(coverLetterDto, userId);
    if (res) {
      return true;
    }
    throw new BadRequestException('Failed to create cover letter');
  }

  @Get()
  async list(
    @UserId() userId: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('tag') tag?: string,
  ): Promise<ReplyCoverLetterDto[]> {
    const res = await this.coverLetterService.findAll(userId, page, tag);
    if (!res) {
      throw new NotFoundException(
        'CoverLetters with following parameters not found',
      );
    }
    return res;
  }

  @Get(':id')
  async findById(
    @UserId() userId: number,
    @Param('id') id: string,
  ): Promise<ReplyCoverLetterDto | boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid cover letter ID');
    }
    const res = await this.coverLetterService.findById(id, userId);
    if (!res) {
      throw new NotFoundException(`CoverLetter with id ${id} not found`);
    }
    return res;
  }

  @Patch(':id')
  async updateBody(
    @UserId() userId: number,
    @Param('id') id: string,
    @Body() body: UpdateCoverLetterDto,
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid cover letter ID');
    }
    const res = await this.coverLetterService.updateBodyById(id, body, userId);
    if (!res) {
      throw new NotFoundException(`CoverLetter with id ${id} not found`);
    }
    return true;
  }

  @Delete(':id')
  async remove(
    @UserId() userId: number,
    @Param('id') id: string,
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid cover letter ID');
    }
    const res = await this.coverLetterService.remove(id, userId);
    if (!res) {
      throw new NotFoundException(`CoverLetter with id ${id} not found`);
    }
    return true;
  }
}
