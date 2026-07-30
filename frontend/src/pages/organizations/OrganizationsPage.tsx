import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useCreateOrganization } from "../../hooks/organizations/useCreateOrganization";

export default function OrganizationsPage() {
  const [name, setName] = useState("");

  const createOrganization = useCreateOrganization();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    await createOrganization.mutateAsync({
      name,
    });

    setName("");
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Organizations
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md"
      >
        <input
          type="text"
          placeholder="Organization Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg p-3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg p-3"
        >
          Create Organization
        </button>
      </form>
    </DashboardLayout>
  );
}