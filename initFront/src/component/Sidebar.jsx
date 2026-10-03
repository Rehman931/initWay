import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  User,
  Settings,
  Plus,
  LogOut,
  X,
  History,
} from "lucide-react";

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Mobile close */}
          <div className="lg:hidden flex justify-end p-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* New Project */}
          <div className="px-4 pt-4 pb-5">
            <button
              onClick={() => {
                navigate("/projects/new");
                onClose?.();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition shadow-sm"
            >
              <Plus size={18} />
              New Project
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="px-3 space-y-1">
            <SidebarItem
              to="/dashboard"
              icon={<LayoutDashboard size={19} />}
              label="Dashboard"
              onClick={onClose}
            />

            <SidebarItem
              to="/projects"
              icon={<FolderKanban size={19} />}
              label="Projects"
              onClick={onClose}
            />

            <SidebarItem
              to="/reports/history"
              icon={<History size={19} />}
              label="Report History"
              onClick={onClose}
            />
          </nav>

          {/* Divider */}
          <div className="mx-4 my-5 border-t border-gray-200" />

          {/* Account Navigation */}
          <nav className="px-3 space-y-1">
            <SidebarItem
              to="/profile"
              icon={<User size={19} />}
              label="Profile"
              onClick={onClose}
            />

            <SidebarItem
              to="/settings"
              icon={<Settings size={19} />}
              label="Settings"
              onClick={onClose}
            />
          </nav>

          {/* Bottom User Card */}
          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold">
                S
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  Sana
                </p>

                <p className="text-xs text-gray-400">Free Plan</p>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const SidebarItem = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
          isActive
            ? "bg-violet-50 text-violet-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;
