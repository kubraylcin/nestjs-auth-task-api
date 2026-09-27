import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

// 1. CreateTaskDto'daki tüm kuralları kopyalar
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    
    // 2. Sadece güncellemeye özel olan yeni alanları buraya eklersin
    @IsOptional()
    @IsBoolean()
    done?: boolean;
}