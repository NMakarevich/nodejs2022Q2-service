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
    const token = this.jwtService.sign(
      { userId: id, login },
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: id,
        login,
      },
      {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      },
    );
    return { token, refreshToken };
  };

  refresh = async (body: { refreshToken: string }) => {
    const { refreshToken } = body;
    if (!refreshToken)
      errorException.unauthorizedException('No refresh token in body');

    const { userId, login, exp } = this.jwtService.verify(refreshToken);
    if (exp * 1000 < Date.now())
      errorException.forbiddenException('Refresh token is outdated');

    const user = new UserEntity({ id: userId, login });
    return await this.login(user);
  };
}
