import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { SessionToken, User } from './entities';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, SessionToken])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
