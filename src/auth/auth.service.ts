import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // 1. Enjekte edilen servisler readonly yapıldı
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 2. Dönüş tipleri (Return types) eklendi
  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Bu e-posta zaten kayıtlıdır.');
    }

    // 3. Salt rounds bir değişkene veya config'e alınabilir
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    
    const user = await this.usersService.create(dto.email, hashedPassword);
    
    return this.signToken(user.id, user.email);
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    return this.signToken(user.id, user.email);
  }

  private signToken(userId: number, email: string): { access_token: string } {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}