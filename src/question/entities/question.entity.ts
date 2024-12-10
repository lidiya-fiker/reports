import { Response } from 'src/response/entities/response.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column({ type: 'varchar' })
  type: 'string';

  @ManyToOne(() => User, (user) => user.questions)
  user: User;

  @OneToMany(() => Response, (response) => response.question)
  responses: Response[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

//Created At: Mon Dec 09 2024 15:10:02 GMT+0300 (East Africa Time)
