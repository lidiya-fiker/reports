import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('responses')
@Controller('responce')
export class ResponseController {
  constructor(private readonly responceService: ResponseService) {}

  @Post()
  async create(@Body() createResponceDto: CreateResponseDto) {
    return await this.responceService.create(createResponceDto);
  }

  @Get()
  async findAll() {
    return await this.responceService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Response ID' })
  async findOne(@Param('id') id: string) {
    return this.responceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResponceDto: UpdateResponseDto,
  ) {
    return this.responceService.update(id, updateResponceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await this.findOne(id);
    await this.responceService.remove(response);
  }
}
