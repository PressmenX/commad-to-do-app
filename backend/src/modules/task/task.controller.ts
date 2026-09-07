import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserResponseDto } from '@/common/dto/user-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: UserResponseDto,
  ) {
    return await this.taskService.create(createTaskDto, user.id);
  }

  @Get()
  async findAll(@CurrentUser() user: UserResponseDto) {
    return await this.taskService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: UserResponseDto) {
    return this.taskService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: UserResponseDto,
  ) {
    return this.taskService.update(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() user: UserResponseDto) {
    return this.taskService.remove(id, user.id);
  }
}
