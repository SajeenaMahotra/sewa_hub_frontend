import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";


const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

const mockHandleLogin = jest.fn();
jest.mock("@/lib/actions/auth-actions", () => ({
  handleLogin: (...args: any[]) => mockHandleLogin(...args),
}));

const mockLogin = jest.fn();
jest.mock("@/context/authContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

const mockToastSuccess = jest.fn();
const mockToastError   = jest.fn();
jest.mock("sonner", () => ({
  toast: {
    success: (...a: any[]) => mockToastSuccess(...a),
    error:   (...a: any[]) => mockToastError(...a),
  },
}));

import LoginForm from "@/app/(auth)/_components/LoginForm";

beforeEach(() => jest.clearAllMocks());



describe("LoginForm.tsx", () => {


  it("renders email field, password field and LOGIN button", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });


  it("does NOT call handleLogin when form is submitted empty", async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(mockHandleLogin).not.toHaveBeenCalled();
    });
  });


  it("redirects to /feed after successful login with role 'user'", async () => {
    mockHandleLogin.mockResolvedValueOnce({
      success: true,
      token: "fake-token",
      data: { role: "user", isProfileSetup: true },
    });

    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i),    "user@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "secret123");
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/feed");
    });
  });

  it("shows error toast when handleLogin returns success: false", async () => {
    mockHandleLogin.mockResolvedValueOnce({
      success: false,
      message: "Invalid credentials",
    });

    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i),    "user@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "secret123");
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Invalid credentials");
    });
    expect(mockPush).not.toHaveBeenCalled();
  });


  it("renders Forgot Password and Create Account links with correct hrefs", () => {
    render(<LoginForm />);
    expect(screen.getByText(/forgot password/i).closest("a"))
      .toHaveAttribute("href", "/request-reset-password");
    expect(screen.getByText(/create one/i).closest("a"))
      .toHaveAttribute("href", "/role-selection");
  });
});