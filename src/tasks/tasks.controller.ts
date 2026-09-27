import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Request() req:any, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req:any) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req:any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Request() req:any, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id, req.user.userId);
  }
}