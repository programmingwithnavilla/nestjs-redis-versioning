import { Module } from '@nestjs/common';
import { RedisModule } from 'src/cache/redis.module';
import { PrismaModule } from 'src/database/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
