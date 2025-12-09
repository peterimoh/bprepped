import { Roles } from './types';

export function IsManagement(user) {
  if (!user) return false;

  switch (user.role) {
    case Roles.Admin:
    case Roles.SuperAdmin:
      return true;
      break;
    case Roles.User:
      return false;
  }
}
