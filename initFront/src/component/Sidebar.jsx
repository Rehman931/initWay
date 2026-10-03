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
        className={`fixed top-16 bottom-0 left-0 w-64 bg-[var(--workspace-ink)] border-r border-black/10 z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Mobile close */}
          <div className="lg:hidden flex justify-end p-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Close navigation"
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--workspace-accent)] text-[var(--workspace-ink)] font-semibold hover:bg-[#d7f39b] transition shadow-sm"
            >
              <Plus size={18} />
              New Project
            </button>
          </div>

          {/* Main Navigation */}
          <nav aria-label="Main navigation" className="px-3 space-y-1">
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
          <div className="mx-4 my-5 border-t border-white/10" />

          {/* Account Navigation */}
          <nav aria-label="Account navigation" className="px-3 space-y-1">
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
          <div className="mt-auto p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-[var(--workspace-accent)] text-[var(--workspace-ink)] flex items-center justify-center font-semibold">
                S
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  Sana
                </p>

                <p className="text-xs text-white/55">Free Plan</p>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
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
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
          isActive
            ? "bg-[var(--workspace-accent)] text-[var(--workspace-ink)]"
            : "text-white/65 hover:bg-white/[0.07] hover:text-white"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;
