import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  FolderKanban,
  ArrowRight,
  MoreHorizontal,
  Clock3,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const PROJECTS_STORAGE_KEY = "initway_projects";

const Projects = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [projects, setProjects] = useState(() => {
    try {
      const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);

      if (!storedProjects) {
        return [];
      }

      const parsedProjects = JSON.parse(storedProjects);

      if (!Array.isArray(parsedProjects)) {
        return [];
      }

      // Do not show failed projects from localStorage
      return parsedProjects.filter(
        (project) => normalizeStatus(project?.status) !== "failed",
      );
    } catch (error) {
      console.error("Unable to read projects from localStorage:", error);

      return [];
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/projects`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch your projects.");
        }

        if (!isMounted) return;

        const fetchedProjects = Array.isArray(data.projects)
          ? data.projects.filter(
              (project) => normalizeStatus(project?.status) !== "failed",
            )
          : [];

        setProjects(fetchedProjects);

        // Store only non-failed projects
        localStorage.setItem(
          PROJECTS_STORAGE_KEY,
          JSON.stringify(fetchedProjects),
        );
      } catch (error) {
        console.error("Fetch projects error:", error);

        if (!isMounted) return;

        setError(error.message || "Unable to load projects. Please try again.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // =====================================================
  // SEARCH + SORT
  // =====================================================

  const filteredProjects = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    // Extra protection:
    // Even if a failed project somehow enters state,
    // it will not be displayed.
    const result = projects.filter((project) => {
      const status = normalizeStatus(project?.status);

      if (status === "failed") {
        return false;
      }

      const projectName = project?.projectName || "";

      return projectName.toLowerCase().includes(searchText);
    });

    // Sort by updatedAt / createdAt
    result.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();

      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [projects, search, sortOrder]);

  // =====================================================
  // OPEN PROJECT
  // =====================================================

  const handleOpenProject = (project) => {
    if (!project?.projectId) {
      return;
    }

    // Never open a failed project
    if (normalizeStatus(project.status) === "failed") {
      return;
    }

    navigate(`/projects/initialized/${project.projectId}`);
  };

  // =====================================================
  // CREATE PROJECT
  // =====================================================

  const handleNewProject = () => {
    navigate("/projects/new");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>

          <p className="mt-2 text-sm text-gray-500">
            Create, manage and continue working on your startup ideas.
          </p>
        </div>

        <button
          onClick={handleNewProject}
          className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition shadow-sm shadow-violet-200"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />

          <div>
            <p className="font-semibold text-sm">Unable to load projects</p>

            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* ================= SEARCH / SORT ================= */}

      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="
                w-full
                pl-10 pr-4 py-2.5
                bg-gray-50
                border border-gray-200
                rounded-xl
                text-sm
                outline-none
                focus:bg-white
                focus:border-violet-500
                focus:ring-4
                focus:ring-violet-100
                transition
              "
            />
          </div>

          {/* Sort */}

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="
              px-4 py-2.5
              bg-gray-50
              border border-gray-200
              rounded-xl
              text-sm
              text-gray-600
              outline-none
              focus:border-violet-500
              focus:ring-4
              focus:ring-violet-100
            "
          >
            <option value="newest">Newest first</option>

            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      {loading ? (
        <LoadingProjects />
      ) : filteredProjects.length > 0 ? (
        <>
          {/* Project count */}

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </p>
          </div>

          {/* Projects */}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.projectId}
                project={project}
                onOpen={handleOpenProject}
              />
            ))}
          </div>
        </>
      ) : (
        /* ================= EMPTY STATE ================= */

        <div className="bg-white border border-gray-200 rounded-2xl">
          <div className="py-16 px-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <FolderKanban size={29} />
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              {search ? "No projects found" : "No projects yet"}
            </h2>

            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              {search
                ? `We couldn't find any project matching "${search}".`
                : "You haven't created a startup project yet. Create your first project to get started with InitWay."}
            </p>

            {!search && (
              <button
                onClick={handleNewProject}
                className="mt-7 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
              >
                <Plus size={18} />
                Create New Project
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= INFO ================= */}

      {!loading && !search && filteredProjects.length > 0 && (
        <div className="mt-8 bg-violet-50 border border-violet-100 rounded-2xl p-5">
          <div className="flex gap-3">
            <div className="w-9 h-9 shrink-0 rounded-lg bg-white text-violet-600 flex items-center justify-center">
              <FileText size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Keep your startup work organized
              </h3>

              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Each project contains your idea, validation, pitch, roadmap and
                technology recommendations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// PROJECT CARD
// =====================================================

const ProjectCard = ({ project, onOpen }) => {
  const status = normalizeStatus(project?.status);

  // Extra protection
  if (status === "failed") {
    return null;
  }

  const isCompleted = status === "completed";

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-violet-200 hover:shadow-lg hover:shadow-gray-100 transition">
      {/* Top */}

      <div className="flex items-start justify-between gap-3">
        <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
          <FolderKanban size={21} />
        </div>

        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
          <MoreHorizontal size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Content */}

      <div className="mt-5">
        <h2 className="font-semibold text-gray-900 text-lg">
          {project.projectName || "Untitled Project"}
        </h2>

        <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
          Startup project created in InitWay.
        </p>
      </div>

      {/* Status */}

      <div className="mt-5 flex items-center justify-between gap-3">
        <span
          className={`
            inline-flex items-center gap-1.5
            px-2.5 py-1
            rounded-full
            text-xs font-medium
            ${
              isCompleted
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }
          `}
        >
          {isCompleted ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}

          {formatStatus(project.status)}
        </span>

        <span className="text-xs text-gray-400">
          {formatDate(project.updatedAt || project.createdAt)}
        </span>
      </div>

      {/* Bottom */}

      <div className="mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={() => onOpen(project)}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700"
        >
          Open Project
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

// =====================================================
// LOADING SKELETON
// =====================================================

const LoadingProjects = () => {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-white border border-gray-200 rounded-2xl p-5"
        >
          <div className="flex justify-between">
            <div className="w-11 h-11 rounded-xl bg-gray-200 animate-pulse" />

            <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
          </div>

          <div className="mt-5">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />

            <div className="mt-3 h-3 w-full bg-gray-100 rounded animate-pulse" />

            <div className="mt-2 h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
          </div>

          <div className="mt-6 flex justify-between">
            <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />

            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="h-4 w-28 mx-auto bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

// =====================================================
// HELPERS
// =====================================================

const normalizeStatus = (status) => {
  if (!status) return "";

  return status.toString().trim().toLowerCase().replace(/_/g, " ");
};

const formatStatus = (status) => {
  if (!status) {
    return "In Progress";
  }

  return normalizeStatus(status)
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (date) => {
  if (!date) {
    return "Recently";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }

  const now = new Date();

  const diffMs = now - parsedDate;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  }

  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default Projects;
