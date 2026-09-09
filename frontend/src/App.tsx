import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

import { ThemeProvider } from "./context/ThemeContext";

// Components & Layouts
import { PublicNavbar } from "./components/PublicNavbar";
import { PublicFooter } from "./components/PublicFooter";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Public Consumer Pages
import { LandingPage } from "./pages/LandingPage";
import { ServicesPage } from "./pages/ServicesPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ForWorkersPage } from "./pages/ForWorkersPage";
import { ForCooperativesPage } from "./pages/ForCooperativesPage";
import { AboutPage } from "./pages/AboutPage";
import { LoginPage } from "./pages/LoginPage";
import { WorkerLoginPage } from "./pages/WorkerLoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { WorkerOnboardingPage } from "./pages/WorkerOnboardingPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { VoiceQualityTestPage } from "./pages/VoiceQualityTestPage";

// Authenticated Role Portals
import { CustomerDashboardPage } from "./pages/CustomerDashboardPage";
import { WorkerPage } from "./pages/WorkerPage";
import { SocietyAdminPage } from "./pages/SocietyAdminPage";
import { FederationPage } from "./pages/FederationPage";
import { SuperAdminPage } from "./pages/SuperAdminPage";

// Isolated SIH Demo Environment
import { DemoHubPage } from "./pages/demo/DemoHubPage";
import { SIHDemoJourneyPage } from "./pages/demo/SIHDemoJourneyPage";
import { SIHShowcasePage } from "./pages/demo/SIHShowcasePage";
import { ArchitecturePage } from "./pages/demo/ArchitecturePage";

// Public Consumer Layout wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* PUBLIC CONSUMER PRODUCT ROUTES (CLEAN, NO HACKATHON ARTIFACTS) */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/for-workers" element={<ForWorkersPage />} />
                <Route path="/for-cooperatives" element={<ForCooperativesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin-portal" element={<Navigate to="/admin/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/join-worker" element={<WorkerOnboardingPage />} />
                <Route path="/worker/login" element={<WorkerLoginPage />} />
                <Route path="/worker/dashboard" element={<Navigate to="/worker" replace />} />
                <Route path="/worker/register" element={<Navigate to="/join-worker" replace />} />
                <Route path="/voice-test" element={<VoiceQualityTestPage />} />
                <Route path="/admin/voice-test" element={<VoiceQualityTestPage />} />
              </Route>

            {/* DEDICATED SUPER ADMIN COMMAND GATEWAY */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* AUTHENTICATED ROLE-BASED PORTALS (PROTECTED) */}
            <Route
              path="/app"
              element={
                <ProtectedRoute allowedRoles={["CUSTOMER", "SUPER_ADMIN"]}>
                  <CustomerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/customer" element={<Navigate to="/app" replace />} />

            <Route
              path="/worker"
              element={
                <ProtectedRoute allowedRoles={["WORKER", "SUPER_ADMIN"]}>
                  <WorkerPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/society"
              element={
                <ProtectedRoute allowedRoles={["SOCIETY_ADMIN", "SUPER_ADMIN"]}>
                  <SocietyAdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/society-admin" element={<Navigate to="/society" replace />} />

            <Route
              path="/federation"
              element={
                <ProtectedRoute allowedRoles={["FEDERATION_ADMIN", "SUPER_ADMIN"]}>
                  <FederationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                  <SuperAdminPage />
                </ProtectedRoute>
              }
            />

            {/* ISOLATED SIH 2026 DEMO & EVALUATION ENVIRONMENT */}
            <Route path="/demo" element={<DemoHubPage />} />
            <Route path="/demo/journey" element={<SIHDemoJourneyPage />} />
            <Route path="/demo/showcase" element={<SIHShowcasePage />} />
            <Route path="/demo/architecture" element={<ArchitecturePage />} />

            {/* Legacy Demo Redirects */}
            <Route path="/sih-showcase" element={<Navigate to="/demo/showcase" replace />} />
            <Route path="/architecture" element={<Navigate to="/demo/architecture" replace />} />

            {/* Default Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
