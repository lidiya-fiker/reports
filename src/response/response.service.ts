import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from './entities/response.entity';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { SlackService } from 'src/slack/slack.service';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private slackService: SlackService,
  ) {}
  async create(createResponseDto: CreateResponseDto): Promise<any> {
    const { userId, questionId, response: responseText } = createResponseDto;

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!question || !user) {
      throw new Error('Invalid question or user ID.');
    }

    const response = this.responseRepository.create({
      response: responseText,
      question,
      user,
    });
    await this.responseRepository.save(response);

    //format and send message to slack
    const message = `*New Response Submitted:*\n*Question:* ${question.question}\n*Response:* ${responseText}\n*By:* ${user.username}\n*Created At:* ${response.createdAt}`;

    await this.slackService.sendMessage(process.env.SLACK_CHANNEL_ID, message);
    return {
      message: 'Response saved and sent to slak!',
      response: response.response,
    };
  }
  async findAll(): Promise<Response[]> {
    return await this.responseRepository.find({
      relations: ['user', 'question'],
    });
  }

  async findOne(id: string): Promise<Response> {
    const response = await this.responseRepository.findOne({
      where: { id },
      relations: ['user', 'question'],
    });
    if (!response) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }
    return response;
  }

  async update(
    id: string,
    updateResponseDto: UpdateResponseDto,
  ): Promise<Response> {
    const response = await this.findOne(id);
    Object.assign(response, updateResponseDto);
    return await this.responseRepository.save(response);
  }

  async remove(response: Response): Promise<void> {
    await this.responseRepository.remove(response);
  }
}
