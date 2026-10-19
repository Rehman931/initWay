import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { supabase } from "../../lib/supabase.js"; // Adjust this import to your Supabase client file.

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;
const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function OtpPage() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(() => {
    const resendAt = Number(sessionStorage.getItem("resendOtpAt"));
    return resendAt
      ? Math.max(0, Math.ceil((resendAt - Date.now()) / 1000))
      : 0;
  });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const email = (sessionStorage.getItem("signupEmail") || "")
    .trim()
    .toLowerCase();
  const pendingRegistrationID =
    sessionStorage.getItem("pendingRegistrationID") || "";

  // Keep the countdown accurate if the tab is backgrounded or refreshed.
  useEffect(() => {
    const updateCountdown = () => {
      const resendAt = Number(sessionStorage.getItem("resendOtpAt"));
      setTimeLeft(
        resendAt ? Math.max(0, Math.ceil((resendAt - Date.now()) / 1000)) : 0,
      );
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const startCountdown = (seconds = RESEND_SECONDS) => {
    const resendAt = Date.now() + seconds * 1000;
    sessionStorage.setItem("resendOtpAt", String(resendAt));
    setTimeLeft(seconds);
  };

  const focusInput = (index) => {
    const input = inputRefs.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  };

  const handleOtpChange = (index, value) => {
    setError("");
    setMessage("");

    const digits = value.replace(/\D/g, "");

    if (!digits) {
      setOtp((previous) => {
        const updated = [...previous];
        updated[index] = "";
        return updated;
      });
      return;
    }

    if (digits.length > 1) {
      const updated = [...otp];
      const characters = digits.slice(0, OTP_LENGTH - index);

      characters.split("").forEach((digit, offset) => {
        updated[index + offset] = digit;
      });

      setOtp(updated);
      focusInput(Math.min(index + characters.length, OTP_LENGTH - 1));
      return;
    }

    setOtp((previous) => {
      const updated = [...previous];
      updated[index] = digits;
      return updated;
    });

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      setError("");
      setMessage("");

      if (otp[index]) {
        setOtp((previous) => {
          const updated = [...previous];
          updated[index] = "";
          return updated;
        });
      } else if (index > 0) {
        setOtp((previous) => {
          const updated = [...previous];
          updated[index - 1] = "";
          return updated;
        });
        focusInput(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!digits) return;

    setError("");
    setMessage("");

    const updated = Array(OTP_LENGTH).fill("");
    digits.split("").forEach((digit, index) => {
      updated[index] = digit;
    });

    setOtp(updated);
    focusInput(Math.min(digits.length, OTP_LENGTH - 1));
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email || !pendingRegistrationID) {
      setError(
        "Signup details expired. Please return to signup and try again.",
      );
      return;
    }

    const token = otp.join("");
    if (!/^\d{6}$/.test(token)) {
      setError("Please enter all six digits.");
      focusInput(
        Math.max(
          otp.findIndex((digit) => !digit),
          0,
        ),
      );
      return;
    }

    setLoading(true);

    try {
      // Verify the numeric email OTP with Supabase.
      const { data: verificationData, error: verificationError } =
        await supabase.auth.verifyOtp({
          email,
          token,
          type: "email",
        });

      if (verificationError) throw verificationError;

      const supabaseAccessToken = verificationData.session?.access_token;

      if (!supabaseAccessToken) {
        throw new Error(
          "Supabase did not return a verified session. Check your email OTP configuration.",
        );
      }

      // Backend must verify this access token with Supabase Auth before
      // creating the permanent MongoDB user.

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
        body: JSON.stringify({
          pendingRegistrationID,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to complete signup.");
      }

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Could not complete registration.");
      }

      // Adapt these names if your backend returns a different JWT field.
      const appToken = result.token || result.accessToken || result.jwt;

      if (!appToken) {
        throw new Error(
          "Registration completed, but the backend did not return the InitWay JWT.",
        );
      }

      // Keep the app's JWT separate from the Supabase access token.
      localStorage.setItem("token", appToken);

      sessionStorage.removeItem("pendingRegistrationID");
      sessionStorage.removeItem("signupEmail");
      sessionStorage.removeItem("resendOtpAt");

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || resending || loading) return;

    setError("");
    setMessage("");

    if (!email || !pendingRegistrationID) {
      setError("Signup details expired. Please return to signup.");
      return;
    }

    setResending(true);

    try {
      // This backend route must apply Redis rate limiting and send the OTP
      // through Supabase. A direct browser-to-Supabase call bypasses your
      // custom Express/Redis rate limiter.
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 429 && result.retryAfter) {
          startCountdown(Number(result.retryAfter));
        }
        throw new Error(
          result.message || "Could not resend the verification code.",
        );
      }

      const resendAfter = Number(result.resendAfter) || RESEND_SECONDS;
      startCountdown(resendAfter);
      setOtp(Array(OTP_LENGTH).fill(""));
      setMessage("A new verification code has been sent to your email.");
      focusInput(0);
    } catch (err) {
      setError(err.message || "Could not resend the code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5f6ff] via-white to-[#f0f3ff] px-4 py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

      <section className="relative w-full max-w-lg rounded-3xl border border-white bg-white/95 p-6 shadow-2xl shadow-indigo-100/70 backdrop-blur-xl sm:p-10 md:p-12">
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-700"
        >
          <ArrowLeft size={17} />
          Back to signup
        </button>

        <div className="mb-9 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200">
            <Sparkles size={22} />
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-[#111b49]">
            InitWay
          </span>
        </div>

        <div className="flex items-center justify-end">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 sm:text-sm">
            <Clock3 size={16} />
            {timeLeft > 0 ? formatTime(timeLeft) : "Ready to resend"}
          </div>
        </div>

        <div className="mt-7 text-center">
          <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 text-violet-600 ring-1 ring-violet-100">
            <Mail size={36} strokeWidth={1.7} />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#111b49] sm:text-4xl">
            Verify your email
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
            Enter the six-digit verification code sent to
          </p>
          <p className="mt-1 break-all text-sm font-bold text-violet-700 sm:text-base">
            {email || "your email"}
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-9">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                pattern="[0-9]*"
                maxLength={OTP_LENGTH}
                value={digit}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPaste={handlePaste}
                onFocus={(event) => event.target.select()}
                aria-label={`OTP digit ${index + 1}`}
                className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/70 text-center text-xl font-bold text-[#111b49] outline-none transition duration-200 hover:border-violet-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 sm:h-14 sm:max-w-[56px] sm:text-2xl"
              />
            ))}
          </div>

          <p className="mt-3 text-center text-xs text-slate-400">
            Enter each digit or paste your complete code.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-5 text-red-600"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="mt-5 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm leading-5 text-blue-700"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <p>{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || resending || !email || !pendingRegistrationID}
            className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-4 font-bold text-white shadow-lg shadow-violet-200/70 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Verifying and creating account...
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                Verify email
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-7 text-center">
          <div className="mb-3 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0 || resending || loading || !email}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-violet-600 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            <RefreshCw size={19} className={resending ? "animate-spin" : ""} />
            {resending ? "Requesting code..." : "Resend OTP"}
          </button>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {timeLeft > 0
              ? `You can request a new code in ${formatTime(timeLeft)}`
              : "Didn't receive the code? Request a new one."}
          </p>
        </div>

        <div className="mt-9 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
          <LockKeyhole size={14} />
          Your information is safe with us
        </div>
      </section>

      <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-slate-400">
        InitWay <span className="mx-1.5">·</span> Build Your Future
      </p>
    </main>
  );
}
