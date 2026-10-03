import React, { useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  Check,
  Zap,
  Target,
  Rocket,
  Brain,
  Search,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const MainPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
          navigate("/", { replace: true });

          return;
        }

        const response = await fetch(`${API_URL}/api/verify/dashboard`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          alert("unable to load app try again");
          navigate("/", { replace: true });
          return;
        }
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Dashboard verification failed:", error);
      }
    };

    getUserData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200 cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              <Sparkles size={19} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Init<span className="text-violet-600">Way</span>
            </span>
          </button>

          {/* Navigation */}
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-violet-600">
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-violet-600"
            >
              How it works
            </a>

            <a href="#why-initway" className="transition hover:text-violet-600">
              Why InitWay
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden text-sm font-semibold text-slate-700 transition hover:text-violet-600 sm:block"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-violet-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <Sparkles size={15} />
              Turn ideas into startup direction
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Your startup idea.
              <br />
              <span className="text-[var(--workspace-coral)]">
                Validated. Planned. Ready.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              InitWay helps you transform a startup idea into meaningful
              research, validation, a pitch, roadmap, and technology direction —
              powered by AI.
            </p>

            {/* Hero buttons */}
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-xl shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                Validate Your Idea
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <a
                href="#features"
                className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                Explore InitWay
              </a>
            </div>

            {/* Trust */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
              <Check size={16} className="text-violet-600" />
              Built for founders, students & aspiring entrepreneurs
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mx-auto mt-20 max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <div className="h-3 w-3 rounded-full bg-slate-300" />

                <div className="ml-5 flex-1 rounded-lg bg-white px-4 py-2 text-xs text-slate-400">
                  app.initway.ai/dashboard
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="grid min-h-107.5 grid-cols-12">
                {/* Sidebar */}
                <div className="hidden border-r border-slate-200 bg-slate-50 p-5 md:col-span-3 md:block">
                  <div className="mb-8 flex items-center gap-2 font-bold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
                      <Sparkles size={15} />
                    </div>
                    InitWay
                  </div>

                  <div className="space-y-2">
                    {["Dashboard", "Projects", "History", "Profile"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className={`rounded-lg px-3 py-2.5 text-sm ${
                            index === 0
                              ? "bg-violet-100 font-semibold text-violet-700"
                              : "text-slate-500"
                          }`}
                        >
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Main */}
                <div className="col-span-12 p-6 md:col-span-9 md:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Welcome back</p>
                      <h3 className="mt-1 text-2xl font-bold">
                        Your startup workspace
                      </h3>
                    </div>

                    <button
                      onClick={() => navigate("/signup")}
                      className="hidden rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white sm:block"
                    >
                      + New Project
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                      ["Projects", "12"],
                      ["Validated", "8"],
                      ["Pitches", "6"],
                      ["Roadmaps", "5"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <p className="text-xs text-slate-500">{label}</p>
                        <p className="mt-2 text-2xl font-bold">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Project */}
                  <div className="mt-6 rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-violet-600">
                          RECENT PROJECT
                        </p>

                        <h4 className="mt-1 text-lg font-bold">HealthRaksha</h4>

                        <p className="mt-1 text-sm text-slate-500">
                          AI-powered health education & emergency response
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Validated
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      {["Validation", "Pitch", "Tech Stack"].map((item) => (
                        <div
                          key={item}
                          className="rounded-lg bg-slate-50 px-3 py-3 text-center text-xs font-medium text-slate-600"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-violet-600">
              Everything in one place
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              From idea to execution
            </h2>

            <p className="mt-4 text-slate-600">
              Instead of jumping between dozens of tools, use one workspace to
              understand and shape your startup idea.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Idea Validation",
                text: "Explore your problem, customers, market, competition and evidence before investing heavily.",
              },
              {
                icon: Target,
                title: "Startup Research",
                text: "Turn your idea into structured research that helps you understand the opportunity.",
              },
              {
                icon: Rocket,
                title: "Pitch Generation",
                text: "Transform your startup concept into a clear and compelling pitch.",
              },
              {
                icon: Zap,
                title: "Execution Roadmap",
                text: "Break your idea into practical stages and understand what to work on next.",
              },
              {
                icon: Brain,
                title: "AI Technology Stack",
                text: "Get a technology direction tailored to your startup's requirements.",
              },
              {
                icon: Lightbulb,
                title: "One Workspace",
                text: "Keep your startup research, decisions and generated documents organized together.",
              },
            ].map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.text}
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-violet-600">
                    Learn more
                    <ChevronRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-violet-600">
              Simple process
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Start with an idea. Build with clarity.
            </h2>
          </div>

          <div className="relative mt-16 grid gap-10 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Describe your idea",
                text: "Tell InitWay what you want to build, who it is for, and the problem you want to solve.",
              },
              {
                number: "02",
                title: "Let AI analyze it",
                text: "InitWay organizes research and generates insights around your startup concept.",
              },
              {
                number: "03",
                title: "Move forward",
                text: "Use your validation, pitch, roadmap and tech direction to decide your next steps.",
              },
            ].map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-lg font-bold text-white shadow-lg shadow-violet-200">
                  {step.number}
                </div>

                <h3 className="mt-6 text-xl font-bold">{step.title}</h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why InitWay */}
      <section id="why-initway" className="bg-slate-950 py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-300">
              <Sparkles size={15} />
              Built for early-stage ideas
            </div>

            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Don't just have an idea.
              <br />
              <span className="text-violet-400">Understand it.</span>
            </h2>

            <p className="mt-6 max-w-xl leading-7 text-slate-400">
              Building a startup starts with uncertainty. InitWay gives you a
              structured workspace to explore that uncertainty and turn your
              idea into something you can actually work with.
            </p>

            <button
              onClick={() => navigate("/signup")}
              className="mt-8 flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-violet-50"
            >
              Start with your idea
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Research your opportunity",
              "Understand your customers",
              "Structure your startup",
              "Create your pitch",
              "Plan your roadmap",
              "Choose your tech direction",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                  <Check size={15} />
                </div>

                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 -z-10 bg-violet-50" />

        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-xl shadow-violet-200">
            <Sparkles size={23} />
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Your next startup could start here.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-slate-600">
            Bring your idea. InitWay helps you turn it into a structured
            starting point.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-xl shadow-violet-200 transition hover:bg-violet-700"
          >
            Get Started with InitWay
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Sparkles size={15} />
            </div>

            <span className="font-bold">
              Init<span className="text-violet-600">Way</span>
            </span>
          </button>

          <p className="text-sm text-slate-500">
            Build your idea with more clarity.
          </p>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} InitWay
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
