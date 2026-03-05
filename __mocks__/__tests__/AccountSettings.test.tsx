import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountSettings from "@/app/(user)/_components/AccountSettings";
import { toast } from "sonner";

jest.mock("@/lib/actions/auth-actions", () => ({
  handleChangePassword: jest.fn(),
  handleDeleteAccount: jest.fn(),
}));

jest.mock("@/context/authContext", () => ({
  useAuth: () => ({
    logout: jest.fn(),
    user: { _id: "user1" },
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockToastError = toast.error as jest.Mock;


describe("AccountSettings — Change Password", () => {
  beforeEach(() => jest.clearAllMocks());

  it(" renders current, new, and confirm password fields + Update button", () => {
    render(<AccountSettings />);

    expect(screen.getByText(/change password/i)).toBeInTheDocument();
    const passwordInputs = screen.getAllByPlaceholderText(/••••••/);
    expect(passwordInputs.length).toBe(3);
    expect(
      screen.getByRole("button", { name: /update password/i })
    ).toBeInTheDocument();
  });

  it("shows toast error when fields are empty and Update is clicked", async () => {
    render(<AccountSettings />);

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Please fill in all fields");
    });
  });

  it("shows toast error when new passwords do not match", async () => {
    render(<AccountSettings />);

    const [currentField, newField, confirmField] =
      screen.getAllByPlaceholderText(/••••••/);

    await userEvent.type(currentField, "oldPass1");
    await userEvent.type(newField, "newPass1");
    await userEvent.type(confirmField, "differentPass");

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "New passwords do not match"
      );
    });
  });

  it("shows toast error when new password is less than 6 characters", async () => {
    render(<AccountSettings />);

    const [currentField, newField, confirmField] =
      screen.getAllByPlaceholderText(/••••••/);

    await userEvent.type(currentField, "oldPass1");
    await userEvent.type(newField, "abc");
    await userEvent.type(confirmField, "abc");

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Password must be at least 6 characters"
      );
    });
  });
});

describe("AccountSettings — Delete Account", () => {
  beforeEach(() => jest.clearAllMocks());

  it(" renders 'Delete My Account' button initially", () => {
    render(<AccountSettings />);
    expect(
      screen.getByRole("button", { name: /delete my account/i })
    ).toBeInTheDocument();
  });

  it("shows the confirmation panel after clicking 'Delete My Account'", async () => {
    render(<AccountSettings />);

    fireEvent.click(
      screen.getByRole("button", { name: /delete my account/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/this action is irreversible/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/type delete to confirm/i)).toBeInTheDocument();
    });
  });

  it("'Confirm Delete' button is disabled until user types DELETE", async () => {
    render(<AccountSettings />);

    fireEvent.click(
      screen.getByRole("button", { name: /delete my account/i })
    );

    const confirmBtn = await screen.findByRole("button", {
      name: /confirm delete/i,
    });

  
    expect(confirmBtn).toBeDisabled();

 
    const deleteInput = screen.getByPlaceholderText(/type delete to confirm/i);
    await userEvent.type(deleteInput, "DELETE");


    expect(confirmBtn).not.toBeDisabled();
  });
});