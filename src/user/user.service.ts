import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/utility/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import refreshJwtConfig from 'src/utility/config/refresh-jwt.config';
import { Response } from 'express';
import { isUUID } from 'class-validator';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private tokenConfig: ConfigType<typeof jwtConfig>,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExist = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (userExist) {
      throw new HttpException('user already exist', HttpStatus.CONFLICT);
    }

    createUserDto.password = await hash(createUserDto.password, 10);
    const user = this.userRepository.create(createUserDto);
    const saveduser = await this.userRepository.save(user);
    const { password, ...result } = saveduser;
    return { statusCode: HttpStatus.CREATED, data: result };
  }
  async login(
    loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    let { username, password } = loginDto;
    if (!username) {
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
    }
    const user: User = await this.userRepository.findOne({
      where: [{ username: username }, { email: username }],
    });
    if (!user) {
      throw new HttpException('something_went_wrong', HttpStatus.BAD_REQUEST);
    }
    const isPasswordValid: boolean = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const { password: userPassword, ...result } = user;
    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    response.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true if using https
      sameSite: 'strict',
    });

    return {
      id: user.id,
      accessToken,
    };
  }

  async generateTokens(userId: String) {
    const accessToken = await this.jwtService.signAsync(
      { id: userId },
      {
        secret: this.tokenConfig.secret,
        expiresIn: this.tokenConfig.signOptions?.expiresIn, // Extract `expiresIn`
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: userId,
      },
      {
        secret: this.refreshTokenConfig.secret,
        expiresIn: this.refreshTokenConfig.expiresIn, // Use correct structure
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
  async findOne(id: string): Promise<any> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const { password, ...result } = user;
    return result;
  }
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }
  async remove(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
    return true;
  }
}
