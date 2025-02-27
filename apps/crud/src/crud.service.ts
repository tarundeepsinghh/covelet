import { DefaultPaginationSize } from '@common/constants';
import { ReqCoverLetterDto } from '@common/dtos/crud/cover-letter-req.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CoverLetter, CoverLetterDocument } from './schema/coverLetter.schemas';
import { ReplyCoverLetterDto } from '@common/dtos/crud/cover-letter-reply.dto';
import { UpdateCoverLetterDto } from '@common/dtos/crud/update-cover-letter.dto';

@Injectable()
export class CoverLetterService {
  constructor(
    @InjectModel(CoverLetter.name)
    private coverLetterModel: Model<CoverLetterDocument>,
  ) {}

  // Add to document service
  async create(coverLetterDto: ReqCoverLetterDto, userId: number) {
    return await this.coverLetterModel.create({ ...coverLetterDto, userId });
  }

  // Find all by user Id  service
  async findAll(
    userId: number,
    page: number,
    tag: string,
  ): Promise<ReplyCoverLetterDto[]> {
    const pageSize = DefaultPaginationSize;
    const skip = page ? (page - 1) * pageSize : 0;
    const query: FilterQuery<CoverLetter> = {
      userId,
      ...(tag && { skills: { $in: [tag] } }),
    };
    const coverLetters = await this.coverLetterModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(DefaultPaginationSize)
      .exec();
    return coverLetters;
  }

  // Find one by  Id  service
  async findById(
    id: string,
    userId: number,
  ): Promise<ReplyCoverLetterDto | boolean> {
    const coverLetter = await this.coverLetterModel.findById(id).exec();
    if (!coverLetter || coverLetter.userId !== userId) {
      return false; // CoverLetter not found or user is not authorized to access, return false
    }
    return coverLetter; // CoverLetter found, return CoverLetter
  }

  // Update one by  Id  service
  async updateBodyById(
    id: string,
    coverLetter: UpdateCoverLetterDto,
    userId: number,
  ): Promise<boolean> {
    const existingCoverLetter = await this.coverLetterModel.findById(id).exec();
    if (!existingCoverLetter || existingCoverLetter.userId !== userId) {
      return false; // Cover letter not found or user is not authorized to update, return false
    }
    const updatedCoverLetter = await this.coverLetterModel
      .findByIdAndUpdate(id, { $set: coverLetter }, { new: true })
      .exec();
    return updatedCoverLetter !== null; // Return true if cover letter was updated successfully, false otherwise
  }

  // Remove one by  Id  service
  async remove(id: string, userId: number): Promise<boolean> {
    const coverLetter = await this.coverLetterModel.findById(id).exec();
    if (!coverLetter || coverLetter.userId !== userId) {
      return false;
    }
    await this.coverLetterModel.findByIdAndDelete(id).exec();
    return true;
  }
}
