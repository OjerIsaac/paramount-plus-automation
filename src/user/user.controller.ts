import { Controller, Get, HttpStatus, UseGuards, Delete, Put, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { HttpResponse } from '../libs/utils';
import { User, IUser } from '../libs/decorators';
import { AuthGuard } from '../libs/guards';
import { UpdateUserProfileDto } from './dto';

@ApiTags('User')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched user profile',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async profile(@User() user: IUser) {
    const data = await this.userService.getProfile(user.id);

    return HttpResponse.success({
      data,
      message: 'Profile fetched successfully',
      statusCode: HttpStatus.OK,
    });
  }

  @Put('update-profile')
  @ApiOperation({ summary: 'Update user profile details' })
  @ApiBody({ type: UpdateUserProfileDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated user profile',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  async updateProfile(@Body() dto: UpdateUserProfileDto, @User() user: IUser) {
    const data = await this.userService.updateProfile(user.id, dto);

    return HttpResponse.success({
      data,
      message: 'Profile updated successfully',
      statusCode: HttpStatus.OK,
    });
  }

  @Delete('delete-profile')
  @ApiOperation({ summary: 'Delete (deactivate) the current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async deleteProfile(@User() user: IUser) {
    await this.userService.deleteProfile(user.id);

    return HttpResponse.success({
      message: 'Profile deleted successfully',
      statusCode: HttpStatus.OK,
    });
  }
}
