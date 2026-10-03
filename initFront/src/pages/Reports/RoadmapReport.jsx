import React, { useEffect, useMemo, useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Sparkles,
  Clock3,
  DollarSign,
  CheckCircle2,
  Target,
  Users,
  ShieldAlert,
  BarChart3,
  Wrench,
  Rocket,
  ListChecks,
  Layers3,
  ArrowRight,
  Loader2,
  RefreshCw,
  BrainCircuit,
  Server,
  Palette,
  MessageSquare,
  CreditCard,
  Settings2,
  TestTube2,
  Activity,
  Headphones,
} from "lucide-react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
/* =========================================================
   API CONFIG
========================================================= */

/* =========================================================
   HELPERS
========================================================= */

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt")
  );
};

const getShortCost = (cost = "") => {
  if (!cost) return "Not specified";

  return cost.split(" (")[0];
};

const getToolParts = (tool = "") => {
  const [label, ...rest] = tool.split(":");

  return {
    label: label?.trim() || "Technology",
    value: rest.join(":").trim() || tool,
  };
};

const getTechnologyIcon = (label = "") => {
  const name = label.toLowerCase();

  if (name.includes("frontend")) return Palette;
  if (name.includes("backend")) return Server;
  if (name.includes("ai")) return BrainCircuit;
  if (name.includes("messaging")) return MessageSquare;
  if (name.includes("auth") || name.includes("billing")) {
    return CreditCard;
  }
  if (name.includes("devops")) return Settings2;
  if (name.includes("testing")) return TestTube2;
  if (name.includes("monitoring")) return Activity;
  if (name.includes("customer")) return Headphones;

  return Wrench;
};

/* =========================================================
   PDF STYLES
========================================================= */

const pdfStyles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: "#F8FAFC",
    fontFamily: "Helvetica",
    color: "#111827",
  },

  cover: {
    minHeight: 700,
    justifyContent: "center",
    padding: 30,
  },

  eyebrow: {
    fontSize: 10,
    color: "#7C3AED",
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 12,
  },

  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
    lineHeight: 1.2,
  },

  subtitle: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 1.6,
    marginBottom: 28,
  },

  statRow: {
    flexDirection: "row",
    marginBottom: 25,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginRight: 8,
    border: "1 solid #E5E7EB",
  },

  statLabel: {
    fontSize: 8,
    color: "#64748B",
    marginBottom: 6,
  },

  statValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 14,
    marginTop: 8,
  },

  phase: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    border: "1 solid #E5E7EB",
  },

  phaseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  phaseTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
    width: "75%",
  },

  phaseDuration: {
    fontSize: 9,
    color: "#7C3AED",
    fontWeight: "bold",
  },

  objective: {
    fontSize: 9,
    color: "#64748B",
    lineHeight: 1.5,
    marginBottom: 10,
  },

  smallHeading: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 5,
    marginTop: 6,
  },

  bullet: {
    fontSize: 8,
    color: "#4B5563",
    lineHeight: 1.5,
    marginBottom: 3,
  },

  twoColumn: {
    flexDirection: "row",
  },

  column: {
    flex: 1,
    marginRight: 10,
  },

  finalBox: {
    backgroundColor: "#F5F3FF",
    borderRadius: 10,
    padding: 16,
    marginTop: 15,
    border: "1 solid #DDD6FE",
  },

  finalText: {
    fontSize: 9,
    color: "#4C1D95",
    lineHeight: 1.5,
  },

  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 36,
    fontSize: 8,
    color: "#94A3B8",
  },
});

/* =========================================================
   PDF
========================================================= */

const RoadmapPDF = ({ roadmap }) => {
  const phases = roadmap?.milestones || [];
  const team = roadmap?.recommendedTeam || [];
  const risks = roadmap?.risks || [];
  const metrics = roadmap?.successMetrics || [];
  const nextSteps = roadmap?.nextSteps || [];
  const tools = roadmap?.tools || [];

  return (
    <Document>
      {/* COVER */}
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.cover}>
          <Text style={pdfStyles.eyebrow}>INITWAY · ROADMAP BLUEPRINT</Text>

          <Text style={pdfStyles.title}>
            {roadmap?.title || "Product Roadmap"}
          </Text>

          <Text style={pdfStyles.subtitle}>
            {roadmap?.overview || "No overview available."}
          </Text>

          <View style={pdfStyles.statRow}>
            <View style={pdfStyles.statBox}>
              <Text style={pdfStyles.statLabel}>DURATION</Text>

              <Text style={pdfStyles.statValue}>
                {roadmap?.estimatedDuration || "N/A"}
              </Text>
            </View>

            <View style={pdfStyles.statBox}>
              <Text style={pdfStyles.statLabel}>ESTIMATED COST</Text>

              <Text style={pdfStyles.statValue}>
                {getShortCost(roadmap?.estimatedCost)}
              </Text>
            </View>

            <View style={pdfStyles.statBox}>
              <Text style={pdfStyles.statLabel}>PHASES</Text>

              <Text style={pdfStyles.statValue}>{phases.length}</Text>
            </View>
          </View>
        </View>

        <Text
          style={pdfStyles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
        />
      </Page>

      {/* PHASES */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>Execution Roadmap</Text>

        {phases.map((phase, index) => (
          <View style={pdfStyles.phase} key={index}>
            <View style={pdfStyles.phaseHeader}>
              <Text style={pdfStyles.phaseTitle}>
                {index + 1}. {phase.phase}
              </Text>

              <Text style={pdfStyles.phaseDuration}>{phase.duration}</Text>
            </View>

            <Text style={pdfStyles.objective}>{phase.objective}</Text>

            <View style={pdfStyles.twoColumn}>
              <View style={pdfStyles.column}>
                <Text style={pdfStyles.smallHeading}>TASKS</Text>

                {(phase.tasks || []).map((task, taskIndex) => (
                  <Text style={pdfStyles.bullet} key={taskIndex}>
                    • {task}
                  </Text>
                ))}
              </View>

              <View style={pdfStyles.column}>
                <Text style={pdfStyles.smallHeading}>DELIVERABLES</Text>

                {(phase.deliverables || []).map(
                  (deliverable, deliverableIndex) => (
                    <Text style={pdfStyles.bullet} key={deliverableIndex}>
                      • {deliverable}
                    </Text>
                  ),
                )}
              </View>
            </View>
          </View>
        ))}

        <Text
          style={pdfStyles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
        />
      </Page>

      {/* EXECUTION */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>Execution Plan</Text>

        <Text style={pdfStyles.smallHeading}>NEXT STEPS</Text>

        {nextSteps.map((step, index) => (
          <Text style={pdfStyles.bullet} key={index}>
            {index + 1}. {step}
          </Text>
        ))}

        <Text style={pdfStyles.sectionTitle}>Recommended Team</Text>

        {team.map((member, index) => (
          <View style={pdfStyles.phase} key={index}>
            <Text style={pdfStyles.phaseTitle}>{member.role}</Text>

            <Text style={pdfStyles.objective}>{member.responsibility}</Text>
          </View>
        ))}

        <Text
          style={pdfStyles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
        />
      </Page>

      {/* RISKS AND METRICS */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>Risks & Success Metrics</Text>

        <Text style={pdfStyles.smallHeading}>KEY RISKS</Text>

        {risks.map((risk, index) => (
          <Text style={pdfStyles.bullet} key={index}>
            • {risk}
          </Text>
        ))}

        <Text style={pdfStyles.sectionTitle}>Success Metrics</Text>

        {metrics.map((metric, index) => (
          <Text style={pdfStyles.bullet} key={index}>
            • {metric}
          </Text>
        ))}

        <View style={pdfStyles.finalBox}>
          <Text style={pdfStyles.finalText}>
            This roadmap provides the planned execution sequence, delivery
            milestones, team requirements, risks, and success criteria for the
            product.
          </Text>
        </View>

        <Text
          style={pdfStyles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
        />
      </Page>

      {/* TECHNOLOGY */}
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>Technology & Delivery Stack</Text>

        {tools.map((tool, index) => {
          const parts = getToolParts(tool);

          return (
            <View style={pdfStyles.phase} key={index}>
              <Text style={pdfStyles.phaseTitle}>{parts.label}</Text>

              <Text style={pdfStyles.objective}>{parts.value}</Text>
            </View>
          );
        })}

        <Text
          style={pdfStyles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
        />
      </Page>
    </Document>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const RoadmapReport = () => {
  const navigate = useNavigate();
  const { roadmapId } = useParams();
  const projectId = roadmapId;
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH ROADMAP FROM API
  ========================================================= */

  const fetchRoadmap = async () => {
    if (!projectId) {
      setError("Project ID is missing from the URL.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/roadmap/${projectId}`, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Failed to fetch roadmap.",
        );
      }

      /*
        Expected backend response:

        {
          roadmapReport: {
            title: "...",
            overview: "...",
            milestones: [...]
          }
        }
      */

      const roadmapData =
        data?.roadmapReport ||
        data?.data?.roadmapReport ||
        data?.report?.roadmapReport ||
        data?.data ||
        data?.report ||
        data;

      if (!roadmapData || typeof roadmapData !== "object") {
        throw new Error("Invalid roadmap response from server.");
      }

      setRoadmap(roadmapData);
    } catch (err) {
      setError(err?.message || "Unable to load roadmap.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [projectId]);

  /* =========================================================
     DATA
  ========================================================= */

  const phases = roadmap?.milestones || [];
  const nextSteps = roadmap?.nextSteps || [];
  const team = roadmap?.recommendedTeam || [];
  const risks = roadmap?.risks || [];
  const metrics = roadmap?.successMetrics || [];
  const tools = roadmap?.tools || [];

  const totalTasks = useMemo(() => {
    return phases.reduce(
      (total, phase) => total + (phase.tasks?.length || 0),
      0,
    );
  }, [phases]);

  const totalDeliverables = useMemo(() => {
    return phases.reduce(
      (total, phase) => total + (phase.deliverables?.length || 0),
      0,
    );
  }, [phases]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
            <Loader2 className="h-7 w-7 animate-spin text-violet-600" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            Loading roadmap
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Fetching your roadmap from InitWay...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !roadmap) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <ShieldAlert className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            Unable to load roadmap
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error || "No roadmap data was returned by the API."}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>

            <button
              onClick={fetchRoadmap}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-violet-600">
                <Sparkles className="h-3.5 w-3.5" />
                InitWay
              </div>

              <p className="mt-1 text-sm text-gray-500">Roadmap Blueprint</p>
            </div>
          </div>

          <PDFDownloadLink
            document={<RoadmapPDF roadmap={roadmap} />}
            fileName="initway-roadmap.pdf"
          >
            {({ loading: pdfLoading }) => (
              <button
                disabled={pdfLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-4 w-4" />

                {pdfLoading ? "Preparing PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.45fr_0.75fr]">
            <div className="relative overflow-hidden p-7 sm:p-10">
              <div className="relative">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Product Roadmap
                </div>

                <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  {roadmap.title}
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
                  {roadmap.overview}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-600">
                    <Layers3 className="h-4 w-4 text-violet-600" />
                    {phases.length} phases
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-600">
                    <ListChecks className="h-4 w-4 text-violet-600" />
                    {totalTasks} tasks
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-violet-600" />
                    {totalDeliverables} deliverables
                  </div>
                </div>
              </div>
            </div>

            {/* SNAPSHOT */}

            <div className="bg-[var(--workspace-ink)] p-7 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-100">
                Roadmap Snapshot
              </p>

              <div className="mt-7 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/15 p-2.5">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-violet-100">
                      Estimated Duration
                    </p>

                    <p className="mt-1 font-semibold">
                      {roadmap.estimatedDuration || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/15 p-2.5">
                    <DollarSign className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-violet-100">Estimated Cost</p>

                    <p className="mt-1 font-semibold">
                      {getShortCost(roadmap.estimatedCost)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/15 p-2.5">
                    <Layers3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-violet-100">Execution Phases</p>

                    <p className="mt-1 font-semibold">{phases.length} phases</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/15 p-2.5">
                    <Users className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-violet-100">Recommended Team</p>

                    <p className="mt-1 font-semibold">{team.length} roles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            EXECUTION MAP
        ===================================================== */}

        <section className="mb-10">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
              Execution Map
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              From idea to launch
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A high-level view of how the product moves through each stage.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-8 hidden h-[calc(100%-60px)] w-px bg-violet-200 lg:block" />

            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div
                  key={index}
                  className="relative grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md lg:grid-cols-[70px_180px_1fr_auto]"
                >
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-sm font-bold text-violet-700">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Duration
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-800">
                      {phase.duration}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {phase.phase}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-gray-500">
                      {phase.objective}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:justify-center">
                    <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                      {phase.tasks?.length || 0} tasks
                    </span>

                    <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {phase.deliverables?.length || 0} outputs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            PHASE BREAKDOWN
        ===================================================== */}

        <section className="mb-10">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
              Detailed Plan
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Phase Breakdown
            </h2>
          </div>

          <div className="space-y-6">
            {phases.map((phase, index) => (
              <article
                key={index}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="grid lg:grid-cols-[220px_1fr]">
                  <div className="border-b border-gray-200 bg-gray-50 p-6 lg:border-b-0 lg:border-r">
                    <div className="flex items-center justify-between lg:block">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-lg font-bold text-white">
                        {index + 1}
                      </div>

                      <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 lg:mt-5 lg:inline-block">
                        {phase.duration}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-gray-900">
                      {phase.phase}
                    </h3>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="rounded-2xl bg-violet-50/70 p-5">
                      <div className="flex items-start gap-3">
                        <Target className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                            Objective
                          </p>

                          <p className="mt-1 text-sm leading-6 text-gray-700">
                            {phase.objective}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-7 md:grid-cols-2">
                      {/* TASKS */}

                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          <div className="rounded-lg bg-gray-100 p-2">
                            <ListChecks className="h-4 w-4 text-gray-700" />
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Tasks
                            </h4>

                            <p className="text-xs text-gray-400">
                              {phase.tasks?.length || 0} actions
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          {(phase.tasks || []).map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3"
                            >
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-violet-600 shadow-sm">
                                {taskIndex + 1}
                              </span>

                              <p className="text-sm leading-5 text-gray-600">
                                {task}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* DELIVERABLES */}

                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          <div className="rounded-lg bg-violet-100 p-2">
                            <CheckCircle2 className="h-4 w-4 text-violet-700" />
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Deliverables
                            </h4>

                            <p className="text-xs text-gray-400">
                              {phase.deliverables?.length || 0} outputs
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          {(phase.deliverables || []).map(
                            (deliverable, deliverableIndex) => (
                              <div
                                key={deliverableIndex}
                                className="flex gap-3 rounded-xl border border-violet-100 bg-violet-50/50 p-3"
                              >
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />

                                <p className="text-sm leading-5 text-gray-600">
                                  {deliverable}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================================
            NEXT STEPS
        ===================================================== */}

        <section className="mb-10">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
              Start Here
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Launch Checklist
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              The immediate actions required to begin execution.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {nextSteps.map((step, index) => (
              <div
                key={index}
                className="group flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="text-sm leading-6 text-gray-700">{step}</p>
                </div>

                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-violet-500" />
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            TEAM
        ===================================================== */}

        <section className="mb-10">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
              People
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Team Architecture
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recommended responsibilities required to execute the roadmap.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {team.map((member, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Users className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  {member.role}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {member.responsibility}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            RISKS / METRICS
        ===================================================== */}

        <section className="mb-10 grid gap-6 lg:grid-cols-2">
          {/* RISKS */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-500">
                  Risk Radar
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  What to watch
                </h2>
              </div>

              <div className="rounded-xl bg-red-50 p-2.5">
                <ShieldAlert className="h-5 w-5 text-red-500" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {risks.map((risk, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-400" />

                  <p className="text-sm leading-6 text-gray-600">{risk}</p>
                </div>
              ))}
            </div>
          </div>

          {/* METRICS */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Success Dashboard
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  What success looks like
                </h2>
              </div>

              <div className="rounded-xl bg-emerald-50 p-2.5">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                  <p className="text-sm leading-6 text-gray-600">{metric}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            TECHNOLOGY
        ===================================================== */}

        <section className="mb-10">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
              Build Stack
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Technology Map
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tools and technologies recommended for each part of the product.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {tools.map((tool, index) => {
              const parts = getToolParts(tool);
              const Icon = getTechnologyIcon(parts.label);

              return (
                <div
                  key={index}
                  className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${
                    index !== tools.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                      <Icon className="h-5 w-5 text-violet-600" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                        {parts.label}
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {parts.value}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="hidden h-4 w-4 text-gray-300 sm:block" />
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="mb-8 overflow-hidden rounded-lg bg-[var(--workspace-ink)] p-7 text-white shadow-lg sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-100">
                <Rocket className="h-4 w-4" />
                Roadmap at a glance
              </div>

              <h2 className="text-2xl font-bold">
                Ready to turn the roadmap into execution?
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-violet-100">
                {roadmap.overview}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-violet-100">Duration</p>

                <p className="mt-1 text-sm font-bold">
                  {roadmap.estimatedDuration}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-violet-100">Cost</p>

                <p className="mt-1 text-sm font-bold">
                  {getShortCost(roadmap.estimatedCost)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-violet-100">Phases</p>

                <p className="mt-1 text-sm font-bold">{phases.length}</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-violet-100">Team</p>

                <p className="mt-1 text-sm font-bold">{team.length} roles</p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            DOWNLOAD
        ===================================================== */}

        <div className="flex justify-center pb-8">
          <PDFDownloadLink
            document={<RoadmapPDF roadmap={roadmap} />}
            fileName="initway-roadmap.pdf"
          >
            {({ loading: pdfLoading }) => (
              <button
                disabled={pdfLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-4 w-4" />

                {pdfLoading ? "Generating PDF..." : "Download Full Roadmap"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default RoadmapReport;
