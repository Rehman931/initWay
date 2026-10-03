import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowUpRight, FolderKanban, Plus } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl space-y-10 lg:space-y-12">
      <section className="workspace-enter flex flex-col justify-between gap-6 border-b border-[var(--workspace-line)] pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--workspace-muted)]">
            <Sparkles size={15} className="text-[var(--workspace-coral)]" />
            Founder workspace
          </p>
          <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-[var(--workspace-ink)] sm:text-4xl">
            Make your next move clear.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--workspace-muted)] sm:text-base">
            Start with a new idea or pick up where your work left off.
          </p>
        </div>
        <p className="text-xs font-medium text-[var(--workspace-muted)]">
          IDEA <span className="px-1.5 text-[var(--workspace-coral)]">/</span>
          EVIDENCE{" "}
          <span className="px-1.5 text-[var(--workspace-coral)]">/</span>
          DIRECTION
        </p>
      </section>

      <section
        aria-label="Project actions"
        className="workspace-enter-later grid gap-4 md:grid-cols-[1.35fr_1fr]"
      >
        <button
          onClick={() => navigate("/projects/new")}
          className="group relative flex min-h-64 flex-col items-start justify-between overflow-hidden rounded-lg bg-[var(--workspace-ink)] p-6 text-left text-white transition hover:bg-[#21352d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--workspace-coral)] sm:p-8"
        >
          <div className="flex w-full items-start justify-between gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--workspace-accent)] text-[var(--workspace-ink)]">
              <Plus size={21} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
              Start here / 01
            </span>
          </div>
          <div className="relative z-10 mt-10 max-w-lg">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Put a new idea to work.
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/65">
              Frame the problem, define who it is for, and turn the first draft
              into a plan.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--workspace-accent)]">
              Create a project
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-10 select-none text-[180px] font-semibold leading-none text-white/[0.035]"
          >
            01
          </span>
        </button>

        <button
          onClick={() => navigate("/projects")}
          className="group flex min-h-64 flex-col items-start justify-between rounded-lg border border-[var(--workspace-line)] bg-white p-6 text-left transition hover:border-[#b6c9b9] hover:bg-[#fbfdfb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--workspace-coral)] sm:p-8"
        >
          <div className="flex w-full items-start justify-between gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#edf3e7] text-[var(--workspace-ink)]">
              <FolderKanban size={20} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--workspace-muted)]">
              Your work / 02
            </span>
          </div>
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-[var(--workspace-ink)]">
              Return to a project.
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--workspace-muted)]">
              Review saved ideas, research, validations, and plans in one place.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--workspace-ink)]">
              Open projects
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </button>
      </section>

      <section className="workspace-enter-later pb-4" aria-label="Workflow">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-[var(--workspace-ink)]">
            From first thought to next step
          </h2>
          <p className="text-xs text-[var(--workspace-muted)]">
            A practical path for shaping a startup idea
          </p>
        </div>
        <div className="grid border-t border-[var(--workspace-line)] sm:grid-cols-3">
          <div className="border-b border-[var(--workspace-line)] py-5 sm:border-b-0 sm:pr-6">
            <p className="text-xs font-bold text-[var(--workspace-coral)]">
              01
            </p>
            <h3 className="mt-2 text-sm font-semibold text-[var(--workspace-ink)]">
              Validate the problem
            </h3>
            <p className="mt-1 text-sm leading-5 text-[var(--workspace-muted)]">
              Get specific about the customer and the need.
            </p>
          </div>
          <div className="border-b border-[var(--workspace-line)] py-5 sm:border-b-0 sm:border-l sm:px-6">
            <p className="text-xs font-bold text-[var(--workspace-coral)]">
              02
            </p>
            <h3 className="mt-2 text-sm font-semibold text-[var(--workspace-ink)]">
              Gather useful evidence
            </h3>
            <p className="mt-1 text-sm leading-5 text-[var(--workspace-muted)]">
              Explore the market and test your assumptions.
            </p>
          </div>
          <div className="py-5 sm:border-l sm:border-[var(--workspace-line)] sm:pl-6">
            <p className="text-xs font-bold text-[var(--workspace-coral)]">
              03
            </p>
            <h3 className="mt-2 text-sm font-semibold text-[var(--workspace-ink)]">
              Choose a direction
            </h3>
            <p className="mt-1 text-sm leading-5 text-[var(--workspace-muted)]">
              Turn the strongest signals into a clear plan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
