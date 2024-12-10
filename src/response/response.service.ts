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
    const { userId, response } = createResponseDto;
    // const question = await this.questionRepository.findOne({
    //   where: { id: questionId },
    // });
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    let slackMessage = `*New Response Submitted:*\n`;

    for (const { questionId, response: responseText } of response) {
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
      });
      if (!question) {
        throw new Error('Invalid user ID.');
      }

      const response = this.responseRepository.create({
        response: responseText,
        user: user,
        question: question,
      });

      await this.responseRepository.save(response);

      slackMessage += `*Question:* ${question.question}\n*Response:* ${responseText}\n\n`;
    }

    slackMessage += `*By:* ${user.username}\n*Created At:* ${new Date().toLocaleString()}`;

    await this.slackService.sendMessage(
      process.env.SLACK_CHANNEL_ID,
      slackMessage,
    );

    return {
      message: 'Responses saved and sent to slak!',
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
