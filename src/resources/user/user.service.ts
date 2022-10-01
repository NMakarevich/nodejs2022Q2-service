import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InMemoryDb } from '../../db/in-memory.db';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './entities/user.entity';
import errorException from '../../common/errorException';

@Injectable()
export class UserService {
  constructor(private db: InMemoryDb) {}

  create(createUserDto: CreateUserDto) {
    const date = Date.now();
    const newUser = new UserEntity({
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: date,
      updatedAt: date,
    });
    this.db.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.db.users;
  }

  findOne(id: string) {
    const user = this.db.users.find((user) => user.id === id);
    if (!user) errorException.notFoundException('User');
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userIndex = this.db.users.findIndex((user) => user.id === id);

    if (userIndex === -1) errorException.notFoundException('User');

    const { oldPassword, newPassword } = updateUserDto;
    const user = this.findOne(id);

    if (oldPassword !== user.password)
      errorException.forbiddenException('Incorrect old password');

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return user;
  }

  remove(id: string) {
    const userIndex = this.db.users.findIndex((track) => track.id === id);

    if (userIndex === -1) errorException.notFoundException('User');

    this.db.users.splice(userIndex, 1);
  }
}
