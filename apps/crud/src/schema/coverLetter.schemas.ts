import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CoverLetterDocument = HydratedDocument<CoverLetter>;

@Schema({ strict: true, timestamps: { createdAt: true, updatedAt: true } })
export class CoverLetter {
  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: [String], required: true })
  skills: string[];

  @Prop({ type: String, required: true })
  company: string;

  @Prop({ type: Number, required: true })
  experience: number;

  @Prop({ type: Number, required: true })
  userId: number;
}

export const CoverLetterSchema = SchemaFactory.createForClass(CoverLetter);
