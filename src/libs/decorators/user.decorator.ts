import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IUser {
  id: string;
  sessionId: string;
}

export const User = createParamDecorator<string | undefined>(
  (data: string | undefined, ctx: ExecutionContext): IUser | string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;
    return data ? user?.[data] : user;
  },
);
