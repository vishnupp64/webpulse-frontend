import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { authApi } from "../services";

vi.mock("../services", () => ({
  authApi: {
    login: vi.fn(),
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock("../services/api", () => ({
  errorMessage: (e: unknown) => (e as Error).message ?? "error",
  getToken: () => null,
  setToken: vi.fn(),
  api: { interceptors: { response: { use: vi.fn() } }, defaults: {} },
}));

function renderLogin() {
  return render(
    <ToastProvider>
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields", () => {
    const { getByPlaceholderText, getByText } = renderLogin();
    expect(getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(getByText(/welcome back/i)).toBeInTheDocument();
  });

  it("calls login on submit", async () => {
    (authApi.login as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      token: "t",
      user: { id: 1, name: "A", email: "a@b.com" },
    });
    const { getByPlaceholderText, getByRole } = renderLogin();
    fireEvent.change(getByPlaceholderText("you@example.com"), { target: { value: "a@b.com" } });
    fireEvent.change(getByPlaceholderText("••••••••"), { target: { value: "password123" } });
    fireEvent.click(getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(authApi.login).toHaveBeenCalledWith({ email: "a@b.com", password: "password123" }));
  });
});