import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: Props) {
  const { accessToken, user } = useAuth();
  const { pathname } = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // A user with no organization yet can't use any org-scoped page —
  // every one of those API calls (dashboard, tasks, notifications...)
  // 400s on the backend's "User does not belong to an organization"
  // check. Send them to create/join one first, unless they're
  // already there (avoids a pointless self-redirect).
  if (!user?.organizationId && pathname !== "/organizations") {
    return <Navigate to="/organizations" replace />;
  }

  return <>{children}</>;
}