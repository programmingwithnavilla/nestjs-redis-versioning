import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/cache/redis.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly USERS_VERSION_KEY = 'users:version';
  private readonly USER_VERSION_PREFIX = 'user:version:';
  private readonly USER_CACHE_PREFIX = 'user:cache:';
  private readonly USERS_CACHE_PREFIX = 'users:cache:';
  private readonly CACHE_TTL_SECONDS = 3600;

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly redis: RedisService,
  ) {}

  private async incrementUsersVersion(): Promise<number> {
    return this.redis.incr(this.USERS_VERSION_KEY);
  }

  private async incrementUserVersion(userId: number): Promise<number> {
    return this.redis.incr(`${this.USER_VERSION_PREFIX}${userId}`);
  }

  private async getUsersVersion(): Promise<number> {
    const version = await this.redis.get(this.USERS_VERSION_KEY);
    return version ? parseInt(version, 10) : 1;
  }

  private async getUserVersion(userId: number): Promise<number> {
    const version = await this.redis.get(
      `${this.USER_VERSION_PREFIX}${userId}`,
    );
    return version ? parseInt(version, 10) : 1;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.usersRepo.create(dto);
    await Promise.all([
      this.incrementUsersVersion(),
      this.incrementUserVersion(user.id),
    ]);
    return user;
  }

  async findAll(): Promise<User[]> {
    const version = await this.getUsersVersion();
    const cacheKey = `${this.USERS_CACHE_PREFIX}v${version}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as User[];
    }

    const users = await this.usersRepo.findAll();

    await this.redis.set(
      cacheKey,
      JSON.stringify(users),
      this.CACHE_TTL_SECONDS,
    );
    return users;
  }

  async findOne(id: number): Promise<User> {
    const version = await this.getUserVersion(id);
    const cacheKey = `${this.USER_CACHE_PREFIX}${id}-v${version}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as User;
    }

    const user = await this.usersRepo.findOne({ id });
    if (!user) throw new NotFoundException('User not found');

    await this.redis.set(
      cacheKey,
      JSON.stringify(user),
      this.CACHE_TTL_SECONDS,
    );
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const updated = await this.usersRepo.update({ id }, dto);
    if (!updated) throw new NotFoundException('User not found');

    await Promise.all([
      this.incrementUserVersion(id),
      this.incrementUsersVersion(),
    ]);

    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.usersRepo.delete({ id });

    await Promise.all([
      this.incrementUserVersion(id),
      this.incrementUsersVersion(),
    ]);
  }
}
