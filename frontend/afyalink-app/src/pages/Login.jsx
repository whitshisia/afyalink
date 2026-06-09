import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import { authAPI } from "../api/authAPI";
import { useAuthStore } from "../store/authStore";
import clsx from "clsx";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      toast.success(`Welcome back, ${data.user.full_name.split(" ")[0]}!`);
      const redirect =
        from || (data.user.role === "doctor" ? "/provider" : "/dashboard");
      navigate(redirect, { replace: true });
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Login failed. Please try again.");
    },
  });

  const onSubmit = (values) => mutation.mutate(values);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-teal-100/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-md">
              <ShieldCheck size={22} strokeWidth={2.5} color="white" />
            </div>
            <span className="font-display text-2xl font-bold text-gray-900">
              afya<span className="text-brand-600">link</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-display font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Sign in to your AfyaLink account
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  className={clsx(
                    "input-field pl-10",
                    errors.email && "input-error"
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                  className={clsx(
                    "input-field pl-10 pr-10",
                    errors.password && "input-error"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-primary btn-lg w-full justify-center mt-2"
            >
              {mutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Protected by AfyaLink · HIPAA Compliant · 256-bit encryption
        </p>
      </div>
    </div>
  );
}
