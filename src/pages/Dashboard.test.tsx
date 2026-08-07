import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { ToastProvider } from "../context/ToastContext";
import { AuthProvider } from "../context/AuthContext";
import { WebsiteProvider } from "../context/WebsiteContext";
import { DateRangeProvider } from "../context/DateRangeContext";

const overview = {
  current: { visitors: 120, sessions: 90, pageViews: 400, bounceRate: 40, avgSessionDuration: 120, conversions: 12, conversionRate: 10 },
  previous: { visitors: 100, sessions: 80, pageViews: 300, bounceRate: 45, avgSessionDuration: 100, conversions: 8, conversionRate: 8 },
};

vi.mock("../services", () => ({
  analyticsApi: {
    overview: () => Promise.resolve(overview),
    topPages: () => Promise.resolve([{ page: "/", views: 400, visitors: 120, avgDuration: 60, bounceRate: 0 }]),
    sources: () => Promise.resolve([{ source: "organic", visitors: 50, sessions: 40, pageViews: 200 }]),
    devices: () => Promise.resolve([{ name: "Desktop", visitors: 100, sessions: 70, pageViews: 300 }]),
    series: () => Promise.resolve([{ date: "2026-01-01", label: "Visitors", value: 120 }]),
  },
  websiteApi: {
    list: () => Promise.resolve({ websites: [{ id: 1, name: "Site", domain: "site.com", trackingId: "wp_1", timezone: "UTC", respectDnt: true, trackEvents: true, disabled: false, createdAt: "", updatedAt: "" }] }),
  },
}));

vi.mock("../services/api", () => ({
  errorMessage: (_e: unknown) => "error",
  getToken: () => null,
  setToken: () => {},
  api: { interceptors: { response: { use: vi.fn() } }, defaults: {} },
}));

function renderDashboard() {
  return render(
    <ToastProvider>
      <AuthProvider>
        <MemoryRouter>
          <WebsiteProvider>
            <DateRangeProvider>
              <Dashboard />
            </DateRangeProvider>
          </WebsiteProvider>
        </MemoryRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

describe("Dashboard", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("renders overview metric cards", async () => {
    renderDashboard();
    expect(await screen.findByText("Page Views")).toBeInTheDocument();
    expect(screen.getByText("Bounce Rate")).toBeInTheDocument();
    expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
  });

  it("renders top pages table", async () => {
    renderDashboard();
    const page = await screen.findByText("/");
    expect(page).toBeInTheDocument();
  });
});