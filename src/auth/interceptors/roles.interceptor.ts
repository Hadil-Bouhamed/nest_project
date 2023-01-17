import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class RoleInterceptor implements NestInterceptor {
  constructor(..._role: string[]) {
    this._role=_role
  }
  _role:string[]
  intercept(context: ExecutionContext, next: CallHandler) {
    console.log(context.switchToHttp().getRequest().user.role);

    if (!this._role.find(role=>role===context.switchToHttp().getRequest().user.role)) {
      throw new UnauthorizedException('You Cant\'t do this ');
    }

    return next.handle();
  }
}