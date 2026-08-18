import {
  BarChart3,
  Building2,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const mainNavigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
];

const workspaceNavigation = [
  {
    label: "Organization",
    path: "/organizations",
    icon: Building2,
  },
  {
    label: "Members",
    path: "/organizations",
    icon: Users,
  },
  {
    label: "Analytics",
    path: "/dashboard",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-[250px] shrink-0 border-r border-white/[0.07] bg-[#050608] lg:flex lg:flex-col">
      
      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3"
        >
          <span className="orbit-logo-mark">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="2.4" fill="#4C6FFF" />
              <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#111" strokeWidth="1.3" />
              <ellipse
                cx="12"
                cy="12"
                rx="10"
                ry="4.2"
                stroke="#111"
                strokeWidth="1.3"
                transform="rotate(60 12 12)"
              />
            </svg>
          </span>

          <span className="orbit-wordmark">
            OrbitHQ
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3">

        <div className="mb-8">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#555A68]">
            Workspace
          </p>

          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "bg-[#4C6FFF]/10 text-white"
                        : "text-[#858A97] hover:bg-white/[0.04] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                        className={
                          isActive
                            ? "text-[#4C6FFF]"
                            : "text-[#666B78] group-hover:text-[#AEB2BD]"
                        }
                      />

                      <span>{item.label}</span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#4C6FFF] shadow-[0_0_8px_rgba(76,111,255,0.8)]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#555A68]">
            Organization
          </p>

          <nav className="space-y-1">
            {workspaceNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "bg-[#4C6FFF]/10 text-white"
                        : "text-[#858A97] hover:bg-white/[0.04] hover:text-white"
                    }`
                  }
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className="text-[#666B78] group-hover:text-[#AEB2BD]"
                  />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.07] p-3">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#858A97] transition hover:bg-white/[0.04] hover:text-white"
        >
          <Settings size={17} strokeWidth={1.8} />

          <span>Settings</span>
        </NavLink>

        <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3">
          <div className="orbit-logo-mark h-8 w-8 text-xs font-semibold">
            O
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">
              Orbit Workspace
            </p>

            <p className="text-[10px] text-[#626775]">
              Workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}