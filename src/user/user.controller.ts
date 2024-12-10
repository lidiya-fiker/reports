import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/utility/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'uuid';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  @Get('all')
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new HttpException('Error fetching users', HttpStatus.BAD_REQUEST);
    }
  }
  
  @Get()
  async findOne(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid uuid format');
    }
    return await this.userService.findOne(id);
  }

  @Post('signup')
  @ApiBody({ type: CreateUserDto })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.userService.signUp(createUserDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    return await this.userService.login(loginDto, response);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async user(@Req() request: Request): Promise<any> {
    const id = request['id'];
    if (typeof id !== 'string') {
      throw new BadRequestException('Invalid ID format not string');
    }
    const user = await this.userService.findOne(id);
    return user;
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    response.clearCookie('refreshToken');
    return {
      message: 'logged out successfully',
    };
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) {
      return new UnauthorizedException('refresh token missing');
    }
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_JWT_SECRETE,
      });

      const { accessToken, refreshToken: newRefreshToken } =
        await this.userService.generateTokens(payload['id']);

      response.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'produciton',
        sameSite: 'strict',
      });
      return { accessToken };
    } catch {
      throw new UnauthorizedException('invalid refresh token');
    }
  }
  @Put(':id')
  @ApiParam({ name: 'id', description: 'UUID of the user' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const updatedUser = await this.userService.update(id, updateUserDto);
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return updatedUser;
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.BAD_REQUEST);
    }
  }
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'UUID of the user' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const result = await this.userService.remove(id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'User deleted successfully' };
  }
}
