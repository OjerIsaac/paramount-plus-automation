import { Body, Controller, Param, Post, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AutomationService } from './automation.service';
import { CardUpdateDto } from './dto';
import { AuthGuard } from '../libs/guards';
import { User, IUser } from '../libs/decorators';

@ApiTags('Automation')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post('card-update')
  @ApiOperation({ summary: 'Trigger card update automation for a user' })
  @ApiBody({
    type: CardUpdateDto,
    description: 'Payload containing card update data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Automation successfully triggered',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async triggerAutomation(
    @User() user: IUser,
    @Body() dto: CardUpdateDto,
  ) {
    return this.automationService.runCardAutomation(user.id, dto);
  }
}
