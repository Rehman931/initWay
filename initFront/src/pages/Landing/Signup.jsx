import React, { useState } from "react";
import { Eye, EyeOff, Sparkles, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) {
      setError("");
    }
  };

  // HANDLE SIGNUP

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create a temporary registration record in your backend.
      const apiBase = API_URL?.replace(/\/+$/, "");

      if (!apiBase) {
        throw new Error("Backend URL is not configured.");
      }

      const response = await fetch(`${apiBase}/api/auth/userexist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to start registration.");
      }

      if (!data.pendingRegistrationID) {
        throw new Error("Backend did not return a pending registration ID.");
      }

      // 2. Build the email confirmation callback URL.
      const callbackUrl = new URL("/auth/callback", window.location.origin);

      callbackUrl.searchParams.set(
        "pendingRegistrationID",
        data.pendingRegistrationID,
      );

      // 3. Save the pending ID before requesting the email.
      // The callback URL also carries it if the email opens in a new tab.
      sessionStorage.setItem("signupEmail", email);
      sessionStorage.setItem(
        "pendingRegistrationID",
        data.pendingRegistrationID,
      );

      localStorage.setItem("pendingRegistrationID", data.pendingRegistrationID);

      // 4. Create the Supabase Auth user and send a confirmation link.
      const { data: authData, error: signupError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            emailRedirectTo: callbackUrl.toString(),
            data: {
              name,
            },
          },
        },
      );

      if (signupError) {
        throw new Error(signupError.message);
      }

      if (!authData.user) {
        throw new Error(
          "Supabase did not return a user. Please try again later.",
        );
      }

      // With email confirmation enabled, a session is normally null
      // until the user confirms the email.
      navigate("/check-email", { replace: true });
    } catch (err) {
      console.error("Signup error:", err);

      const message = err?.message || "";

      if (/rate limit|too many requests|429/i.test(message)) {
        setError(
          "Too many verification emails have been requested. " +
            "Please wait before trying again.",
        );
      } else {
        setError(message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-(--workspace-ink) text-white p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between w-full">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={21} />
            </div>

            <span className="text-2xl font-bold tracking-tight">InitWay</span>
          </div>

          {/* Main content */}
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm mb-6">
              <Sparkles size={14} />
              Start building smarter
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Turn your idea into a
              <span className="text-violet-200"> real startup.</span>
            </h1>

            <p className="text-lg text-white/70 leading-relaxed mb-8">
              Validate your idea, research your market, create your pitch, plan
              your roadmap, and discover the technology you need — all in one
              place.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                "AI-powered startup validation",
                "Market and competitor research",
                "Pitch, roadmap & tech stack generation",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-white/90"
                >
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                    <Check size={14} />
                  </div>

                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-sm text-white/40">Build. Validate. Launch.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <Sparkles size={21} />
            </div>

            <span className="text-2xl font-bold text-gray-900">InitWay</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>

            <p className="mt-2 text-gray-500">
              Start turning your startup idea into reality.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                autoComplete="name"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition disabled:opacity-60"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                disabled={loading}
                className="mt-1 w-4 h-4 accent-violet-600"
              />

              <span className="text-sm text-gray-500 leading-5">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-violet-600 hover:text-violet-700 font-medium"
                  onClick={() => navigate("/terms")}
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-violet-600 hover:text-violet-700 font-medium"
                  onClick={() => navigate("/privacy")}
                >
                  Privacy Policy
                </button>
                .
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-violet-200"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Please wait, processing...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <button
              type="button"
              className="font-semibold text-violet-600 hover:text-violet-700"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
