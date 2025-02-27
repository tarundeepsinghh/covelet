import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReplyCoverLetterDto {
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
    example: 'Dear [MANAGER].......',
  })
  body: string;

  @Expose()
  @ApiProperty({ type: String, required: true, example: 'Junior Dev' })
  title: string;

  @Expose()
  @ApiProperty({
    type: [String],
    required: true,
    example: ['JavaScript', 'React'],
  })
  skills: string[];

  @Expose()
  @ApiProperty({ type: String, required: true, example: 'KSDAC L.L.P' })
  company: string;

  @Expose()
  @ApiProperty({ type: Number, required: true, example: '3' })
  experience: number;

  @Expose()
  @ApiProperty({ type: Number, required: true, example: '4' })
  userId: number;
}
