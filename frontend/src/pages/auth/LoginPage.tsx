import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "../../hooks/useAuth";
import { useAuth } from "../../providers/AuthProvider";

import { loginSchema } from "../../utils/login.schema";
import type { LoginFormData } from "../../utils/login.schema";

export default function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const { login } = useAuth();

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

      login(
        response.data.user,
        response.data.accessToken
      );

      navigate("/");
    } catch (error: any) {
  console.error(error);

  console.log("Status:", error.response?.status);
  console.log("Data:", error.response?.data);

  alert(
    error.response?.data?.message ??
    "Something went wrong"
  );
}
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-6 text-center text-3xl font-bold">
          Welcome Back
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              {...register("password")}
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending
              ? "Signing In..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}