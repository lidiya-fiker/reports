import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'username of the user' })
  @IsString()
  username: string;
  @ApiProperty({ description: 'email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'password of the user' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  password: string;
}
