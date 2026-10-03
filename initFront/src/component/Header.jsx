import React, { useEffect, useRef, useState } from "react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const AI_URL = import.meta.env.VITE_AI_URL;
import { Bell, Menu, Sparkles, CheckCircle2 } from "lucide-react";

import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick, userProfile, setProfile }) => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  // =========================================
  // GET USER DATA
  // =========================================

  useEffect(() => {
  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/verify/dashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        navigate("/login");
        throw new Error(data.message || "Unable to load dashboard");
      }

      setProfile(data);
    } catch {
      alert("Unable to load your account. Please try again.");
    }
  };

  getUserData();

  // Wake AI service — completely independent
  fetch(`${AI_URL}/health`).catch(() => {
    console.log("AI service is sleeping or unavailable.");
  });
}, [navigate, setProfile]);

  // =========================================
  // CLOSE NOTIFICATION WHEN CLICKING OUTSIDE
  // =========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================
  // TOGGLE NOTIFICATIONS
  // =========================================

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur border-b border-[var(--workspace-line)] z-50">
      <div className="h-full px-4 lg:px-7 flex items-center justify-between">
        {/* =========================================
            LEFT
        ========================================== */}

        <div className="flex items-center gap-3">
          {/* MOBILE MENU */}

          <button
            onClick={onMenuClick}
            className="
              lg:hidden
              p-2.5
              rounded-lg
              text-[var(--workspace-ink)]
              hover:bg-[var(--workspace-canvas)]
              transition
            "
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          {/* LOGO */}

          <div className="flex items-center gap-2">
            <div
              className="
                w-9 h-9
                rounded-lg
                bg-[var(--workspace-ink)]
                text-white
                flex
                items-center
                justify-center
              "
            >
              <Sparkles size={19} />
            </div>

            <span
              className="
                text-lg
                font-bold
                text-[var(--workspace-ink)]
              "
            >
              InitWay
            </span>
          </div>
        </div>

        {/* =========================================
            RIGHT
        ========================================== */}

        <div className="flex items-center gap-3">
          {/* =========================================
              NOTIFICATION
          ========================================== */}

          <div ref={notificationRef} className="relative">
            {/* BELL BUTTON */}

            <button
              onClick={handleNotificationClick}
              className={`
                relative
                p-2.5
                rounded-xl
                transition
                ${showNotifications ? "bg-[#f1f7df]" : "hover:bg-[var(--workspace-canvas)]"}
              `}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell
                size={19}
                className={
                  showNotifications
                    ? "text-[var(--workspace-ink)]"
                    : "text-[var(--workspace-muted)]"
                }
              />

              {/* Notification Dot */}

              <span
                className="
                  absolute
                  top-2
                  right-2
                  w-2
                  h-2
                  bg-[var(--workspace-coral)]
                  rounded-full
                  border-2
                  border-white
                "
              />
            </button>

            {/* =========================================
                NOTIFICATION CARD
            ========================================== */}

            {showNotifications && (
              <div
                className="
                  absolute
                  right-0
                  top-14
                  w-[340px]
                  max-w-[calc(100vw-2rem)]
                  bg-white
                  border
                  border-[var(--workspace-line)]
                  rounded-lg
                  shadow-xl
                  shadow-gray-200/50
                  overflow-hidden
                  z-50
                "
              >
                {/* HEADER */}

                <div
                  className="
                    px-4
                    py-3.5
                    border-b
                    border-gray-100
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Notifications
                    </h3>

                    <p className="text-xs text-gray-400 mt-0.5">
                      Stay updated with InitWay
                    </p>
                  </div>

                  <span
                    className="
                      text-[11px]
                      font-medium
                      text-[var(--workspace-ink)]
                      bg-[#f1f7df]
                      px-2
                      py-1
                      rounded-full
                    "
                  >
                    1 new
                  </span>
                </div>

                {/* NOTIFICATION */}

                <div
                  className="
                    px-4
                    py-4
                    hover:bg-gray-50
                    transition
                    cursor-pointer
                  "
                >
                  <div className="flex gap-3">
                    {/* ICON */}

                    <div
                      className="
                        shrink-0
                        w-9
                        h-9
                        rounded-xl
                        bg-[#f1f7df]
                        text-[var(--workspace-ink)]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <CheckCircle2 size={18} />
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Welcome to InitWay
                        </h4>

                        <span className="shrink-0 w-2 h-2 bg-[var(--workspace-coral)] rounded-full mt-1.5" />
                      </div>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                          leading-relaxed
                        "
                      >
                        Your startup workspace is ready. Start by creating your
                        first startup idea.
                      </p>

                      <p className="mt-2 text-[11px] text-gray-400">Just now</p>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}

                <div
                  className="
                    px-4
                    py-3
                    border-t
                    border-gray-100
                    bg-gray-50/50
                  "
                >
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="
                      w-full
                      text-center
                      text-xs
                      font-medium
                      text-gray-500
                      hover:text-[var(--workspace-ink)]
                      transition
                    "
                  >
                    Close notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =========================================
              USER
          ========================================== */}

          <div
            className="
              flex
              items-center
              gap-3
              pl-3
              border-l
              border-[var(--workspace-line)]
            "
          >
            {/* AVATAR */}

            <div
              className="
                w-9
                h-9
                rounded-full
                bg-[#e8f1d6]
                text-[var(--workspace-ink)]
                flex
                items-center
                justify-center
                font-semibold
              "
            >
              {userProfile?.name?.toUpperCase()?.[0] || "U"}
            </div>

            {/* USER DETAILS */}

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[var(--workspace-ink)]">
                {userProfile?.name || "User"}
              </p>

              <p className="text-xs text-[var(--workspace-muted)]">Founder</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
