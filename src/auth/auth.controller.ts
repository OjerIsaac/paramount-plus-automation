import { Controller, Post, Body, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, LoginAuthDto } from './dto';
import { HttpResponse } from '../libs/utils';
import { AuthGuard } from '../libs/guards';
import { User, IUser } from '../libs/decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: RegisterUserDto) {
    await this.authService.registerUser(dto);

    return HttpResponse.success({
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
    });
  }

  @Post('login')
  async login(@Body() dto: LoginAuthDto) {
    const data = await this.authService.login(dto);

    return HttpResponse.success({
      data,
      message: 'User login successfully',
      statusCode: HttpStatus.OK,
    });
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  async logout(@User() user: IUser) {
    await this.authService.logout(user.id, user.sessionId);

    return HttpResponse.success({
      message: 'User logged out successfully',
      statusCode: HttpStatus.OK,
    });
  }
}
