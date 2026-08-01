import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRegister } from "../../hooks/auth/useRegister";

export default function RegisterPage() {
  const navigate = useNavigate();

  const register = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await register.mutateAsync({
        name,
        email,
        password,
      });

      alert("Registration successful!");

      navigate("/login");
    } catch (err: any) {
  console.error(err);

  console.log("Status:", err.response?.status);
  console.log("Data:", err.response?.data);

  alert(
    err.response?.data?.message || "Registration failed"
  );
}
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full rounded-lg border p-3"
            required
          />

          <button
            type="submit"
            disabled={register.isPending}
            className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {register.isPending
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600"
          >
            Login
          </Link>
        </p>
        <p className="mt-6 text-center text-sm text-gray-600">
  Already have an account?{" "}
  <Link
    to="/login"
    className="font-semibold text-blue-600 hover:underline"
  >
    Login
  </Link>
</p>
      </div>
    </div>
  );
}