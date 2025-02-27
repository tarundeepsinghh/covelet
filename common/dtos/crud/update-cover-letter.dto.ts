import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateCoverLetterDto {
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
}
