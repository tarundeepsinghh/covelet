import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

class LoginReqDto {
  @IsEmail()
  @ApiProperty({ type: String, required: true })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(18)
  @ApiProperty({ type: String, required: true, maxLength: 18, minLength: 6 })
  password: string;
}

export default LoginReqDto;
