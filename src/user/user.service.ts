import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { SessionToken, User } from './entities';
import { ErrorHelper } from '../libs/utils';
import { RegisterUserDto } from '../auth/dto';
import { UpdateUserProfileDto } from './dto';
import { validateUUID } from '../libs/helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SessionToken) private readonly sessionRepository: Repository<SessionToken>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email: ILike(email),
      },
    });
  }

  async isDeactivated(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email: ILike(email),
      },
      withDeleted: true,
    });
  }

  async create(
    payload: RegisterUserDto & {
      password: string;
    }
  ): Promise<User> {
    return this.userRepository.save(payload);
  }

  async update(userId: string, payload: Partial<User>): Promise<void> {
    await this.userRepository.update(userId, payload);
  }

  async getProfile(id: string) {
    const userInfo = await this.userRepository.findOne({ where: { id } });

    if (!userInfo) {
      ErrorHelper.NotFoundException(`User not found`);
    }

    return this.serializeUser(userInfo);
  }

  private serializeUser(user: User) {
    return {
      name: user.name,
      email: user.email,
      id: user.id,
    };
  }

  async findBySessionId(sessionId: string): Promise<SessionToken | null> {
    return this.sessionRepository.findOne({
      where: {
        sessionId,
      },
    });
  }

  async saveSession(userId: string, sessionId: string): Promise<SessionToken> {
    return this.sessionRepository.save({ userId, sessionId });
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    await this.sessionRepository.delete({
      userId,
      sessionId,
    });
  }

  async deleteProfile(id: string): Promise<boolean> {
    if (!validateUUID(id)) {
      ErrorHelper.BadRequestException('Invalid User ID');
    }

    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      ErrorHelper.BadRequestException('User not found');
    }

    await this.userRepository.softDelete(id);

    return true;
  }

  async updateProfile(userId: string, dto: UpdateUserProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: true,
    });

    if (!user) {
      ErrorHelper.BadRequestException('User not found');
    }

    if (user.deletedAt) {
      ErrorHelper.ForbiddenException('User is deactivated, please activate user');
    }

    if (dto.email) {
      const emailExist = await this.findByEmail(dto.email);
      if (emailExist && emailExist.id !== userId) {
        ErrorHelper.ConflictException('Email already exist');
      }
    }

    const payload = {
      name: dto.name ?? user.name,
    };

    await this.update(user.id, payload);

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!updatedUser) {
      ErrorHelper.InternalServerErrorException('User update failed');
    }

    return this.serializeUser(updatedUser);
  }
}
