import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async register(dto: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user)
      throw new ConflictException(
        'Email is already in use. please use another email',
      );

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    return await this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
      select: { id: true, name: true, email: true },
    });
  }
}
