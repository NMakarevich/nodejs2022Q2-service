import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import errorException from '../../common/errorException';
import prisma from '../../../prisma/prisma-client';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  create = async (createUserDto: CreateUserDto) => {
    const newUser = await prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
      },
    });
    return this.toResponse(newUser);
  };

  findAll = async () => {
    const users = await prisma.user.findMany();
    return users.map((user) => this.toResponse(user));
  };

  findOne = async (id: string) => {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) errorException.notFoundException('User');
    return this.toResponse(user);
  };

  update = async (id: string, updateUserDto: UpdateUserDto) => {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) errorException.notFoundException('User');

    const { oldPassword, newPassword } = updateUserDto;
    if (oldPassword !== user.password)
      errorException.forbiddenException('Incorrect old password');

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });

    return this.toResponse(updatedUser);
  };

  remove = async (id: string) => {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) errorException.notFoundException('User');

    await prisma.user.delete({ where: { id } });
  };

  toResponse(user: User) {
    const { createdAt, updatedAt } = user;
    delete user.password;
    return {
      ...user,
      createdAt: createdAt.getTime(),
      updatedAt: updatedAt.getTime(),
    };
  }
}
