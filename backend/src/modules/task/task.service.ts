import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { generateTaskKey } from './utils/generate-task-key.util';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}
  async create(taskDto: CreateTaskDto, userId: string) {
    const key = await generateTaskKey(this.prisma);
    return await this.prisma.task.create({
      data: { ...taskDto, userId, taskKey: key },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.task.findMany({ where: { userId } });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId)
      throw new ForbiddenException('Access is denied to access this task');
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    await this.findOne(id, userId);
    return await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return await this.prisma.task.delete({
      where: { id },
    });
  }
}
