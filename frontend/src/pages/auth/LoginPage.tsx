import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
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

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await loginMutation.mutateAsync(data);

      login(response.data.user, response.data.accessToken);

      navigate("/");
    } catch (error: any) {
      console.error(error);

      toast.error(error.response?.data?.message ?? "Something went wrong");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F6F6F3]">
      <OrbitBrandPanel
        heading="Every project, in its own orbit."
        subheading="Sign in to keep track of what's moving and what's stuck, in one place."
      />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-[#12141C]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[#8A8A82]">
            Sign in to continue to your workspace.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
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
                  {...register("email")}
                  className="w-full rounded-lg border border-[#DEDDD3] bg-white py-2.5 pl-10 pr-3 text-sm text-[#12141C] outline-none transition focus:border-[#4C6FFF] focus:ring-2 focus:ring-[#4C6FFF]/20"
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#3A3A38]"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#4C6FFF] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B4B2A9]"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
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

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-lg bg-[#4C6FFF] py-2.5 text-sm font-semibold text-white transition hover:bg-[#3D5AE0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8A8A82]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#4C6FFF] hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}