import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, Phone, ShieldCheck, Stethoscope, Heart } from "lucide-react";
import { authAPI } from "../api/authAPI";
import { useAuthStore } from "../store/authStore";
import clsx from "clsx";

const ROLES = [
  {
    id: "patient",
    label: "I'm a Patient",
    desc: "Book appointments & manage my health",
    Icon: Heart,
    color: "text-brand-600",
    bg: "bg-brand-50",
    border: "border-brand-400",
  },
  {
    id: "doctor",
    label: "I'm a Doctor",
    desc: "Manage patients & consultations",
    Icon: Stethoscope,
    color: "text-teal-500",
    bg: "bg-teal-100/50",
    border: "border-teal-500",
  },
];

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: "patient" } });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: async (_, variables) => {
      // Auto-login after register
      const loginData = await authAPI.login({
        email: variables.email,
        password: variables.password,
      });
      setAuth({
        user: loginData.user,
        access_token: loginData.access_token,
        refresh_token: loginData.refresh_token,
      });
      toast.success("Account created! Welcome to AfyaLink 🎉");
      navigate(role === "doctor" ? "/provider" : "/dashboard", { replace: true });
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Registration failed.");
    },
  });

  const onSubmit = (values) => registerMutation.mutate({ ...values, role });

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-teal-100/30 flex items-center justify-center p-4 py-10">
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
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">Free forever on the basic plan</p>
        </div>

        <div className="card p-8">
          {/* Role selector */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">I am joining as a…</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(({ id, label, desc, Icon, color, bg, border }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={clsx(
                    "p-3.5 rounded-xl border-2 text-left transition-all duration-150",
                    role === id
                      ? `${border} ${bg}`
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Icon size={20} className={clsx(color, "mb-2")} />
                  <div className="text-sm font-semibold text-gray-900">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Jane Doe"
                  {...register("full_name", { required: "Full name is required" })}
                  className={clsx("input-field pl-10", errors.full_name && "input-error")}
                />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  className={clsx("input-field pl-10", errors.email && "input-error")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+254 700 000 000"
                  {...register("phone")}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Must be at least 8 characters" },
                  })}
                  className={clsx("input-field pl-10 pr-10", errors.password && "input-error")}
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
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="btn btn-primary btn-lg w-full justify-center mt-2"
            >
              {registerMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create free account →"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By registering, you agree to our{" "}
          <a href="#" className="underline">Terms</a> &{" "}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
