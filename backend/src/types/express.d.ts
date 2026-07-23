import { UserRole } from "../constants/roles";
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        role: UserRole;
        organizationId: string | null;
        isEmailVerified: boolean;
      };
    }
  }
}

export {};