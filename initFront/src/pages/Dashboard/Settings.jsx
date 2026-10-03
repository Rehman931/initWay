import React, { useState } from "react";
import { Bell, Lock, User, Shield, Save, CheckCircle2 } from "lucide-react";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={18} />
          Settings saved successfully.
        </div>
      )}

      {/* Account Settings */}
      <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 sm:px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <User size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Account</h2>

              <p className="text-sm text-gray-500">
                Manage your account preferences.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          {/* Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium text-gray-800">Profile Information</p>

              <p className="text-sm text-gray-500 mt-1">
                Update your name and email address.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/profile")}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Manage Profile
            </button>
          </div>

          <div className="border-t border-gray-100" />

          {/* Password */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium text-gray-800">Password</p>

              <p className="text-sm text-gray-500 mt-1">
                Change your account password.
              </p>
            </div>

            <button className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Change Password
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 sm:px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Bell size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>

              <p className="text-sm text-gray-500">
                Choose which notifications you receive.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          {/* Email notifications */}
          <SettingToggle
            title="Email Notifications"
            description="Receive important updates and account notifications."
            enabled={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />

          <div className="border-t border-gray-100" />

          {/* Project updates */}
          <SettingToggle
            title="Project Updates"
            description="Get notified when your AI project results are ready."
            enabled={projectUpdates}
            onChange={() => setProjectUpdates(!projectUpdates)}
          />
        </div>
      </section>

      {/* Security */}
      <section className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 sm:px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <Shield size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>

              <p className="text-sm text-gray-500">
                Keep your InitWay account secure.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
              <Lock size={19} />
            </div>

            <div>
              <p className="font-medium text-gray-800">Account Security</p>

              <p className="text-sm text-gray-500 mt-1">
                Your account is protected with your login credentials.
              </p>

              <button className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700">
                Manage Security
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end mt-6 pb-8">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition shadow-sm"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* Toggle Component */
const SettingToggle = ({ title, description, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-5">
      <div>
        <p className="font-medium text-gray-800">{title}</p>

        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      <button
        onClick={onChange}
        className={`relative shrink-0 w-11 h-6 rounded-full transition ${
          enabled ? "bg-violet-600" : "bg-gray-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

export default Settings;
