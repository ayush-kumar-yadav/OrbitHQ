import DashboardLayout from "../../layouts/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold">Welcome to OrbitHQ 🚀</h1>
        <p className="mt-2 text-gray-600">
          Your productivity workspace is ready.
        </p>
      </div>
    </DashboardLayout>
  );
}