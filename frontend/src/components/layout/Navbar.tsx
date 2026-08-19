import {
  Search,
} from "lucide-react";

import { useAuth } from "../../providers/AuthProvider";
import NotificationBell from "../notifications/NotificationBell";
import GlobalSearch from "../search/GlobalSearch";

export default function Navbar() {
  const { user } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#08090D]/90 px-5 backdrop-blur-xl lg:px-7">

      {/* Left */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#555A68]">
          Workspace
        </p>

        <h2 className="mt-0.5 text-sm font-semibold text-white">
          Overview
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Search desktop */}
        <div className="hidden md:block">
          <GlobalSearch />
        </div>

        {/* Mobile search icon */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-[#777C89] transition hover:border-white/[0.12] hover:text-white md:hidden"
          aria-label="Search"
        >
          <Search size={17} />
        </button>

        {/* Notifications */}
        <div className="ml-1">
          <NotificationBell />
        </div>

        {/* Divider */}
        <div className="mx-2 hidden h-7 w-px bg-white/[0.08] sm:block" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-white">
              {user?.name || "User"}
            </p>

            <p className="text-[10px] text-[#626775]">
              {user?.email || "Workspace member"}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#4C6FFF]/30 bg-[#4C6FFF]/10 text-xs font-semibold text-[#8CA0FF]">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}