/* eslint-disable no-console */
import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export class ErrorHelper {
  private static readonly logger = new Logger(ErrorHelper.name);

  static BadRequestException(msg: string | string[]): never {
    this.logger.error(msg);
    throw new HttpException(msg, HttpStatus.BAD_REQUEST);
  }

  static UnauthorizedException(msg: string, cause?: Error): never {
    this.logger.error(msg);
    throw new HttpException(msg, HttpStatus.UNAUTHORIZED, { cause });
  }

  static NotFoundException(msg: string): never {
    this.logger.error(msg);
    throw new HttpException(msg, HttpStatus.NOT_FOUND);
  }

  static ForbiddenException(msg: string): never {
    this.logger.error(msg);
    throw new HttpException(msg, HttpStatus.FORBIDDEN);
  }

  static InternalServerErrorException(msg: string): never {
    this.logger.error(msg);
    throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  static ConflictException(msg: string): never {
    this.logger.error(msg);
    throw new HttpException(msg, HttpStatus.CONFLICT);
  }
}
