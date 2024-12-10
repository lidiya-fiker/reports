import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateResponseDto {
  @ApiProperty({ description: 'The content of the response' })
  @IsString()
  response: string;

  @ApiProperty({ description: 'User ID associated with the response' })
  userId: string;

  @ApiProperty({ description: 'Question ID associated with the response' })
  questionId: string;
}
