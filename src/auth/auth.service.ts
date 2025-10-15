import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorHelper, PasswordHelper } from '../libs/utils';
import { RegisterUserDto, LoginAuthDto } from './dto';
import { User } from '../user/entities';
import { UserService } from '../user/user.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async registerUser(data: RegisterUserDto): Promise<void> {
    const emailExist = await this.userService.findByEmail(data.email);

    if (emailExist) {
      ErrorHelper.ConflictException('Email already exist');
    }

    const isDeleted = await this.userService.isDeactivated(data.email);

    if (isDeleted) {
      ErrorHelper.ForbiddenException('User is deactivated, please contact admin');
    }

    const hashedPassword = await PasswordHelper.hashPassword(data.password);

    await this.userService.create({
      ...data,
      password: hashedPassword,
    });
  }

  async login(data: LoginAuthDto) {
    this.logger.info('User login attempt');
    const registeredUser = await this.userService.findByEmail(data.email);

    if (!registeredUser) {
      ErrorHelper.BadRequestException('User not registered on the system');
    }

    const isPasswordCorrect = registeredUser
      ? await PasswordHelper.comparePassword(data.password, registeredUser.password)
      : null;

    if (!isPasswordCorrect) {
      ErrorHelper.BadRequestException('Password is incorrect');
    }

    return this.signUserToken(registeredUser);
  }

  private async signUserToken(user: User): Promise<{ accessToken: string }> {
    const sessionId = `${Date.now()}_${user.id}_${Math.random()}`;
    const token = this.jwtService.sign({
      id: user.id,
      sessionId,
    });

    await this.userService.saveSession(user.id, sessionId);

    return {
      accessToken: token,
    };
  }

  async logout(userId: string, sessionId: string): Promise<void> {
    await this.userService.deleteSession(userId, sessionId);
  }
}
