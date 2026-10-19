import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function OtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email =
    searchParams.get("email") || sessionStorage.getItem("signupEmail") || "";

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

        <div className="mt-7 text-center">
          <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 text-violet-600 ring-1 ring-violet-100">
            <Mail size={36} strokeWidth={1.7} />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#111b49] sm:text-4xl">
            Check your email
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
            We sent you a confirmation link. Open the email and click the link
            to verify your email address and finish creating your InitWay
            account.
          </p>
          {email && (
            <p className="mt-3 break-all text-sm font-bold text-violet-700">
              {email}
            </p>
          )}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/70 p-4 text-left">
          <CheckCircle2 className="mt-0.5 shrink-0 text-violet-600" size={20} />
          <div>
            <p className="font-semibold text-[#111b49]">What happens next?</p>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              The link will bring you back to InitWay. We will verify the
              Supabase session, complete your registration securely, and take
              you to your dashboard.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ShieldCheck size={18} />
          Go to login
        </button>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          If you don't see the email, check your spam folder. The confirmation
          link may expire.
        </p>
      </section>

      <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-slate-400">
        InitWay <span className="mx-1.5">·</span> Build Your Future
      </p>
    </main>
  );
}
