import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const accessToken: unknown = req.cookies?.access_token;
          return typeof accessToken === 'string' ? accessToken : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || '',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
