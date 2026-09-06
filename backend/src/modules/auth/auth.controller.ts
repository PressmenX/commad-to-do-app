import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from '@/common/guard/local-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

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

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie('access_token', accessToken, {
      sameSite: 'lax',
      secure: isProduction,
      httpOnly: true,
      maxAge: 0.5 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      data: user,
    };
  }
}
