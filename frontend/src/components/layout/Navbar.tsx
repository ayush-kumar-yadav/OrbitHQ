import { useAuth } from "../../providers/AuthProvider";
import NotificationBell from "../notifications/NotificationBell";
import GlobalSearch from "../search/GlobalSearch";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Left */}
      <h2 className="text-lg font-semibold">
        Dashboard
      </h2>

      {/* Right */}
      <div className="flex items-center gap-4">
        <GlobalSearch />

        <NotificationBell />

        <div className="text-sm font-medium text-slate-700">
          {user?.name}
        </div>
      </div>
    </header>
  );
}