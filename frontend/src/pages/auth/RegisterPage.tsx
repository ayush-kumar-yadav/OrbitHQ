import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { useRegister } from "../../hooks/auth/useRegister";
import { OrbitBrandPanel } from "../../components/auth/OrbitBrandPanel";

export default function RegisterPage() {
  const navigate = useNavigate();

  const register = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await register.mutateAsync({
        name,
        email,
        password,
      });

      toast.success(
        "Account created. Sign in to continue."
      );

      navigate("/login");
    } catch (err: any) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Registration failed"
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-[#08090D]">

      {/* Brand */}
      <OrbitBrandPanel
        heading="Set up your workspace."
        subheading="Create projects, invite your team, and start tracking work in a few minutes."
      />

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">

        <div className="w-full max-w-[430px]">

          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <span className="h-2 w-2 rounded-full bg-[#4C6FFF] shadow-[0_0_12px_rgba(76,111,255,0.8)]" />

            <span className="text-sm font-semibold text-white">
              OrbitHQ
            </span>
          </div>

          <div className="mb-7">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#626775]">
              GET STARTED
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-[#8D919D]">
              Start organizing your team's work
              today.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#10121A] p-7 shadow-2xl shadow-black/20">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-[#C4C7D0]"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#626775]"
                  />

                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0B0D12] pl-10 pr-3 text-sm text-white outline-none placeholder:text-[#4F5460] transition focus:border-[#4C6FFF]/60 focus:ring-2 focus:ring-[#4C6FFF]/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-[#C4C7D0]"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#626775]"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0B0D12] pl-10 pr-3 text-sm text-white outline-none placeholder:text-[#4F5460] transition focus:border-[#4C6FFF]/60 focus:ring-2 focus:ring-[#4C6FFF]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-[#C4C7D0]"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#626775]"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0B0D12] pl-10 pr-11 text-sm text-white outline-none placeholder:text-[#4F5460] transition focus:border-[#4C6FFF]/60 focus:ring-2 focus:ring-[#4C6FFF]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#626775] transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-medium text-[#C4C7D0]"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#626775]"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0B0D12] pl-10 pr-3 text-sm text-white outline-none placeholder:text-[#4F5460] transition focus:border-[#4C6FFF]/60 focus:ring-2 focus:ring-[#4C6FFF]/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={register.isPending}
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#4C6FFF] text-sm font-semibold text-white transition hover:bg-[#5C7CFF] hover:shadow-[0_0_25px_rgba(76,111,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {register.isPending
                  ? "Creating account..."
                  : "Create account"}

                {!register.isPending && (
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-[#626775]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#7187FF] transition hover:text-white"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}