import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Search,
  Rocket,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const NewProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: "",
    problem: "",
    targetCustomer: "",
    currentSolution: "",
    proposedSolution: "",
    evidence: "",
    startupContext: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------
  // Handle input changes
  // --------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error once user starts typing again
    if (error) {
      setError("");
    }
  };

  // --------------------------------
  // Submit project
  // --------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    // Basic validation
    if (!formData.projectName.trim()) {
      setError("Please enter a project name.");
      return;
    }

    if (!formData.problem.trim()) {
      setError("Please describe the problem you are solving.");
      return;
    }

    if (!formData.targetCustomer.trim()) {
      setError("Please describe your target customer.");
      return;
    }

    if (!formData.proposedSolution.trim()) {
      setError("Please describe your proposed solution.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      const response = await fetch(`${API_URL}/api/research`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName: formData.projectName,
          problem: formData.problem,
          targetCustomer: formData.targetCustomer,
          currentSolution: formData.currentSolution,
          proposedSolution: formData.proposedSolution,
          evidence: formData.evidence,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Failed to create research.",
        );
      }

      navigate(`/projects/initializing/${data.projectId}`);
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/projects")}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition mb-6"
      >
        <ArrowLeft size={17} />
        Back to Projects
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
          <Lightbulb size={24} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Create a New Project
        </h1>

        <p className="mt-2 text-gray-500 max-w-2xl">
          Tell us about your startup idea. InitWay will use this information to
          help you validate and plan your idea.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-medium">Unable to create project</p>
            <p className="text-sm mt-1 text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* -------------------------------- */}
        {/* Basic Information */}
        {/* -------------------------------- */}

        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h2>

                <p className="text-sm text-gray-500">
                  Start with the basics of your idea.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            <FormField
              label="Project Name"
              required
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="e.g. HealthRaksha"
              helper="Give your startup idea a short, memorable name."
            />

            <TextAreaField
              label="What problem are you solving?"
              required
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              placeholder="Describe the problem your target users are facing..."
              helper="Explain the problem clearly. What is difficult, expensive, slow, or frustrating today?"
            />

            <TextAreaField
              label="Who is your target customer?"
              required
              name="targetCustomer"
              value={formData.targetCustomer}
              onChange={handleChange}
              placeholder="Describe the people or businesses who would use your product..."
            />
          </div>
        </section>

        {/* -------------------------------- */}
        {/* Solution */}
        {/* -------------------------------- */}

        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Rocket size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Solution
                </h2>

                <p className="text-sm text-gray-500">
                  Explain how your idea addresses the problem.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            <TextAreaField
              label="How is this problem solved today?"
              name="currentSolution"
              value={formData.currentSolution}
              onChange={handleChange}
              placeholder="What solutions, products, or alternatives do people currently use?"
            />

            <TextAreaField
              label="What is your proposed solution?"
              required
              name="proposedSolution"
              value={formData.proposedSolution}
              onChange={handleChange}
              placeholder="Describe your product or solution and how it will work..."
            />
          </div>
        </section>

        {/* -------------------------------- */}
        {/* Validation Context */}
        {/* -------------------------------- */}

        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Search size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Validation Context
                </h2>

                <p className="text-sm text-gray-500">
                  Give InitWay some additional context for its research.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            <TextAreaField
              label="What evidence do you have?"
              name="evidence"
              value={formData.evidence}
              onChange={handleChange}
              placeholder="Do you have user feedback, surveys, interviews, research, early users, or other evidence?"
            />

            <TextAreaField
              label="Additional startup context"
              name="startupContext"
              value={formData.startupContext}
              onChange={handleChange}
              placeholder="Anything else InitWay should know about your startup idea?"
            />
          </div>
        </section>

        {/* -------------------------------- */}
        {/* Bottom Actions */}
        {/* -------------------------------- */}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pb-8">
          <button
            type="button"
            disabled={loading}
            onClick={() => navigate("/projects")}
            className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Project...
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

/* -------------------------------- */
/* Reusable Input */
/* -------------------------------- */

const FormField = ({
  label,
  required,
  name,
  value,
  onChange,
  placeholder,
  helper,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-2">
        {label}

        {required && <span className="text-violet-600 ml-1">*</span>}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />

      {helper && <p className="mt-2 text-xs text-gray-400">{helper}</p>}
    </div>
  );
};

/* -------------------------------- */
/* Reusable Textarea */
/* -------------------------------- */

const TextAreaField = ({
  label,
  required,
  name,
  value,
  onChange,
  placeholder,
  helper,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-2">
        {label}

        {required && <span className="text-violet-600 ml-1">*</span>}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 outline-none transition resize-y focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />

      {helper && <p className="mt-2 text-xs text-gray-400">{helper}</p>}
    </div>
  );
};

export default NewProject;
