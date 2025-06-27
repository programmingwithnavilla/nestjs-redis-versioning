import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/cache/redis.service';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly cacheTTL = 60; // seconds

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}
  private getCacheKey(id: number): string {
    return `user:${id}`;
  }
  async create(data: CreateUserDTO): Promise<User> {
    const user = await this.prisma.user.create({
      data: data,
    });
    await this.redisService
      .getClient()
      .set(this.getCacheKey(user.id), JSON.stringify(user));
    return user;
  }
  async findOne(id: number): Promise<User> {
    const client = this.redisService.getClient();
    const cached = await client.get(this.getCacheKey(id));
    if (cached) {
      return JSON.parse(cached) as User;
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    await client.set(
      this.getCacheKey(id),
      JSON.stringify(user),
      'EX',
      this.cacheTTL,
    );
    return user;
  }

  async update(id: number, data: Partial<CreateUserDTO>) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        version: user.version + 1,
      },
    });

    await this.redisService
      .getClient()
      .set(
        this.getCacheKey(id),
        JSON.stringify(updatedUser),
        'EX',
        this.cacheTTL,
      );
    return updatedUser;
  }

  async remove(id: number) {
    await this.prisma.user.delete({ where: { id } });
    await this.redisService.getClient().del(this.getCacheKey(id));
    return { deleted: true };
  }
}
