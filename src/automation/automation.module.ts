import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AutomationService],
  controllers: [AutomationController],
})
export class AutomationModule {}
