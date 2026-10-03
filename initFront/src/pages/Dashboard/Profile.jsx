import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  CalendarDays,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Zap,
  FileText,
  ShieldCheck,
} from "lucide-react";

const Profile = ({ userProfile }) => {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // =========================================
  // REAL USER DATA
  // =========================================

  const totalChances = userProfile?.totalChances ?? 0;
  const totalReport = userProfile?.totalReport ?? 0;

  // =========================================
  // LOAD USER DATA
  // =========================================

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
      });
    }
  }, [userProfile]);

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================================
  // SAVE
  // =========================================

  const handleSave = () => {
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);

    // NOTE:
    // This only updates the UI.
    // Connect your update-profile API here
    // when you want database persistence.
  };

  // =========================================
  // CANCEL
  // =========================================

  const handleCancel = () => {
    setEditing(false);

    setFormData({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
    });
  };

  // =========================================
  // MEMBER SINCE
  // =========================================

  const memberSince = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "—";

  // =========================================
  // USER INITIAL
  // =========================================

  const initial = formData.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="max-w-5xl mx-auto">
      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Profile
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your personal information and account details.
        </p>
      </div>

      {/* =========================================
          PROFILE HEADER
      ========================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Banner */}

        <div className="h-32 bg-(--workspace-ink)" />

        <div className="px-5 sm:px-8 pb-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12">
            {/* USER IDENTITY */}

            <div className="flex items-end gap-4">
              {/* Avatar */}

              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center text-3xl font-bold">
                  {initial}
                </div>
              </div>

              {/* NAME */}

              <div className="pb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {formData.name || "User"}
                </h2>

                <p className="text-sm text-gray-500">
                  {formData.email || "No email available"}
                </p>
              </div>
            </div>

            {/* EDIT CONTROLS */}

            <div className="mt-5 sm:mt-0">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2.5
                    rounded-xl
                    border border-gray-200
                    bg-white
                    text-gray-700
                    font-medium
                    hover:bg-gray-50
                    transition
                  "
                >
                  <Edit3 size={17} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2.5
                      rounded-xl
                      border border-gray-200
                      bg-white
                      text-gray-700
                      font-medium
                      hover:bg-gray-50
                      transition
                    "
                  >
                    <X size={17} />
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2.5
                      rounded-xl
                      bg-violet-600
                      text-white
                      font-medium
                      hover:bg-violet-700
                      transition
                    "
                  >
                    <Save size={17} />
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          SUCCESS MESSAGE
      ========================================== */}

      {saved && (
        <div
          className="
          mt-5
          flex items-center gap-2
          rounded-xl
          border border-green-200
          bg-green-50
          px-4 py-3
          text-sm text-green-700
        "
        >
          <CheckCircle2 size={18} />
          Profile updated successfully.
        </div>
      )}

      {/* =========================================
          PERSONAL INFORMATION
      ========================================== */}

      <div className="mt-6 bg-white border border-gray-200 rounded-2xl">
        <div className="px-5 sm:px-8 py-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Your basic account information.
          </p>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          {/* NAME */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Your name"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition ${
                  editing
                    ? "border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              />
            </div>
          </div>

          {/* EMAIL */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Your email"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition ${
                  editing
                    ? "border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          ACCOUNT DETAILS
      ========================================== */}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MEMBER SINCE */}

        <AccountCard
          icon={CalendarDays}
          iconStyle="bg-indigo-100 text-indigo-600"
          title="Member Since"
          value={memberSince}
          description="InitWay account"
        />

        {/* AI GENERATIONS */}

        <AccountCard
          icon={Zap}
          iconStyle="bg-violet-100 text-violet-600"
          title="AI Generations"
          value={totalChances}
          description="Available generations"
        />

        {/* REPORTS */}

        <AccountCard
          icon={FileText}
          iconStyle="bg-blue-100 text-blue-600"
          title="Reports"
          value={totalReport}
          description="Available reports"
        />

        {/* ACCOUNT STATUS */}

        <AccountCard
          icon={ShieldCheck}
          iconStyle="bg-green-100 text-green-600"
          title="Account Status"
          value="Active"
          description="Your InitWay account"
        />
      </div>

      {/* =========================================
          CURRENT PLAN
      ========================================== */}

      <div className="mt-6 rounded-lg border border-(--workspace-line) bg-violet-50 p-6 sm:p-7">
        <div
          className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-5
        "
        >
          <div>
            <p className="text-sm font-medium text-violet-600">Current Plan</p>

            <h3 className="mt-1 text-xl font-bold text-gray-900">Free Plan</h3>

            <p className="mt-1 text-sm text-gray-500">
              You currently have{" "}
              <span className="font-semibold text-gray-700">
                {totalChances}
              </span>{" "}
              AI generations and{" "}
              <span className="font-semibold text-gray-700">{totalReport}</span>{" "}
              reports available.
            </p>
          </div>

          <button
            className="
              px-5 py-2.5
              rounded-xl
              bg-violet-600
              text-white
              font-medium
              hover:bg-violet-700
              transition
            "
          >
            Upgrade Plan
          </button>
        </div>

        {/* RESOURCE BAR */}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* GENERATIONS */}

          <div className="bg-white/70 border border-violet-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-violet-600" />

                <span className="text-sm font-medium text-gray-700">
                  AI Generations
                </span>
              </div>

              <span className="text-sm font-bold text-gray-900">
                {totalChances}
              </span>
            </div>
          </div>

          {/* REPORTS */}

          <div className="bg-white/70 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" />

                <span className="text-sm font-medium text-gray-700">
                  Reports
                </span>
              </div>

              <span className="text-sm font-bold text-gray-900">
                {totalReport}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   ACCOUNT CARD
===================================================== */

const AccountCard = ({ icon: Icon, iconStyle, title, value, description }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div
        className={`
          w-10 h-10
          rounded-xl
          flex items-center justify-center
          ${iconStyle}
        `}
      >
        <Icon size={20} />
      </div>

      <p className="mt-4 text-sm text-gray-500">{title}</p>

      <p className="mt-1 font-semibold text-gray-900">{value}</p>

      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
};

export default Profile;
