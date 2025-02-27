import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class RegisterResDto {
  @Expose()
  @ApiProperty({ type: Number, required: true, example: 1234 })
  id: number;

  @Expose()
  @ApiProperty({ type: String, required: true, example: 'test@email.com' })
  email: string;
}

export default RegisterResDto;
