import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import 'dotenv/config';
import { UserEntity } from '../user/entities/user.entity';
import errorException from '../../common/errorException';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  signup = async (createUserDto: CreateUserDto) => {
    return await this.userService.create(createUserDto);
  };

  validateUser = async (login: string, password: string) => {
    const user = await this.userService.findByLogin(login);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  };

  login = async (user: UserEntity) => {
    const { id, login } = user;
    const accessToken = await this.jwtService.signAsync(
      { userId: id, login },
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        userId: id,
        login,
      },
      {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      },
    );
    return { accessToken, refreshToken };
  };

  refresh = async (authorization) => {
    const refreshToken = authorization.split(' ')[1];

    try {
      const { userId, login } = this.jwtService.verify(refreshToken);
      const user = new UserEntity({ id: userId, login });
      return await this.login(user);
    } catch {
      errorException.forbiddenException('Refresh token is outdated or invalid');
    }
  };
}
