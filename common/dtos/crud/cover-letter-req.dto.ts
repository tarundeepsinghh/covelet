import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ReqCoverLetterDto {
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: 'Junior dev',
    maxLength: 100,
    minLength: 2,
  })
  title: string;

  @IsArray()
  @ArrayMaxSize(25)
  @ArrayMinSize(1)
  @IsString({
    each: true,
  })
  @MinLength(5, {
    each: true,
  })
  @MaxLength(100, {
    each: true,
  })
  @ApiProperty({
    type: [String],
    required: true,
    example: ['JavaScript', 'React'],
  })
  skills: string[];

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 25,
    minLength: 1,
    example: 'KSDAC L.L.P',
  })
  company: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'experience must be a whole number between 0 - 1200' },
  )
  @Max(1200)
  @Min(0)
  @ApiProperty({
    type: Number,
    required: true,
    maximum: 1200,
    minimum: 0,
    example: 36,
  })
  experience: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(9000)
  @MinLength(300)
  @ApiProperty({
    type: String,
    required: true,
    example: 'Dear [MANAGER].......',
    minLength: 300,
    maxLength: 9000,
  })
  body: string;

  @IsNumber()
  @ApiProperty({ type: Number, required: true, example: 3 })
  userId: number;
}
