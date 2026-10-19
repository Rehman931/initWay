import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function AuthCallbackPage() {
  const started = useRef(false);
  const [status, setStatus] = useState(
    "Verifying your email and finishing signup...",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function finishSignup() {
      try {
        if (!API_URL) {
          throw new Error("Backend URL is not configured.");
        }

        // Prefer the ID carried in the redirect URL so a new tab can complete signup.
        // Fall back to localStorage for the same browser.
        const url = new URL(window.location.href);
        const pendingRegistrationID =
          url.searchParams.get("pendingRegistrationID") ||
          localStorage.getItem("pendingRegistrationID") ||
          sessionStorage.getItem("pendingRegistrationID");

        if (!pendingRegistrationID) {
          throw new Error(
            "Your pending signup could not be found. Please return to signup and try again.",
          );
        }

        // With PKCE, Supabase redirects with ?code=... and the code must be exchanged.
        const code = url.searchParams.get("code");
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        // For implicit/hash redirects, Supabase JS processes the URL session.
        // Give the client a chance to finish processing the redirect before reading it.
        let {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.access_token) {
          // One more read after Supabase has processed the callback URL.
          await new Promise((resolve) => window.setTimeout(resolve, 250));
          ({
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession());
          if (sessionError) throw sessionError;
        }

        if (!session?.access_token || !session.user?.email) {
          throw new Error(
            "Supabase did not return a session. Please open the confirmation link again.",
          );
        }

        // Verify the session token with Supabase.
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser(session.access_token);

        if (userError || !user) {
          throw new Error(
            userError?.message || "Unable to verify your Supabase account.",
          );
        }

        if (!user.email_confirmed_at) {
          throw new Error(
            "Your email has not been confirmed. Please use the confirmation link.",
          );
        }

        setStatus("Creating your InitWay account...");

        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ pendingRegistrationID }),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Unable to complete signup.");
        }

        const appToken = result.token || result.accessToken || result.jwt;
        if (!appToken) {
          throw new Error(
            "Registration succeeded, but the backend did not return the InitWay JWT.",
          );
        }

        // Store only your application's JWT for InitWay API requests.
        localStorage.setItem("token", appToken);
        localStorage.removeItem("pendingRegistrationID");
        sessionStorage.removeItem("pendingRegistrationID");
        sessionStorage.removeItem("signupEmail");

        // Remove the temporary Supabase session if your app uses its own JWT for auth.
        await supabase.auth.signOut();

        setStatus("Signup complete. Redirecting to your dashboard...");
        window.location.replace("/dashboard");
      } catch (err) {
        setError(
          err?.message || "Email verification failed. Please try again.",
        );
      }
    }

    finishSignup();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f5f6ff] via-white to-[#f0f3ff] px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-indigo-100/60 sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
          <Sparkles size={24} />
        </div>
        {error ? (
          <>
            <div className="mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle size={28} />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold text-[#111b49]">
              Could not finish signup
            </h1>
            <p
              role="alert"
              className="mt-3 break-words text-sm leading-6 text-slate-600"
            >
              {error}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/signup"
                className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
              >
                Try signup again
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Go to login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <LoaderCircle className="animate-spin" size={28} />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold text-[#111b49]">
              Verifying your email
            </h1>
            <p role="status" className="mt-3 text-sm leading-6 text-slate-600">
              {status}
            </p>
            <p className="mt-5 text-xs text-slate-400">
              Please keep this page open while we finish setting up your
              account.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
