import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNotificationSocket } from "../hooks/notifications/useNotificationSocket";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { useAuth } from "../providers/AuthProvider";
import {
  connectSocket,
  disconnectSocket,
} from "../services/socket";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: Props) {
  const { accessToken } = useAuth();

useNotificationSocket();

useEffect(() => {
  if (!accessToken) {
    return;
  }

  connectSocket(accessToken);

  return () => {
    disconnectSocket();
  };
}, [accessToken]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 bg-slate-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}