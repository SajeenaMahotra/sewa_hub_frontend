import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockHandleCreateBooking = jest.fn();
jest.mock("@/lib/actions/booking-actions", () => ({
  handleCreateBooking: (...args: any[]) => mockHandleCreateBooking(...args),
}));

const mockToastSuccess = jest.fn();
const mockToastError   = jest.fn();
jest.mock("sonner", () => ({
  toast: { success: (...a: any[]) => mockToastSuccess(...a), error: (...a: any[]) => mockToastError(...a) },
}));

import BookingForm from "@/app/(user)/_components/BookingForm";

// ─────────────────────────────────────────────────────────────────────────────

const mockProvider = {
  _id: "provider-123",
  price_per_hour: 500,
  Useruser_id: { _id: "user-456", fullname: "Ram Bahadur", email: "ram@example.com" },
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split("T")[0];

// Fills form using input type selectors — no htmlFor needed
const fillForm = async () => {
  fireEvent.change(screen.getByDisplayValue(""), { target: { value: tomorrowStr } });
  // date input
  const dateInput = document.querySelector("input[type='date']") as HTMLInputElement;
  const timeInput = document.querySelector("input[type='time']") as HTMLInputElement;
  const phoneInput = document.querySelector("input[type='tel']") as HTMLInputElement;
  const addressInput = document.querySelector("textarea") as HTMLTextAreaElement;

  fireEvent.change(dateInput,   { target: { value: tomorrowStr } });
  fireEvent.change(timeInput,   { target: { value: "10:00" } });
  fireEvent.change(phoneInput,  { target: { value: "9841234567" } });
  fireEvent.change(addressInput, { target: { value: "45 Thamel Marg, Kathmandu" } });
};

beforeEach(() => jest.clearAllMocks());


describe("BookingForm.tsx", () => {


  it("renders the provider base price in the header", () => {
    render(<BookingForm provider={mockProvider} />);
    const matches = screen.getAllByText(/500/);
    expect(matches.length).toBeGreaterThan(0);
  });


  it("renders Normal, Emergency and Urgent severity buttons", () => {
    render(<BookingForm provider={mockProvider} />);
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("Emergency")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });


  it("renders the Request Booking submit button", () => {
    render(<BookingForm provider={mockProvider} />);
    expect(screen.getByRole("button", { name: /request booking/i })).toBeInTheDocument();
  });

 
  it("shows validation errors and does NOT call handleCreateBooking on empty submit", async () => {
    render(<BookingForm provider={mockProvider} />);

    fireEvent.click(screen.getByRole("button", { name: /request booking/i }));

    await waitFor(() => {
      const errors = document.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });

    expect(mockHandleCreateBooking).not.toHaveBeenCalled();
  });

 
  it("shows ×1.8 multiplier in pricing summary after selecting Urgent", async () => {
    render(<BookingForm provider={mockProvider} />);

    fireEvent.click(screen.getByText("Urgent"));

    await waitFor(() => {

      const matches = screen.getAllByText(/×1\.8/);
      expect(matches.length).toBeGreaterThan(0);
    });
  });
});