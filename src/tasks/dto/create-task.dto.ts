import { IsNotEmpty, IsString, MaxLength,  } from "class-validator";

export class CreateTaskDto {
    @IsString({ message: 'Başlık metin formatında olmalıdır.' })
  @IsNotEmpty({ message: 'Başlık alanı boş bırakılamaz.' })
  @MaxLength(200, { message: 'Başlık 200 karakterden uzun olamaz.' })
  title: string;
}