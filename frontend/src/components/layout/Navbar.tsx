import { useAuth } from "../../providers/AuthProvider";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-white">
      <h2 className="text-lg font-semibold">
        Dashboard
      </h2>

      <div>
        {user?.name}
      </div>
    </header>
  );
}