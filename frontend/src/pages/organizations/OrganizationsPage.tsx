import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../providers/AuthProvider";
import { useCreateOrganization } from "../../hooks/organizations/useCreateOrganization";
import { useMyOrganization } from "../../hooks/organizations/useMyOrganization";

import MembersTab from "../../components/organization/MembersTab";

export default function OrganizationsPage() {
  const { user } = useAuth();

  if (user?.organizationId) {
    return (
      <DashboardLayout>
        <OrganizationOverview />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <CreateOrganizationForm />
    </DashboardLayout>
  );
}

/* ========================================================= */
/* ORGANIZATION OVERVIEW (user already belongs to one)       */
/* ========================================================= */

function OrganizationOverview() {
  const { data, isLoading } = useMyOrganization();

  const organization = data?.data;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10121A] px-6 py-7 sm:px-8">
        <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#4C6FFF]/10 blur-3xl" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#4C6FFF]/30 bg-[#4C6FFF]/10 text-lg font-semibold text-[#8CA0FF]">
            {(organization?.name ?? "O").charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4C6FFF] shadow-[0_0_10px_rgba(76,111,255,0.8)]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#626775]">
                Workspace
              </span>
            </div>

            <h1 className="font-display text-2xl leading-snug text-white sm:text-3xl">
              {isLoading ? "Loading..." : organization?.name ?? "Your organization"}
            </h1>

            {organization?.slug && (
              <p className="mt-1 text-xs text-[#626775]">
                orbithq.app/{organization.slug}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* MEMBERS + INVITE                                   */}
      {/* ================================================= */}

      <div className="rounded-2xl border border-white/[0.07] bg-[#10121A] p-6">
        <MembersTab />
      </div>

    </div>
  );
}

/* ========================================================= */
/* CREATE ORGANIZATION (user doesn't belong to one yet)      */
/* ========================================================= */

function CreateOrganizationForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");

  const createOrganization = useCreateOrganization();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      const response = await createOrganization.mutateAsync({ name });

      // The backend reissues fresh tokens here because organizationId
      // and role are baked into the JWT payload at generation time —
      // the token the user logged in with still claims
      // organizationId: null otherwise, and every org-scoped request
      // right after this would keep 400ing despite the org existing.
      login(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken
      );

      toast.success("Organization created");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ?? "Couldn't create organization."
      );
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10121A] p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#4C6FFF]/10 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4C6FFF]/10 text-[#4C6FFF]">
            <Building2 size={20} />
          </div>

          <h1 className="font-display text-2xl text-white">
            Create your organization
          </h1>

          <p className="mt-2 text-sm text-[#8D919D]">
            You'll be the owner. You can invite teammates right after.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-[#8D919D]">
                Organization name
              </label>
              <input
                type="text"
                placeholder="Acme Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="orbit-input"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={createOrganization.isPending || !name.trim()}
              className="orbit-btn-solid w-full"
            >
              {createOrganization.isPending ? (
                "Creating..."
              ) : (
                <>
                  <UserPlus size={15} /> Create Organization
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}