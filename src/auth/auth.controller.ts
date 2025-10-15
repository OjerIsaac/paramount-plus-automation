import { Controller, Post, Body, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto, LoginAuthDto } from './dto';
import { HttpResponse } from '../libs/utils';
import { AuthGuard } from '../libs/guards';
import { User, IUser } from '../libs/decorators';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  async signup(@Body() dto: RegisterUserDto) {
    await this.authService.registerUser(dto);

    return HttpResponse.success({
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user and get JWT token' })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid credentials' })
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
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout the currently authenticated user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User logged out successfully' })
  async logout(@User() user: IUser) {
    await this.authService.logout(user.id, user.sessionId);

    return HttpResponse.success({
      message: 'User logged out successfully',
      statusCode: HttpStatus.OK,
    });
  }
}
