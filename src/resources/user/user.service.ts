import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import errorException from '../../common/errorException';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create = async (createUserDto: CreateUserDto) => {
    const { password } = createUserDto;
    const saltOrRounds = parseInt(process.env.CRYPT_SALT);
    createUserDto.password = await bcrypt.hash(password, saltOrRounds);
    const newUser = new UserEntity(createUserDto);
    const user = this.userRepository.create(newUser);
    return await this.userRepository.save(user);
  };

  findAll = async () => {
    return await this.userRepository.find();
  };

  findOne = async (id: string) => {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) errorException.notFoundException('User');
    return user;
  };

  update = async (id: string, updateUserDto: UpdateUserDto) => {
    const user = await this.findOne(id);

    const { oldPassword, newPassword } = updateUserDto;
    if (oldPassword !== user.password)
      errorException.forbiddenException('Incorrect old password');

    user.password = newPassword;
    return await this.userRepository.save(user);
  };

  remove = async (id: string) => {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) errorException.notFoundException('User');
  };
}
