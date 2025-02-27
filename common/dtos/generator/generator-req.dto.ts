import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class GeneratorDto {
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  @ApiProperty({ type: String, required: true, maxLength: 100, minLength: 2 })
  title: string;

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
  @ApiProperty({ type: [String], required: true, maxLength: 25, minLength: 1 })
  skills: string[];

  @IsString()
  @MaxLength(100)
  @MinLength(5)
  @ApiProperty({ type: String, required: true, maxLength: 100, minLength: 5 })
  company: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'experience must be a whole number between 0 - 1200' },
  )
  @Max(1200)
  @Min(0)
  @ApiProperty({ type: Number, required: true, maximum: 1200, minimum: 0 })
  experience: number;
}
