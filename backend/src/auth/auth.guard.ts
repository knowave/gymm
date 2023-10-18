import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AllowedRolls } from './decorators/user-role.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from 'src/user/enums/user-role.enum';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.get<AllowedRolls>(
        'roles',
        context.getHandler(),
      );

      if (!roles) return true;

      const gqlContext = GqlExecutionContext.create(context).getContext();

      const token = gqlContext.req
        ? gqlContext.req.headers['Authorization']
        : gqlContext.token;

      if (token) {
        const decoded = this.jwtService.verify(token.toString(), {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        });

        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          if (roles.includes(UserRole.TRAINER)) {
            if (decoded['role'] !== UserRole.TRAINER) {
              throw new ForbiddenException('트레이너 권한이 없습니다.');
            }

            const { user } = await this.userService.getUserById(decoded['id']);

            if (!user && user.role !== UserRole.TRAINER)
              throw new ForbiddenException('트레이너 권한이 없습니다.');

            gqlContext['user'] = user;

            return roles.includes(user.role);
          } else {
            let user: any;
            if (decoded['role'] !== UserRole.TRAINER)
              user = await this.userService.getUserById(decoded['id']);

            if (!user) throw new ForbiddenException('접근 권한이 없습니다.');

            gqlContext['user'] = user;

            if (roles.includes('ANY')) return true;

            return roles.includes(user.role);
          }
        } else {
          throw new UnauthorizedException('회원이 아닙니다.');
        }
      } else {
        throw new UnauthorizedException('회원이 아닙니다.');
      }
    } catch (err) {
      switch (err['status']) {
        case 400:
          throw new BadRequestException();
        default:
          throw new UnauthorizedException();
      }
    }
  }
}
