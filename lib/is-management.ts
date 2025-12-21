import { Roles } from './types';

export function IsManagement(
  user: { role?: string | null } | null | undefined
): boolean {
  if (!user || !user.role) return false;

  switch (user.role) {
    case Roles.Admin:
    case Roles.SuperAdmin:
      return true;
    case Roles.User:
    default:
      return false;
  }
}
