import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Response {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  response: string;
  
  @ManyToOne(() => User, (user) => user.responses)
  user: User;

  @ManyToOne(() => Question, (question) => question.responses)
  question: Question;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
