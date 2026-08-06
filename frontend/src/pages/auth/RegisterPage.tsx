import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { useRegister } from "../../hooks/auth/useRegister";

import { OrbitBrandPanel } from "../../components/auth/OrbitBrandPanel";

export default function RegisterPage() {
  const navigate = useNavigate();

  const register = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await register.mutateAsync({ name, email, password });

      toast.success("Account created. Sign in to continue.");

      navigate("/login");
    } catch (err: any) {
      console.error(err);

      toast.error(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F6F6F3]">
      <OrbitBrandPanel
        heading="Set up your workspace."
        subheading="Create projects, invite your team, and start tracking work in a few minutes."
      />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-[#12141C]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-[#8A8A82]">
            Start organizing your team's work today.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-[#3A3A38]"
              >
                Full name
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B4B2A9]"
                  aria-hidden="true"
                />
                <input
                  id="name"
                  type="text"
                  placeholder="Ayush Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#DEDDD3] bg-white py-2.5 pl-10 pr-3 text-sm text-[#12141C] outline-none transition focus:border-[#4C6FFF] focus:ring-2 focus:ring-[#4C6FFF]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#3A3A38]"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B4B2A9]"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#DEDDD3] bg-white py-2.5 pl-10 pr-3 text-sm text-[#12141C] outline-none transition focus:border-[#4C6FFF] focus:ring-2 focus:ring-[#4C6FFF]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#3A3A38]"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B4B2A9]"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#DEDDD3] bg-white py-2.5 pl-10 pr-10 text-sm text-[#12141C] outline-none transition focus:border-[#4C6FFF] focus:ring-2 focus:ring-[#4C6FFF]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A82] hover:text-[#3A3A38]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-[#3A3A38]"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B4B2A9]"
                  aria-hidden="true"
                />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#DEDDD3] bg-white py-2.5 pl-10 pr-3 text-sm text-[#12141C] outline-none transition focus:border-[#4C6FFF] focus:ring-2 focus:ring-[#4C6FFF]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={register.isPending}
              className="w-full rounded-lg bg-[#4C6FFF] py-2.5 text-sm font-semibold text-white transition hover:bg-[#3D5AE0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {register.isPending ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8A8A82]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#4C6FFF] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}