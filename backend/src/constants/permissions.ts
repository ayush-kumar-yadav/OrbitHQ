export enum Permission {
  ORGANIZATION_CREATE = "ORGANIZATION_CREATE",

  MEMBER_INVITE = "MEMBER_INVITE",
  MEMBER_REMOVE = "MEMBER_REMOVE",

  PROJECT_CREATE = "PROJECT_CREATE",
  PROJECT_UPDATE = "PROJECT_UPDATE",
  PROJECT_DELETE = "PROJECT_DELETE",

  TASK_CREATE = "TASK_CREATE",
  TASK_UPDATE = "TASK_UPDATE",
  TASK_DELETE = "TASK_DELETE",
  TASK_VIEW = "TASK_VIEW",
}
import { UserRole } from "./roles";

export const ROLE_PERMISSIONS: Record<
  UserRole,
  Permission[]
> = {
  [UserRole.OWNER]: [
    Permission.ORGANIZATION_CREATE,
    Permission.MEMBER_INVITE,
    Permission.MEMBER_REMOVE,

    Permission.PROJECT_CREATE,
    Permission.PROJECT_UPDATE,
    Permission.PROJECT_DELETE,

    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.TASK_VIEW,
  ],

  [UserRole.ADMIN]: [
    Permission.MEMBER_INVITE,

    Permission.PROJECT_CREATE,
    Permission.PROJECT_UPDATE,
    Permission.PROJECT_DELETE,

    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_DELETE,
    Permission.TASK_VIEW,
  ],

  [UserRole.MANAGER]: [
    Permission.PROJECT_CREATE,
    Permission.PROJECT_UPDATE,

    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_VIEW,
  ],

  [UserRole.DEVELOPER]: [
    Permission.TASK_CREATE,
    Permission.TASK_UPDATE,
    Permission.TASK_VIEW,
  ],

  [UserRole.VIEWER]: [
    Permission.TASK_VIEW,
  ],
};