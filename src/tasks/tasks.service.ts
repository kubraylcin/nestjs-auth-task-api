import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: { title: dto.title, userId },
    });
  }

  findAll(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneOwned(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException('Görev bulunamadı');
    }
    if (task.userId !== userId) {
      throw new ForbiddenException('Bu göreve erişim yetkiniz yok');
    }

    return task;
  }

  async update(id: number, userId: number, dto: UpdateTaskDto) {
    await this.findOneOwned(id, userId);
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number) {
    await this.findOneOwned(id, userId);
    return this.prisma.task.delete({ where: { id } });
  }
}