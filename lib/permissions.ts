
import type { UserRole } from "./auth";

export type Permission =
  | "dashboard.view"
  | "vehicles.view"
  | "vehicles.create"
  | "vehicles.edit"
  | "vehicles.delete"
  | "leads.view"
  | "leads.manage"
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "reports.view"
  | "audit.view"
  | "settings.manage";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  master: [
    "dashboard.view",
    "vehicles.view",
    "vehicles.create",
    "vehicles.edit",
    "vehicles.delete",
    "leads.view",
    "leads.manage",
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "reports.view",
    "audit.view",
    "settings.manage",
  ],

  admin: [
    "dashboard.view",
    "vehicles.view",
    "vehicles.create",
    "vehicles.edit",
    "vehicles.delete",
    "leads.view",
    "leads.manage",
    "users.view",
    "users.create",
    "users.edit",
    "reports.view",
    "audit.view",
  ],

  manager: [
    "dashboard.view",
    "vehicles.view",
    "vehicles.create",
    "vehicles.edit",
    "leads.view",
    "leads.manage",
    "reports.view",
  ],

  employee: [
    "dashboard.view",
    "vehicles.view",
    "leads.view",
  ],
};

export function hasPermission(
  role: UserRole,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) =>
    hasPermission(role, permission)
  );
}

export function getPermissions(role: UserRole): Permission[] {
  return [...(ROLE_PERMISSIONS[role] ?? [])];
}
