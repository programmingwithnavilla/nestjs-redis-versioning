import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserSchema } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async create(@Body() body: any) {
    const parsed = CreateUserSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.format());
    return this.usersService.create(parsed.data);
  }
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const parsed = CreateUserSchema.partial().safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.format());
    return this.usersService.update(+id, parsed.data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
