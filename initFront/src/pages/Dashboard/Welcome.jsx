import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  FolderKanban,
  Plus,
  Lightbulb,
  BrainCircuit,
  Rocket,
} from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      {/* ================= WELCOME ================= */}
      <section className="mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 mb-3">
            <Sparkles size={16} />
            Welcome to InitWay
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Turn your idea into a real startup.
          </h1>

          <p className="mt-3 text-gray-500 text-base max-w-2xl leading-relaxed">
            Validate ideas, research markets, and build practical startup plans
            with AI-powered insights.
          </p>
        </div>
      </section>

      {/* ================= MAIN ACTIONS ================= */}
      <section className="grid md:grid-cols-2 gap-5 mb-8">
        {/* ================= CREATE PROJECT ================= */}
        <button
          onClick={() => navigate("/projects/new")}
          className="
            group text-left
            bg-gradient-to-br from-violet-600 to-indigo-600
            text-white rounded-2xl p-6 sm:p-7
            relative overflow-hidden
            hover:shadow-xl hover:shadow-violet-200
            transition-all duration-200
          "
        >
          {/* Decoration */}
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
              <Plus size={25} />
            </div>

            <h2 className="text-xl font-bold">Start a New Startup Idea</h2>

            <p className="mt-2 text-sm text-white/75 leading-relaxed max-w-sm">
              Describe your idea and let InitWay help you validate, research,
              and plan it.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold">
              Get started
              <ArrowRight
                size={17}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </button>

        {/* ================= VIEW PROJECTS ================= */}
        <button
          onClick={() => navigate("/projects")}
          className="
            group text-left
            bg-white border border-gray-200
            rounded-2xl p-6 sm:p-7
            hover:border-violet-200
            hover:shadow-lg hover:shadow-gray-100
            transition-all duration-200
          "
        >
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-5">
            <FolderKanban size={25} />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            View Your Projects
          </h2>

          <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-sm">
            Access your startup ideas, generated research, validations,
            roadmaps, and other insights.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-violet-600">
            View projects
            <ArrowRight
              size={17}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </button>
      </section>

      {/* ================= WHAT INITWAY CAN DO ================= */}
      <section className="mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Rocket size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                What you can do with InitWay
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                From startup idea to actionable direction.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6">
            <Feature
              icon={Lightbulb}
              title="Validate Your Idea"
              description="Understand your problem, target customers, competition, and market opportunity."
            />

            <Feature
              icon={BrainCircuit}
              title="Generate AI Insights"
              description="Use AI-powered research to explore and understand your startup idea."
            />

            <Feature
              icon={Rocket}
              title="Plan Your Startup"
              description="Generate pitches, technology recommendations, roadmaps, and startup insights."
            />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900">How InitWay works</h2>

            <p className="text-xs text-gray-500 mt-1">
              A simple workflow to move from an idea to a clearer direction.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <Step
              number="01"
              title="Describe your idea"
              description="Tell InitWay what you're building, the problem you're solving, and who it's for."
            />

            <Step
              number="02"
              title="Get AI-powered insights"
              description="InitWay researches and analyzes your startup idea using AI-powered workflows."
            />

            <Step
              number="03"
              title="Plan your next steps"
              description="Use the generated insights to shape your pitch, technology, roadmap, and strategy."
            />
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section>
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Have a startup idea?
            </h2>

            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              Start with your idea and let InitWay help you explore what comes
              next.
            </p>
          </div>

          <button
            onClick={() => navigate("/projects/new")}
            className="
              shrink-0
              inline-flex items-center gap-2
              bg-gray-900 hover:bg-gray-800
              text-white
              px-5 py-2.5
              rounded-xl
              text-sm font-semibold
              transition
            "
          >
            <Plus size={17} />
            Create Project
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

/* ================= FEATURE ================= */

const Feature = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
        <Icon size={19} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>

        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

/* ================= STEP ================= */

const Step = ({ number, title, description }) => {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-violet-600">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>

        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Welcome;
