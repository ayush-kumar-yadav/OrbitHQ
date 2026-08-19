import { useState } from "react";
import { UserPlus, Users } from "lucide-react";

import { useMembers } from "../../hooks/organizations/useMembers";
import { useInviteMember } from "../../hooks/organizations/useInviteMember";

const ROLE_META: Record<string, { color: string }> = {
  ADMIN: { color: "#4C6FFF" },
  MANAGER: { color: "#F5A623" },
  DEVELOPER: { color: "#2FD9C4" },
  VIEWER: { color: "#8D919D" },
};

export default function MembersTab() {
  const { data } = useMembers();
  const invite = useInviteMember();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("DEVELOPER");

  const members = data?.data || [];

  return (
    <div className="space-y-5">

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
          Team
        </p>
        <h2 className="mt-1 font-display text-[17px] text-white">
          Members
        </h2>

        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04]">
              <Users size={18} className="text-[#4F5460]" />
            </div>
            <p className="text-sm text-[#8D919D]">No members yet.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-1.5">
            {members.map((member: any) => {
              const role = ROLE_META[member.role] ?? ROLE_META.VIEWER;
              const initials = member.user.name
                ?.split(" ")
                .map((p: string) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={member.user._id}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-white/[0.03]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4C6FFF]/15 text-[11px] font-semibold text-[#7D94FF]">
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#EDEEF2]">
                      {member.user.name}
                    </p>
                    <p className="truncate text-xs text-[#626775]">
                      {member.user.email}
                    </p>
                  </div>

                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      backgroundColor: `${role.color}1A`,
                      color: role.color,
                    }}
                  >
                    {member.role}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.06] pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#626775]">
          Invite
        </p>
        <h2 className="mt-1 font-display text-[17px] text-white">
          Invite Member
        </h2>

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <input
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="orbit-input flex-1"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="orbit-input sm:w-40"
          >
            <option value="DEVELOPER">Developer</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
            <option value="VIEWER">Viewer</option>
          </select>

          <button
            onClick={() => invite.mutate({ email, role })}
            disabled={invite.isPending || !email.trim()}
            className="orbit-btn-solid shrink-0 sm:w-auto"
          >
            {invite.isPending ? (
              "Inviting..."
            ) : (
              <>
                <UserPlus size={14} /> Invite
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}