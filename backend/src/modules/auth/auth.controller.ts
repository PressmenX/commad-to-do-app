import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from '../../common/guard/local-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserResponseDto } from '../../common/dto/user-response.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return {
      message: 'Register successful',
      data,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserResponseDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.getToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = await this.authService.createRefreshToken(user.id);
    this.setAuthCookies(res, accessToken, refreshToken);

    return {
      message: 'Login successful',
      data: user,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.rotateRefreshToken(
      req.cookies?.refresh_token,
    );
    const accessToken = await this.authService.getToken({
      sub: result.user.id,
      email: result.user.email,
    });

    this.setAuthCookies(res, accessToken, result.token);

    return {
      message: 'Token refreshed',
      data: result.user,
    };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.revokeRefreshToken(req.cookies?.refresh_token);
    const cookieOptions = this.getCookieOptions();
    res.clearCookie('access_token', { ...cookieOptions, path: '/' });
    res.clearCookie('refresh_token', { ...cookieOptions, path: '/auth' });
    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: UserResponseDto) {
    return user;
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const cookieOptions = this.getCookieOptions();
    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private getCookieOptions() {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    return {
      sameSite: 'lax' as const,
      secure: isProduction,
      httpOnly: true,
    };
  }
}
