import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  LogOut,
  Menu,
} from "lucide-react";

import { useAuth } from "../../providers/AuthProvider";
import NotificationBell from "../notifications/NotificationBell";
import GlobalSearch, {
  type GlobalSearchHandle,
} from "../search/GlobalSearch";

// Route → (eyebrow, title) shown in the navbar. Static routes get an
// exact match; detail routes (/projects/:id, /tasks/:id) fall back to
// a section-level label via startsWith, since the navbar doesn't have
// access to the actual project/task name without deeper prop/context
// plumbing — "Project / Details" is a smaller, honest fix rather than
// silently keeping the old page permanently saying "Overview".
const ROUTE_TITLES: { match: (path: string) => boolean; eyebrow: string; title: string }[] = [
  { match: (p) => p === "/dashboard", eyebrow: "Workspace", title: "Overview" },
  { match: (p) => p === "/projects", eyebrow: "Workspace", title: "All Projects" },
  { match: (p) => p.startsWith("/projects/"), eyebrow: "Project", title: "Details" },
  { match: (p) => p === "/tasks/kanban", eyebrow: "Tasks", title: "Kanban" },
  { match: (p) => p === "/tasks", eyebrow: "Workspace", title: "All Tasks" },
  { match: (p) => p.startsWith("/tasks/"), eyebrow: "Task", title: "Details" },
  { match: (p) => p === "/organizations", eyebrow: "Workspace", title: "Organization" },
];

function useRouteTitle() {
  const { pathname } = useLocation();

  const match = ROUTE_TITLES.find((entry) => entry.match(pathname));

  return match ?? { eyebrow: "Workspace", title: "Overview" };
}

type Props = {
  onOpenMenu?: () => void;
};

export default function Navbar({ onOpenMenu }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { eyebrow, title } = useRouteTitle();

  const [menuOpen, setMenuOpen] = useState(false);

  const searchRef = useRef<GlobalSearchHandle>(null);

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#08090D]/90 px-5 backdrop-blur-xl lg:px-7">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-[#8D919D] transition hover:border-white/[0.14] hover:text-white lg:hidden"
        >
          <Menu size={16} />
        </button>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#555A68]">
            {eyebrow}
          </p>

          <h2 className="mt-0.5 text-sm font-semibold text-white">
            {title}
          </h2>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Search (desktop shows the trigger pill; mobile uses the icon button below) */}
        <GlobalSearch ref={searchRef} />

        {/* Mobile search icon */}
        <button
          type="button"
          onClick={() => searchRef.current?.open()}
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
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex items-center gap-3 rounded-xl px-1.5 py-1 transition hover:bg-white/[0.04]"
          >
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
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />

              <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-[#10121A] py-1.5 shadow-xl">
                <div className="border-b border-white/[0.06] px-3.5 py-2.5 sm:hidden">
                  <p className="text-xs font-medium text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-[#626775]">
                    {user?.email || "Workspace member"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-[#FF7B87] transition hover:bg-[#FF5C6C]/10"
                >
                  <LogOut size={15} />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}