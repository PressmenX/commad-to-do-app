import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';

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

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(pass, user.password))) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
