import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const Initializing = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [status, setStatus] = useState("initializing");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) {
      setError("Project ID is missing.");
      return;
    }

    let intervalId;
    let stopped = false;

    const checkProjectStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        // No token -> login
        if (!token) {
          console.log("No token found in Initializing");
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

        console.log("Project status response:", response.status);
        console.log("Project status data:", data);

        if (!response.ok) {
          throw new Error(data?.message || "Unable to check project status.");
        }

        if (stopped) return;

        setStatus(data.status);

        // -----------------------------
        // INITIALIZING
        // -----------------------------
        if (data.status === "initializing") {
          return;
        }

        // -----------------------------
        // INITIALIZED
        // -----------------------------
        if (data.status === "initialized") {
          clearInterval(intervalId);

          navigate(`/projects/initialized/${projectId}`, {
            replace: true,
          });

          return;
        }

        // -----------------------------
        // FAILED
        // -----------------------------
        if (data.status === "failed") {
          clearInterval(intervalId);

          setError(
            data?.message || "We were unable to initialize your project.",
          );

          return;
        }
      } catch (error) {
        console.error("Project status check failed:", error);

        if (stopped) return;

        clearInterval(intervalId);

        setStatus("failed");

        setError(
          error?.message || "Something went wrong while checking your project.",
        );
      }
    };

    // Check immediately
    checkProjectStatus();

    // Check every 3 seconds
    intervalId = setInterval(() => {
      checkProjectStatus();
    }, 15000);

    // Cleanup
    return () => {
      stopped = true;
      clearInterval(intervalId);
    };
  }, [projectId, navigate]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Fake Dashboard Loading Structure */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
        {/* Page Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-7 w-64 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          <div className="h-10 w-28 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        {/* Main Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Content */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-7">
              <div className="w-11 h-11 rounded-xl bg-gray-200 animate-pulse" />

              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-60 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-11/12 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
            </div>

            <div className="h-40 bg-gray-100 rounded-xl mt-7 animate-pulse" />
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-6" />

              <div className="space-y-5">
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-5" />

              <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Center Overlay */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          {/* Loading / Error Icon */}
          <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full border-4 ${
                status === "failed" ? "border-red-100" : "border-violet-100"
              }`}
            />

            {status === "initializing" && (
              <Loader2
                size={30}
                strokeWidth={2}
                className="text-violet-600 animate-spin"
              />
            )}

            {status === "failed" && (
              <AlertCircle size={30} strokeWidth={2} className="text-red-500" />
            )}
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-xl font-semibold text-gray-900">
            {status === "initializing" && "Setting up your project"}

            {status === "failed" && "Project initialization failed"}
          </h1>

          {/* Description */}
          <p className="mt-2 text-sm text-gray-500">
            {status === "initializing" && <>Preparing your project...</>}

            {status === "failed" && (
              <span className="text-red-500">{error}</span>
            )}
          </p>

          {/* Loading dots */}
          {status === "initializing" && (
            <div className="flex justify-center items-center gap-1.5 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />

              <span
                className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"
                style={{
                  animationDelay: "150ms",
                }}
              />

              <span
                className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse"
                style={{
                  animationDelay: "300ms",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SkeletonLine = () => {
  return (
    <div className="space-y-2">
      <div className="h-2.5 w-24 bg-gray-100 rounded animate-pulse" />
      <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
    </div>
  );
};

export default Initializing;
