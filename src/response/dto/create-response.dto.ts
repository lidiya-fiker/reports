import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsUUID,
  ArrayNotEmpty,
  IsObject,
} from 'class-validator';

class ResponseItem {
  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiProperty()
  @IsString()
  response: string;
}

export class CreateResponseDto {
  @ApiProperty({ type: [ResponseItem] }) // Indicating that 'response' is an array of 'ResponseItem'
  @IsArray()
  @ArrayNotEmpty() // Ensure that the array is not empty
  response: ResponseItem[];

  @ApiProperty()
  @IsUUID()
  userId: string;
}
