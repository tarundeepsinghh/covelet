import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

class RegisterReqDto {
  @IsEmail()
  @ApiProperty({ type: String, required: true })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(18)
  @ApiProperty({ type: String, required: true, minLength: 6, maxLength: 18 })
  password: string;
}

export default RegisterReqDto;
