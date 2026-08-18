import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { toast } from "sonner";

import { useLogin } from "../../hooks/useAuth";
import { useAuth } from "../../providers/AuthProvider";

import { loginSchema } from "../../utils/login.schema";
import type { LoginFormData } from "../../utils/login.schema";

import { OrbitBrandPanel } from "../../components/auth/OrbitBrandPanel";

export default function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(
    data: LoginFormData
  ) {
    try {
      const response =
        await loginMutation.mutateAsync(data);

      login(
        response.data.user,
        response.data.accessToken
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.message ??
          "Something went wrong"
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-[#08090D]">

      {/* Brand */}
      <OrbitBrandPanel
        heading="Every project, in its own orbit."
        subheading="Sign in to keep track of what's moving and what's stuck, in one place."
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
              WELCOME BACK
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Sign in to OrbitHQ
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-[#8D919D]">
              Continue to your workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#10121A] p-7 shadow-2xl shadow-black/20">

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

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
                    {...register("email")}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0B0D12] pl-10 pr-3 text-sm text-white outline-none placeholder:text-[#4F5460] transition focus:border-[#4C6FFF]/60 focus:ring-2 focus:ring-[#4C6FFF]/10"
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-xs text-[#FF6B78]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-[#C4C7D0]"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-medium text-[#7187FF] transition hover:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>

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
                    {...register("password")}
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
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-xs text-[#FF6B78]">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={
                  loginMutation.isPending
                }
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#4C6FFF] text-sm font-semibold text-white transition hover:bg-[#5C7CFF] hover:shadow-[0_0_25px_rgba(76,111,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loginMutation.isPending
                  ? "Signing in..."
                  : "Sign in"}

                {!loginMutation.isPending && (
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-[#626775]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[#7187FF] transition hover:text-white"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}