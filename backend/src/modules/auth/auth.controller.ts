import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from '@/common/guard/local-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  login(@CurrentUser() user: UserResponseDto) {
    return {
      message: 'Login successful',
      data: user,
    };
  }
}
