import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ description: 'The content of the qustion' })
  @IsString()
  @MinLength(5)
  question: string;

  @ApiProperty({ description: 'the type of the question' })
  @IsString()
  type: 'string';
}


