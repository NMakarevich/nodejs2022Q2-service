import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InMemoryDb } from '../../db/in-memory.db';
import { v4 as uuidv4 } from 'uuid';
import { NOT_FOUND_MESSAGE } from '../../consts/consts';
import { UserEntity } from './entities/user.entity';

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
    if (!user)
      throw new HttpException(
        `User ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userIndex = this.db.users.findIndex((user) => user.id === id);
    if (userIndex === -1)
      throw new HttpException(
        `User ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    const { oldPassword, newPassword } = updateUserDto;
    if (oldPassword !== this.db.users[userIndex].password)
      throw new HttpException('Incorrect old password', HttpStatus.FORBIDDEN);
    this.db.users[userIndex].password = newPassword;
    this.db.users[userIndex].version += 1;
    this.db.users[userIndex].updatedAt = Date.now();
    return this.db.users[userIndex];
  }

  remove(id: string) {
    const userIndex = this.db.users.findIndex((track) => track.id === id);
    if (userIndex === -1)
      throw new HttpException(
        `User ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    this.db.users = [
      ...this.db.users.slice(0, userIndex),
      ...this.db.users.slice(userIndex + 1),
    ];
  }
}
