import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/enums/user-role.enum';

export type AllowedRolls = keyof typeof UserRole | 'ANY';

export const Role = (roles: AllowedRolls[]) => SetMetadata('roles', roles);
