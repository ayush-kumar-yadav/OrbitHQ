import { useEffect } from "react";
import {
  Building2,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../../providers/AuthProvider";
import { useMyOrganization } from "../../hooks/organizations/useMyOrganization";

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

// "Members" and "Analytics" used to live here too, but both pointed
// at the exact same route as another item (/organizations and
// /dashboard respectively) — two sidebar entries for one destination
// reads as broken navigation, not as two features. Organization
// already surfaces members (see OrganizationsPage), and Dashboard
// already is the analytics view, so those duplicates are removed
// rather than kept as decoration.
const workspaceNavigation = [
  {
    label: "Organization",
    path: "/organizations",
    icon: Building2,
  },
];

type Props = {
  // Only used by the mobile drawer variant — the desktop sidebar is
  // always visible and needs neither.
  onNavigate?: () => void;
};

// Shared between the always-visible desktop sidebar and the mobile
// slide-in drawer, so the two never drift out of sync with each
// other (previously there was no mobile version at all — the entire
// nav just disappeared below the lg breakpoint with no replacement).
function SidebarContent({ onNavigate }: Props) {
  const { user } = useAuth();
  const { data } = useMyOrganization();

  const organization = data?.data;
  const orgName = organization?.name || "Workspace";
  const orgInitial = orgName.charAt(0).toUpperCase();

  return (
    <>
      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#4C6FFF] shadow-[0_0_14px_rgba(76,111,255,0.8)]" />

          <span className="text-[15px] font-semibold tracking-tight text-white">
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
                  onClick={onNavigate}
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
                  onClick={onNavigate}
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
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.07] p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4C6FFF]/15 text-xs font-semibold text-[#7D94FF]">
            {orgInitial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">
              {orgName}
            </p>

            <p className="truncate text-[10px] text-[#626775]">
              {user?.name || "Workspace"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-[250px] shrink-0 border-r border-white/[0.07] bg-[#050608] lg:flex lg:flex-col">
      <SidebarContent />
    </aside>
  );
}

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

// Slide-in drawer used below the lg breakpoint, where the desktop
// <Sidebar> is display:none. Previously there was no mobile
// equivalent at all — the nav simply vanished.
export function MobileSidebarDrawer({ open, onClose }: MobileDrawerProps) {
  const { pathname } = useLocation();

  // Close automatically whenever the route changes (i.e. after
  // tapping a nav link), rather than requiring a separate tap on
  // the backdrop or close button every time.
  useEffect(() => {
    if (open) onClose();
    // Only re-run on pathname change — including `open`/`onClose`
    // here would close the drawer the instant it opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-[280px] max-w-[80vw] flex-col border-r border-white/[0.07] bg-[#050608] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-3 top-6 flex h-8 w-8 items-center justify-center rounded-lg text-[#8D919D] transition hover:bg-white/[0.05] hover:text-white"
        >
          <X size={16} />
        </button>

        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}