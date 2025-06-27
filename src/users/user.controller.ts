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
import { UserService } from './user.service';
import { CreateUserSchema } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  @Post()
  async create(@Body() body: any) {
    const parsed = CreateUserSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.format());
    return this.usersService.create(parsed.data);
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
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
