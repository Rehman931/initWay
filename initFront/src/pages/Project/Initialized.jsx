import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Presentation,
  Map,
  Layers3,
  FolderOpen,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Loader2,
} from "lucide-react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const Initialized = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingReport, setCreatingReport] = useState(false);

  useEffect(() => {
    const getProjectStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(`${API_URL}/api/verify/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Unable to load project.");
          navigate("/projects", { replace: true });
          return;
        }

        setProjectData(data);
      } catch {
        alert("Unable to load project.");

        navigate("/projects", {
          replace: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      getProjectStatus();
    }
  }, [projectId, navigate]);

  /*
   * This function is used by all 4 workflows.
   */
  const generateReport = async (reportType) => {
    try {
      setCreatingReport(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      let endpoint = "";

      if (reportType === "validation") {
        endpoint = `${API_URL}/api/validation/${projectId}`;
      }

      if (reportType === "pitch") {
        endpoint = `${API_URL}/api/pitch/${projectId}`;
      }

      if (reportType === "roadmap") {
        endpoint = `${API_URL}/api/roadmap/${projectId}`;
      }

      if (reportType === "techstack") {
        endpoint = `${API_URL}/api/techstack/${projectId}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to generate report.");
        return;
      }

      /*
       * Backend must return reportId immediately.
       */
      if (!data.reportId) {
        alert("Report ID was not returned by the server.");
        return;
      }

      /*
       * Now go to the generating page.
       */
      navigate(`/reports/generating/${reportType}/${data.reportId}`, {
        replace: true,
      });
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setCreatingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 size={30} className="mx-auto text-violet-600 animate-spin" />

          <p className="mt-4 text-sm text-gray-500">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return null;
  }

  const workflows = [
    {
      number: "01",
      title: "Validate your idea",
      shortTitle: "Validation",
      description:
        "Understand your market, competitors, customers and whether your idea has real potential.",
      icon: ShieldCheck,
      type: "validation",
    },
    {
      number: "02",
      title: "Build your pitch",
      shortTitle: "Pitch",
      description:
        "Create a clear and convincing pitch that explains your problem, solution, market and value.",
      icon: Presentation,
      type: "pitch",
    },
    {
      number: "03",
      title: "Plan your roadmap",
      shortTitle: "Roadmap",
      description:
        "Break your startup journey into practical phases, milestones and actionable next steps.",
      icon: Map,
      type: "roadmap",
    },
    {
      number: "04",
      title: "Choose your tech stack",
      shortTitle: "Tech Stack",
      description:
        "Explore technologies, architecture and tools that fit your product and development needs.",
      icon: Layers3,
      type: "techstack",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Back */}
      <button
        onClick={() => navigate("/projects")}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition mb-6"
      >
        <ArrowLeft size={16} />
        Projects
      </button>

      {/* Project Header */}
      <section className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-8">
        <div className="px-6 sm:px-8 py-7 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Sparkles size={25} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
                    Project
                  </span>

                  <span className="w-1 h-1 rounded-full bg-gray-300" />

                  <span className="text-xs text-gray-400 truncate">
                    {projectData.projectId}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                  {projectData.projectName}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-green-50 border border-green-100">
              <CheckCircle2 size={16} className="text-green-600" />

              <span className="text-sm font-semibold text-green-700 capitalize">
                {projectData.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3">
          <Meta label="Project ID" value={projectData.projectId} />

          <Meta label="Status" value="Ready to explore" />

          <Meta label="Next step" value="Choose a workflow" />
        </div>
      </section>

      {/* Introduction */}
      <section className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 mb-2">
          Your startup workspace
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Where would you like to start?
        </h2>

        <p className="mt-2 text-gray-500 max-w-2xl leading-relaxed">
          Choose a workflow below. InitWay will generate the insights and
          resources you need for your startup.
        </p>
      </section>

      {/* Workflows */}
      <section className="grid md:grid-cols-2 gap-5">
        {workflows.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.type}
              disabled={creatingReport}
              onClick={() => generateReport(item.type)}
              className="group relative text-left bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                      <Icon size={22} />
                    </div>

                    <span className="text-xs font-bold text-gray-300 tracking-widest">
                      {item.number}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-violet-600 group-hover:border-violet-600 group-hover:text-white">
                    <ArrowUpRight size={17} />
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                    {item.shortTitle}
                  </p>

                  <h3 className="mt-1.5 text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm text-gray-500 leading-6">
                    {item.description}
                  </p>
                </div>

                <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-violet-600">
                  Start exploring
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {/* Reports */}
      <section className="mt-8">
        <button
          onClick={() => navigate("/reports/history")}
          className="group w-full bg-gray-50 border border-gray-200 rounded-3xl p-5 sm:p-6 text-left hover:bg-white hover:border-violet-200 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-gray-600 flex items-center justify-center">
              <FolderOpen size={21} />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Project Reports</h3>

              <p className="mt-1 text-sm text-gray-500">
                View your previously generated validation, pitch, roadmap and
                technology reports.
              </p>
            </div>

            <ArrowUpRight size={19} />
          </div>
        </button>
      </section>
    </div>
  );
};

const Meta = ({ label, value }) => {
  return (
    <div className="px-6 sm:px-7 py-5 border-b sm:border-b-0 sm:border-r last:border-r-0 border-gray-100">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-gray-800 truncate">
        {value}
      </p>
    </div>
  );
};

export default Initialized;
