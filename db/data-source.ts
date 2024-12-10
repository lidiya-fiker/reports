import { config } from 'dotenv';
import { Question } from 'src/question/entities/question.entity';
import { Response } from 'src/response/entities/response.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';

config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Question, Response],
  synchronize: true,
});
