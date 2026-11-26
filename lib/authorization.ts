
import { getCurrentUser, type AuthUser } from "./auth";
import { hasPermission, type Permission } from "./permissions";

export class AuthorizationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthorizationError";
    this.status = status;
  }
}

export async function requirePermission(
  permission: Permission
): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthorizationError(
      "Autenticação necessária.",
      401
    );
  }

  if (!hasPermission(user.role, permission)) {
    throw new AuthorizationError(
      "Você não tem permissão para executar esta ação.",
      403
    );
  }

  return user;
}

export async function requireAnyPermission(
  permissions: Permission[]
): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthorizationError(
      "Autenticação necessária.",
      401
    );
  }

  const authorized = permissions.some((permission) =>
    hasPermission(user.role, permission)
  );

  if (!authorized) {
    throw new AuthorizationError(
      "Você não tem permissão para executar esta ação.",
      403
    );
  }

  return user;
}
