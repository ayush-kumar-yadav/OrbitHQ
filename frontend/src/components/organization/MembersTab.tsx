import { useState } from "react";
import { UserPlus, Users, Info } from "lucide-react";
import { toast } from "sonner";

import { useMembers } from "../../hooks/organizations/useMembers";
import { useInviteMember } from "../../hooks/organizations/useInviteMember";

const ROLE_META: Record<string, { color: string }> = {
  ADMIN: { color: "#4C6FFF" },
  MANAGER: { color: "#F5A623" },
  DEVELOPER: { color: "#2FD9C4" },
  VIEWER: { color: "#8D919D" },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MembersTab() {
  const { data } = useMembers();
  const invite = useInviteMember();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("DEVELOPER");
  const [touched, setTouched] = useState(false);

  const members = data?.data || [];

  const trimmedEmail = email.trim();
  const isValidEmail = EMAIL_PATTERN.test(trimmedEmail);
  const showEmailError = touched && trimmedEmail.length > 0 && !isValidEmail;

  async function handleInvite() {
    setTouched(true);

    if (!isValidEmail) return;

    try {
      await invite.mutateAsync({ email: trimmedEmail, role });

      toast.success("Member added", {
        description: `${trimmedEmail} now has access to this organization.`,
      });

      setEmail("");
      setTouched(false);
    } catch (error: any) {
      // The backend's message is already specific and accurate here
      // ("User not found", "User already belongs to an organization",
      // etc) — surface it directly rather than a generic fallback.
      toast.error(
        error.response?.data?.message ?? "Couldn't add this member."
      );
    }
  }

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

        <div className="mt-3 flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <Info size={13} className="mt-0.5 shrink-0 text-[#626775]" />
          <p className="text-[11px] leading-relaxed text-[#8D919D]">
            The person needs an existing OrbitHQ account with this email
            and no other organization yet — email invites for new
            signups aren't set up in this version.
          </p>
        </div>

        <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
          <div className="flex-1">
            <input
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              className="orbit-input w-full"
            />

            {showEmailError && (
              <p className="mt-1.5 text-[11px] text-[#FF6B78]">
                Enter a valid email address.
              </p>
            )}
          </div>

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
            onClick={handleInvite}
            disabled={invite.isPending || !trimmedEmail}
            className="orbit-btn-solid h-11 shrink-0 sm:w-auto"
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