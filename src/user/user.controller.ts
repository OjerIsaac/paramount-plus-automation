import { Controller, Get, HttpStatus, UseGuards, Delete, Put, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpResponse } from '../libs/utils';
import { User, IUser } from '../libs/decorators';
import { AuthGuard } from '../libs/guards';
import { UpdateUserProfileDto } from './dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async profile(@User() user: IUser) {
    const data = await this.userService.getProfile(user.id);

    return HttpResponse.success({
      data,
      message: 'Profile fetched successfully',
      statusCode: HttpStatus.OK,
    });
  }

  @Put('update-profile')
  async updateProfile(@Body() dto: UpdateUserProfileDto, @User() user: IUser) {
    const data = await this.userService.updateProfile(user.id, dto);
    return HttpResponse.success({
      data,
      message: 'Profile updated successfully',
      statusCode: HttpStatus.OK,
    });
  }

  @Delete('delete-profile')
  async deleteProfile(@User() user: IUser) {
    await this.userService.deleteProfile(user.id);
    return HttpResponse.success({
      message: 'Profile deleted successfully',
      statusCode: HttpStatus.OK,
    });
  }
}
