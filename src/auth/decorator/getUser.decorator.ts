import {
  NestMiddleware,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);