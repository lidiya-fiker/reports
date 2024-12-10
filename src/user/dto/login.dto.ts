import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user',
  })
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
