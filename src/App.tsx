import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { WebsiteProvider } from "./context/WebsiteContext";
import { DateRangeProvider } from "./context/DateRangeContext";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RealtimePage from "./pages/Realtime";
import Pages from "./pages/Pages";
import Visitors from "./pages/Visitors";
import Events from "./pages/Events";
import Conversions from "./pages/Conversions";
import Sources from "./pages/Sources";
import Devices from "./pages/Devices";
import ReportPage from "./pages/Report";
import SettingsPage from "./pages/Settings";
import WebsitesPage from "./pages/Websites";
import Install from "./pages/Install";
import Toaster from "./components/Toaster";
import { LoadingBlock } from "./components/States";

function Protected({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuth();
  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingBlock label="Loading..." />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuth();
  if (initializing) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnly>
                  <Register />
                </PublicOnly>
              }
            />
            <Route
              path="/*"
              element={
                <Protected>
                  <WebsiteProvider>
                    <DateRangeProvider>
                      <Routes>
                        <Route element={<AppLayout />}>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/realtime" element={<RealtimePage />} />
                          <Route path="/pages" element={<Pages />} />
                          <Route path="/visitors" element={<Visitors />} />
                          <Route path="/events" element={<Events />} />
                          <Route path="/conversions" element={<Conversions />} />
                          <Route path="/sources" element={<Sources />} />
                          <Route path="/devices" element={<Devices />} />
                          <Route path="/report" element={<ReportPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="/websites" element={<WebsitesPage />} />
                          <Route path="/websites/:id/install" element={<Install />} />
                        </Route>
                      </Routes>
                    </DateRangeProvider>
                  </WebsiteProvider>
                </Protected>
              }
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}