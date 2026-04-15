import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/auth/decorators/roles.decorator';
import { Role } from '@/common/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} //permitirá leer los metadatos
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), //busca los roles definidos tanto a nivel de método
      context.getClass(), // como a nivel clases
    ]);

    if (!roles) return true;
    const { user } = context.switchToHttp().getRequest();

    return roles.some((role) => user.role?.includes(role));
  }
}
