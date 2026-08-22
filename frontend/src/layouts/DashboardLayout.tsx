import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNotificationSocket } from "../hooks/notifications/useNotificationSocket";
import Sidebar, { MobileSidebarDrawer } from "../components/layout/Sidebar";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    <div className="flex h-screen overflow-hidden bg-[#050608]">
      <Sidebar />

      <MobileSidebarDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onOpenMenu={() => setMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-[#050608] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}