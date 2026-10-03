import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FolderKanban,
  RefreshCw,
} from "lucide-react";

const REPORT_HISTORY_STORAGE_KEY = "initway_report_history";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const ReportHistory = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState(() => {
    try {
      const storedReports = localStorage.getItem(REPORT_HISTORY_STORAGE_KEY);

      if (!storedReports) {
        return [];
      }

      const parsedReports = JSON.parse(storedReports);

      return Array.isArray(parsedReports) ? parsedReports : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH REPORT HISTORY
  // =====================================================

  const fetchReportHistory = async (showFullLoader = false) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await fetch(`${API_URL}/api/report/history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch report history.");
      }

      const fetchedReports = Array.isArray(data.reports) ? data.reports : [];

      // =================================================
      // UPDATE REACT STATE
      // =================================================

      setReports(fetchedReports);

      // =================================================
      // SAVE FRESH DATA TO LOCALSTORAGE
      // =================================================

      localStorage.setItem(
        REPORT_HISTORY_STORAGE_KEY,
        JSON.stringify(fetchedReports),
      );
    } catch (error) {
      /*
       * IMPORTANT:
       * We DON'T clear reports here.
       *
       * If API fails, cached localStorage reports
       * remain visible.
       */

      setError(
        error.message ||
          "Unable to load report history. Showing saved reports.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchReportHistory(true);
  }, []);

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredReports = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return reports
      .filter((report) => {
        const matchesSearch =
          !searchText ||
          (report.projectName || "").toLowerCase().includes(searchText) ||
          (report.type || "").toLowerCase().includes(searchText);

        const matchesType =
          filterType === "all" || normalizeType(report.type) === filterType;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [reports, search, filterType]);

  // =====================================================
  // OPEN REPORT
  // =====================================================

  const handleOpenReport = (report) => {
    if (!report?.reportId) {
      return;
    }

    if (report.type === "validation") {
      navigate(`/reports/validation/${report.reportId}`);
      return;
    }

    if (report.type === "pitch") {
      navigate(`/reports/pitch/${report.reportId}`);
      return;
    }

    if (report.type === "roadmap") {
      navigate(`/reports/roadmap/${report.reportId}`);
      return;
    }

    if (report.type === "techstack") {
      navigate(`/reports/techstack/${report.reportId}`);
    }
  };

  // =====================================================
  // MANUAL REFRESH
  // =====================================================

  const handleRefresh = () => {
    fetchReportHistory(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report History</h1>

          <p className="mt-2 text-sm text-gray-500">
            View and continue working with your generated reports.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            border
            border-gray-200
            bg-white
            text-gray-700
            text-sm
            font-medium
            hover:bg-gray-50
            transition
            disabled:opacity-60
          "
        >
          <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-700">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />

          <div>
            <p className="font-semibold text-sm">Unable to refresh reports</p>

            <p className="mt-1 text-sm text-amber-600">{error}</p>
          </div>
        </div>
      )}

      {/* =================================================
          SEARCH / FILTER
      ================================================= */}

      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* SEARCH */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports or projects..."
              className="
                w-full
                pl-10
                pr-4
                py-2.5
                bg-gray-50
                border
                border-gray-200
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

          {/* FILTER */}

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="
              px-4
              py-2.5
              bg-gray-50
              border
              border-gray-200
              rounded-xl
              text-sm
              text-gray-600
              outline-none
              focus:border-violet-500
              focus:ring-4
              focus:ring-violet-100
            "
          >
            <option value="all">All Reports</option>
            <option value="validation">Validation</option>
            <option value="pitch">Pitch</option>
            <option value="roadmap">Roadmap</option>
            <option value="techstack">Tech Stack</option>
          </select>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      {loading ? (
        <LoadingReports />
      ) : filteredReports.length > 0 ? (
        <>
          {/* COUNT */}

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredReports.length}{" "}
              {filteredReports.length === 1 ? "report" : "reports"}
            </p>
          </div>

          {/* REPORT LIST */}

          <div className="space-y-4">
            {filteredReports.map((report) => (
              <ReportCard
                key={`${report.type}-${report.reportId}`}
                report={report}
                onOpen={handleOpenReport}
              />
            ))}
          </div>
        </>
      ) : (
        /* =================================================
           EMPTY STATE
        ================================================= */

        <div className="bg-white border border-gray-200 rounded-2xl">
          <div className="py-16 px-6 text-center">
            <div
              className="
                mx-auto
                w-16
                h-16
                rounded-2xl
                bg-violet-50
                text-violet-600
                flex
                items-center
                justify-center
              "
            >
              <FileText size={29} />
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              {search || filterType !== "all"
                ? "No reports found"
                : "No reports yet"}
            </h2>

            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              {search || filterType !== "all"
                ? "We couldn't find any reports matching your current filters."
                : "Your generated validation, pitch, roadmap and technology reports will appear here."}
            </p>

            {!search && filterType === "all" && (
              <button
                onClick={() => navigate("/projects")}
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  bg-violet-600
                  hover:bg-violet-700
                  text-white
                  px-5
                  py-3
                  rounded-xl
                  text-sm
                  font-semibold
                  transition
                "
              >
                <FolderKanban size={18} />
                View Projects
              </button>
            )}
          </div>
        </div>
      )}

      {/* =================================================
          INFO
      ================================================= */}

      {!loading && !search && filterType === "all" && reports.length > 0 && (
        <div className="mt-8 bg-violet-50 border border-violet-100 rounded-2xl p-5">
          <div className="flex gap-3">
            <div
              className="
                w-9
                h-9
                shrink-0
                rounded-lg
                bg-white
                text-violet-600
                flex
                items-center
                justify-center
              "
            >
              <FileText size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Your report history
              </h3>

              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Reports are automatically synchronized with your account and
                temporarily saved locally for a faster experience.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// REPORT CARD
// =====================================================

const ReportCard = ({ report, onOpen }) => {
  const type = normalizeType(report.type);

  const isCompleted = normalizeStatus(report.status) === "completed";

  const typeConfig = {
    validation: {
      label: "Validation Report",
      icon: <CheckCircle2 size={19} />,
    },

    pitch: {
      label: "Pitch Report",
      icon: <FileText size={19} />,
    },

    roadmap: {
      label: "Roadmap Report",
      icon: <ArrowRight size={19} />,
    },

    techstack: {
      label: "Tech Stack Report",
      icon: <FolderKanban size={19} />,
    },
  };

  const config = typeConfig[type] || {
    label: "Report",
    icon: <FileText size={19} />,
  };

  return (
    <div
      className="
        group
        bg-white
        border
        border-gray-200
        rounded-2xl
        p-5
        hover:border-violet-200
        hover:shadow-lg
        hover:shadow-gray-100
        transition
      "
    >
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        {/* ICON */}

        <div
          className="
            w-12
            h-12
            shrink-0
            rounded-xl
            bg-violet-50
            text-violet-600
            flex
            items-center
            justify-center
          "
        >
          {config.icon}
        </div>

        {/* CONTENT */}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-gray-900">{config.label}</h2>

            <span
              className={`
                inline-flex
                items-center
                gap-1.5
                px-2.5
                py-1
                rounded-full
                text-xs
                font-medium

                ${
                  isCompleted
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }
              `}
            >
              {isCompleted ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}

              {formatStatus(report.status)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <p className="text-sm text-gray-600">
              {report.projectName || "Untitled Project"}
            </p>

            <span className="text-xs text-gray-400">
              {formatDate(report.createdAt)}
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-400 font-mono truncate">
            Report ID: {report.reportId}
          </p>
        </div>

        {/* ACTION */}

        <button
          onClick={() => onOpen(report)}
          disabled={!isCompleted}
          className="
            shrink-0
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            text-sm
            font-semibold
            transition
            disabled:opacity-40
            disabled:cursor-not-allowed
            bg-violet-50
            text-violet-700
            hover:bg-violet-100
          "
        >
          Open Report
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

const LoadingReports = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            p-5
          "
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse" />

            <div className="flex-1">
              <div className="h-5 w-44 bg-gray-200 rounded animate-pulse" />

              <div className="mt-3 h-3 w-56 bg-gray-100 rounded animate-pulse" />

              <div className="mt-2 h-3 w-36 bg-gray-100 rounded animate-pulse" />
            </div>

            <div className="h-10 w-28 bg-gray-100 rounded-xl animate-pulse" />
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
  if (!status) {
    return "";
  }

  return status.toString().trim().toLowerCase().replace(/_/g, " ");
};

const normalizeType = (type) => {
  if (!type) {
    return "";
  }

  return type.toString().trim().toLowerCase().replace(/_/g, "");
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
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
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

export default ReportHistory;
