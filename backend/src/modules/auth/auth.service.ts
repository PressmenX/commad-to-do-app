import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { UserResponseDto } from '../../common/dto/user-response.dto';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes, randomUUID } from 'node:crypto';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
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

  async getToken(payload: { sub: string; email: string }) {
    return await this.jwtService.signAsync(payload, { expiresIn: '15m' });
  }

  async createRefreshToken(userId: string) {
    const token = randomBytes(64).toString('base64url');
    const tokenHash = this.hashToken(token);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        familyId: randomUUID(),
        userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return token;
  }

  async rotateRefreshToken(token: string | undefined) {
    if (!token) throw new UnauthorizedException('Invalid refresh token');

    const tokenHash = this.hashToken(token);
    const now = new Date();
    const result = await this.prisma.$transaction(async (transaction) => {
      const current = await transaction.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!current) return { status: 'invalid' as const };

      if (current.revokedAt || current.expiresAt <= now) {
        await transaction.refreshToken.updateMany({
          where: { familyId: current.familyId, revokedAt: null },
          data: { revokedAt: now },
        });
        return { status: 'invalid' as const };
      }

      const nextToken = randomBytes(64).toString('base64url');
      const nextTokenHash = this.hashToken(nextToken);
      const claimed = await transaction.refreshToken.updateMany({
        where: {
          id: current.id,
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: { revokedAt: now },
      });

      if (claimed.count !== 1) {
        await transaction.refreshToken.updateMany({
          where: { familyId: current.familyId, revokedAt: null },
          data: { revokedAt: now },
        });
        return { status: 'invalid' as const };
      }

      await transaction.refreshToken.create({
        data: {
          tokenHash: nextTokenHash,
          familyId: current.familyId,
          userId: current.userId,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        },
      });

      return {
        status: 'success' as const,
        token: nextToken,
        user: {
          id: current.user.id,
          email: current.user.email,
          name: current.user.name,
        },
      };
    });

    if (result.status !== 'success') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return result;
  }

  async revokeRefreshToken(token: string | undefined) {
    if (!token) return;

    const current = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hashToken(token) },
      select: { familyId: true },
    });

    if (!current) return;

    await this.prisma.refreshToken.updateMany({
      where: { familyId: current.familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
