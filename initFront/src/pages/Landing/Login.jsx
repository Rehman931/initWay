import React, { useState } from "react";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear messages when user starts typing again
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      // ==========================================
      // USER NOT FOUND
      // ==========================================
      if (
        response.status === 404 ||
        data.message?.toLowerCase().includes("user not found") ||
        data.message?.toLowerCase().includes("user does not exist") ||
        data.message?.toLowerCase().includes("account not found")
      ) {
        setSuccessMessage("account not found");

        setTimeout(() => {
          navigate("/signup", {
            state: {
              email: formData.email,
            },
          });
        }, 2500);

        return;
      }

      // ==========================================
      // OTHER LOGIN ERRORS
      // ==========================================
      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // ==========================================
      // SUCCESSFUL LOGIN
      // ==========================================
      if (!data.token) {
        throw new Error("Login successful, but token was not received.");
      }

      localStorage.setItem("token", data.token);

      // Optional: clear old cached data
      // localStorage.removeItem("initway_projects");
      // localStorage.removeItem("initway_report_history");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message || "Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-white transition-all duration-800 ease-in-out">
      {/* ==========================================
          LEFT SIDE
      ========================================== */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        {/* Logo */}
        <div
          className="relative flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-900/40">
            <Sparkles size={19} />
          </div>

          <span className="text-2xl font-bold">
            Init<span className="text-violet-400">Way</span>
          </span>
        </div>

        {/* Main content */}
        <div className="relative max-w-lg">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles size={15} />
            Build with clarity
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Turn your idea into
            <span className="block text-violet-400">something real.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
            Validate your startup idea, understand your opportunity, build your
            pitch, plan your roadmap and choose your technology — all in one
            place.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-4">
            {[
              "AI-powered idea validation",
              "Structured startup research",
              "Pitch, roadmap & tech stack",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/15 text-violet-400">
                  ✓
                </div>

                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative text-sm text-slate-500">
          Your idea. Your direction. Your InitWay.
        </p>
      </div>

      {/* ==========================================
          RIGHT SIDE
      ========================================== */}
      <div className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div
            className="mb-10 flex items-center justify-center gap-2 lg:hidden"
            onClick={() => navigate("/")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
              <Sparkles size={19} />
            </div>

            <span className="text-2xl font-bold">
              Init<span className="text-violet-600">Way</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-violet-600">
              Welcome back
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Sign in to InitWay
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Continue building your startup idea.
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-violet-600 transition hover:text-violet-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />

                <label htmlFor="remember" className="text-sm text-slate-500">
                  Remember me
                </label>
              </div>

              {/* ==========================================
                  ERROR MESSAGE
              ========================================== */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-green-600">{error}</p>
                </div>
              )}

              {/* ==========================================
                  USER NOT FOUND MESSAGE
              ========================================== */}
              {successMessage && (
                <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !!successMessage}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs text-slate-400">OR</span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Register */}
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-semibold text-violet-600 transition hover:text-violet-700"
              >
                Create an account
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            By continuing, you agree to InitWay's Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
