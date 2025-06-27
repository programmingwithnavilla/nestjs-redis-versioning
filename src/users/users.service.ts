import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/cache/redis.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateUserDto) {
    const user = await this.usersRepo.create(dto);
    await this.redis.del('users:all');
    return user;
  }

  async findAll(): Promise<User[]> {
    const cached = await this.redis.get('users:all');
    if (cached) return JSON.parse(cached) as User[];

    const users = await this.usersRepo.findAll();
    await this.redis.set('users:all', JSON.stringify(users));
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepo.findOne({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const updated = await this.usersRepo.update({ id }, dto);
    // versioning pattern
    await this.redis.incr(`user:${id}:version`);
    await this.redis.del('users:all');
    return updated;
  }

  async delete(id: number) {
    await this.usersRepo.delete({ id });
    await this.redis.del(`user:${id}:version`);
    await this.redis.del('users:all');
  }
}
