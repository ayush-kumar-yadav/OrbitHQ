import { useState } from "react";

import { useMembers } from "../../hooks/organizations/useMembers";
import { useInviteMember } from "../../hooks/organizations/useInviteMember";

export default function MembersTab() {
  const { data } = useMembers();

  const invite = useInviteMember();

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("DEVELOPER");

  const members = data?.data || [];

  return (
    <div className="space-y-8">

      <div className="rounded-xl border bg-white p-6">

        <h2 className="mb-5 text-2xl font-bold">
          Members
        </h2>

        <div className="space-y-4">

          {members.map((member: any) => (

            <div
              key={member.user._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>

                <p className="font-semibold">
                  {member.user.name}
                </p>

                <p className="text-gray-500">
                  {member.user.email}
                </p>

              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                {member.role}
              </span>

            </div>

          ))}

        </div>

      </div>

      <div className="rounded-xl border bg-white p-6">

        <h2 className="mb-5 text-xl font-semibold">
          Invite Member
        </h2>

        <div className="space-y-4">

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>
              setEmail(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

          <select
            value={role}
            onChange={(e)=>
              setRole(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option>
              DEVELOPER
            </option>

            <option>
              MANAGER
            </option>

            <option>
              ADMIN
            </option>

            <option>
              VIEWER
            </option>

          </select>

          <button
            onClick={() =>
              invite.mutate({
                email,
                role,
              })
            }
            className="rounded-lg bg-blue-600 px-6 py-3 text-white"
          >
            Invite
          </button>

        </div>

      </div>

    </div>
  );
}