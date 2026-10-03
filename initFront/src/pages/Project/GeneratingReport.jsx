import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Loader2,
  Sparkles,
  Search,
  Brain,
  FileText,
  AlertCircle,
} from "lucide-react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const GeneratingReport = () => {
  const navigate = useNavigate();

  /*
    URL:
    /reports/generating/:type/:id

    Example:
    /reports/generating/validation/6abab6b2ef7cd16b5ef9401e
  */

  const { type, id } = useParams();

  const [error, setError] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState("");

  // Prevent multiple polling requests at the same time
  const isCheckingRef = useRef(false);

  // Prevent multiple redirects
  const hasFinishedRef = useRef(false);

  // Used to cancel redirect timeout on unmount
  const redirectTimeoutRef = useRef(null);

  /*
    URL type -> UI name
  */
  const reportTypeMap = {
    validation: "Validation Report",
    pitch: "Pitch Report",
    roadmap: "Roadmap Report",
    techstack: "Tech Stack Report",
  };

  const reportType = reportTypeMap[type];

  /*
    -----------------------------------------
    REDIRECT AFTER ERROR
    -----------------------------------------
  */
  const showErrorAndGoBack = (message, returnedProjectId = null) => {
    if (hasFinishedRef.current) return;

    hasFinishedRef.current = true;

    setError(message);

    // Wait 3 seconds so user can see the error
    redirectTimeoutRef.current = setTimeout(() => {
      const targetProjectId = returnedProjectId || projectId;

      if (targetProjectId) {
        navigate(`/projects/initialized/${targetProjectId}`, {
          replace: true,
          state: {
            projectName,
          },
        });
      } else {
        navigate("/projects", {
          replace: true,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    let intervalId;
    let isMounted = true;

    /*
      -----------------------------------------
      CHECK REPORT STATUS
      -----------------------------------------
    */
    const checkReportStatus = async () => {
      // Prevent overlapping requests
      if (isCheckingRef.current) {
        return;
      }

      // Don't make more requests after success/failure
      if (hasFinishedRef.current) {
        return;
      }

      isCheckingRef.current = true;

      try {
        const token = localStorage.getItem("token");

        /*
          -----------------------------------------
          AUTH CHECK
          -----------------------------------------
        */

        if (!token) {
          if (isMounted) {
            hasFinishedRef.current = true;
            navigate("/login", {
              replace: true,
            });
          }

          return;
        }

        /*
          -----------------------------------------
          URL PARAM CHECK
          -----------------------------------------
        */

        if (!id) {
          showErrorAndGoBack("No report ID was found.");
          return;
        }

        if (!type || !reportType) {
          showErrorAndGoBack("Invalid report type.");
          return;
        }

        /*
          -----------------------------------------
          API REQUEST
          -----------------------------------------
        */

        const response = await fetch(`${API_URL}/api/verify/reportstatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reportId: id,

            /*
                IMPORTANT:

                Send:
                validation
                pitch
                roadmap
                techstack

                NOT:
                Validation Report
                Pitch Report
                etc.
              */
            reportType: type,
          }),
        });

        /*
          Try to parse JSON safely
        */
        let data;

        try {
          data = await response.json();
        } catch {
          throw new Error(
            `Server returned an invalid response (${response.status}).`,
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Unable to check report status (${response.status}).`,
          );
        }

        if (!isMounted || hasFinishedRef.current) {
          return;
        }

        /*
          -----------------------------------------
          SAVE PROJECT INFORMATION
          -----------------------------------------
        */

        if (data.projectId) {
          setProjectId(data.projectId);
        }

        if (data.projectName) {
          setProjectName(data.projectName);
        }

        /*
          -----------------------------------------
          REPORT COMPLETED
          -----------------------------------------
        */

        if (data.status === "completed") {
          hasFinishedRef.current = true;

          /*
            No more polling
          */
          clearInterval(intervalId);

          /*
            Navigate according to URL type.

            App.jsx routes:

            /reports/validation/:validationId
            /reports/pitch/:pitchId
            /reports/roadmap/:roadmapId
            /reports/techstack/:techstackId
          */

          if (type === "validation") {
            navigate(`/reports/validation/${id}`, {
              replace: true,
              state: {
                projectName: data.projectName,
                report: data.report,
              },
            });

            return;
          }

          if (type === "pitch") {
            navigate(`/reports/pitch/${id}`, {
              replace: true,
              state: {
                projectName: data.projectName,
                report: data.report,
              },
            });

            return;
          }

          if (type === "roadmap") {
            navigate(`/reports/roadmap/${id}`, {
              replace: true,
              state: {
                projectName: data.projectName,
                report: data.report,
              },
            });

            return;
          }

          if (type === "techstack") {
            navigate(`/reports/techstack/${id}`, {
              replace: true,
              state: {
                projectName: data.projectName,
                report: data.report,
              },
            });

            return;
          }

          /*
            This should normally never happen because
            reportType was already validated.
          */

          showErrorAndGoBack(
            "Report completed, but the report type is invalid.",
            data.projectId,
          );

          return;
        }

        /*
          -----------------------------------------
          REPORT FAILED
          -----------------------------------------
        */

        if (data.status === "failed") {
          showErrorAndGoBack(
            data.message || "Report generation failed. Please try again.",
            data.projectId,
          );

          return;
        }

        /*
          -----------------------------------------
          STILL GENERATING
          -----------------------------------------
        */

        if (data.status === "generating") {
          return;
        }

        /*
          -----------------------------------------
          UNKNOWN STATUS
          -----------------------------------------
        */

        if (!data.status) {
          showErrorAndGoBack(
            "The server did not return a report status.",
            data.projectId,
          );

          return;
        }

        /*
          Unknown status such as:
          queued
          pending
          processing

          We don't treat it as an error.
          We simply keep polling.
        */

      } catch (error) {
        if (!isMounted || hasFinishedRef.current) {
          return;
        }

        showErrorAndGoBack(
          error.message || "Something went wrong while checking the report.",
        );
      } finally {
        isCheckingRef.current = false;
      }
    };

    /*
      -----------------------------------------
      INITIAL CHECK
      -----------------------------------------
    */

    checkReportStatus();

    /*
      -----------------------------------------
      POLL EVERY 15 SECONDS
      -----------------------------------------
    */

    intervalId = setInterval(() => {
      checkReportStatus();
    }, 15000);

    /*
      -----------------------------------------
      CLEANUP
      -----------------------------------------
    */

    return () => {
      isMounted = false;

      clearInterval(intervalId);

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [id, type, reportType, navigate]);

  /*
    -----------------------------------------
    UI
    -----------------------------------------
  */

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* =========================
          BACKGROUND LOADING UI
      ========================== */}

      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}

        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />

            <div className="h-7 w-64 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          <div className="h-9 w-28 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        {/* Main Skeleton */}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Report Area */}

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gray-200 animate-pulse" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />

                <div className="h-3 w-72 max-w-full bg-gray-100 rounded animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />

              <div className="h-3 w-11/12 bg-gray-100 rounded animate-pulse" />

              <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
            </div>

            <div className="h-44 bg-gray-100 rounded-2xl mt-8 animate-pulse" />

            <div className="grid sm:grid-cols-2 gap-5 mt-6">
              <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />

              <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Sidebar Skeleton */}

          <div className="space-y-6">
            <SkeletonPanel />

            <SkeletonPanel />
          </div>
        </div>
      </main>

      {/* =========================
          FULL PAGE OVERLAY
      ========================== */}

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Background */}

        <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px]" />

        {/* Center Content */}

        <div className="relative w-[calc(100%-40px)] max-w-md text-center">
          {error ? (
            /*
              =========================
              ERROR STATE
              =========================
            */

            <div className="bg-white border border-red-200 shadow-xl rounded-3xl p-7">
              {/* Error Icon */}

              <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <AlertCircle size={32} />
              </div>

              {/* Title */}

              <h1 className="mt-6 text-xl sm:text-2xl font-bold text-gray-900">
                Report generation failed
              </h1>

              {/* Error Message */}

              <p className="mt-3 text-sm text-gray-500 leading-relaxed break-words">
                {error}
              </p>

              {/* Redirect Message */}

              <p className="mt-5 text-xs text-gray-400">
                Taking you back to your project...
              </p>

              {/* Progress */}

              <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    animation: "reportErrorProgress 3s linear forwards",
                  }}
                />
              </div>
            </div>
          ) : (
            /*
              =========================
              LOADING STATE
              =========================
            */

            <>
              {/* Animated Icon */}

              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-3xl bg-violet-100 animate-pulse" />

                <div className="absolute inset-2 rounded-2xl bg-white shadow-sm flex items-center justify-center text-violet-600">
                  <Loader2 size={29} strokeWidth={2} className="animate-spin" />
                </div>

                {/* Spark */}

                <div className="absolute -right-1 -top-1 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg">
                  <Sparkles size={12} />
                </div>
              </div>

              {/* Main Text */}

              <h1 className="mt-7 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Building your {reportType || "Report"}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-sm mx-auto">
                InitWay is researching and analyzing{" "}
                <span className="font-semibold text-gray-700">
                  {projectName || "your startup"}
                </span>{" "}
                to prepare insights specifically for your project.
              </p>

              {/* Activity Pills */}

              <div className="mt-7 flex flex-wrap justify-center gap-2">
                <Activity icon={Search} text="Researching" />

                <Activity icon={Brain} text="Analyzing" />

                <Activity icon={FileText} text="Preparing" />
              </div>

              {/* Progress */}

              <div className="mt-8 max-w-xs mx-auto">
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />

                  <p className="text-xs text-gray-400">
                    Your report is taking shape
                  </p>
                </div>
              </div>

              {/* Reassurance */}

              <div className="mt-8">
                <p className="text-xs text-gray-400">
                  This may take a little while while we analyze your idea.
                </p>

                <p className="mt-1 text-xs font-medium text-gray-500">
                  Please keep this page open.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error progress animation */}

      <style>
        {`
          @keyframes reportErrorProgress {
            from {
              width: 0%;
            }

            to {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

/*
  -----------------------------------------
  ACTIVITY PILL
  -----------------------------------------
*/

const Activity = ({ icon: Icon, text }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-gray-200 text-xs font-medium text-gray-500 shadow-sm">
      <Icon size={13} className="text-violet-500" />

      {text}
    </div>
  );
};

/*
  -----------------------------------------
  SKELETON PANEL
  -----------------------------------------
*/

const SkeletonPanel = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-6" />

      <div className="space-y-5">
        <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />

        <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse" />

        <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />

        <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

export default GeneratingReport;
