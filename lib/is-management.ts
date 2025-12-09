import { Roles } from './types';

export function IsManagement(user) {
  if (!user) return false;

  switch (user.role) {
    case Role.Admin:
    case Roles.SuperAdmin:
      return true;
    case Roles.User:
      return false;
    default:
      return false;
  }
}
