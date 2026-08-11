import { useEffect } from "react";
import type { ReactNode } from "react";

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

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 flex-1 bg-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}