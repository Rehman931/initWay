import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// =========================================
// LANDING
// =========================================
import Login from "./pages/Landing/Login";
import Signup from "./pages/Landing/Signup";
import MainPage from "./pages/Landing/MainPage";
import OtpPage from "./pages/Landing/OtpPage";
import AuthCallbackPage from "./pages/Landing/AuthCallbackPage";
// =========================================
// DASHBOARD
// =========================================
import Dashboard from "./pages/Dashboard/Dashboard";
import Welcome from "./pages/Dashboard/Welcome";
import Projects from "./pages/Dashboard/Projects";
import Profile from "./pages/Dashboard/Profile";
import Settings from "./pages/Dashboard/Settings";

// =========================================
// PROJECTS
// =========================================
import NewProject from "./pages/Project/NewProject";
import Initialized from "./pages/Project/Initialized";
import Initializing from "./pages/Project/Initializing";
import GeneratingReport from "./pages/Project/GeneratingReport";

// =========================================
// REPORTS
// =========================================
import ValidationReport from "./pages/Reports/ValidationReport";
import PitchReport from "./pages/Reports/PitchReport";
import RoadmapReport from "./pages/Reports/RoadmapReport";
import TechStackReport from "./pages/Reports/TechStackReport";
import ReportHistory from "./pages/Reports/ReportHistory";

const App = () => {
  const [userProfile, setProfile] = useState({
    name: "",
    email: "",
    totalChances: 0,
    createdAt: null,
  });

  return (
    <Routes>
      {/* =========================================
          PUBLIC PAGES
      ========================================== */}

      <Route path="/" element={<MainPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/authentication" element={<OtpPage />} />

      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* =========================================
          DASHBOARD LAYOUT

          Everything inside this Route will render
          inside Dashboard's <Outlet />
      ========================================== */}

      <Route
        element={
          <Dashboard setProfile={setProfile} userProfile={userProfile} />
        }
      >
        {/* =========================================
            DASHBOARD
        ========================================== */}

        <Route path="/dashboard" element={<Welcome />} />

        {/* =========================================
            PROJECTS
        ========================================== */}

        <Route path="/projects" element={<Projects />} />

        <Route path="/projects/new" element={<NewProject />} />

        <Route
          path="/projects/initializing/:projectId"
          element={<Initializing />}
        />

        <Route
          path="/projects/initialized/:projectId"
          element={<Initialized />}
        />

        {/* =========================================
            REPORT GENERATION
        ========================================== */}

        <Route
          path="/reports/generating/:type/:id"
          element={<GeneratingReport />}
        />

        {/* =========================================
            REPORTS
        ========================================== */}

        <Route
          path="/reports/validation/:validationId"
          element={<ValidationReport />}
        />

        <Route path="/reports/pitch/:pitchId" element={<PitchReport />} />

        <Route path="/reports/roadmap/:roadmapId" element={<RoadmapReport />} />

        <Route
          path="/reports/techstack/:techstackId"
          element={<TechStackReport />}
        />

        {/* =========================================
            REPORT HISTORY
        ========================================== */}

        <Route path="/reports/history" element={<ReportHistory />} />

        {/* =========================================
            USER
        ========================================== */}

        <Route
          path="/profile"
          element={<Profile userProfile={userProfile} />}
        />

        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
