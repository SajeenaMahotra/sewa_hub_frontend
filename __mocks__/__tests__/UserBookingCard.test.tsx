import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockHandleCancelBooking = jest.fn();
const mockHandleDeleteBooking = jest.fn();
jest.mock("@/lib/actions/booking-actions", () => ({
  handleCancelBooking: (...a: any[]) => mockHandleCancelBooking(...a),
  handleDeleteBooking: (...a: any[]) => mockHandleDeleteBooking(...a),
}));

jest.mock("@/lib/actions/provider-actions", () => ({
  handleRateProvider: jest.fn(),
}));

jest.mock("@/context/authContext", () => ({
  useAuth: () => ({ user: { _id: "current-user-id" } }),
}));

jest.mock("@/components/ChatWindow", () => ({
  __esModule: true,
  default: () => <div data-testid="chat-window">Chat</div>,
}));

const mockToastSuccess = jest.fn();
const mockToastError   = jest.fn();
jest.mock("sonner", () => ({
  toast: { success: (...a: any[]) => mockToastSuccess(...a), error: (...a: any[]) => mockToastError(...a) },
}));

import UserBookingCard, {
  UserBookingCardData,
  StatusBadge,
  SeverityBadge,
} from "@/app/(user)/_components/UserBookingCard";

// ─────────────────────────────────────────────────────────────────────────────

const makeBooking = (overrides: Partial<UserBookingCardData> = {}): UserBookingCardData => ({
  _id: "booking-001",
  provider_id: {
    _id: "prov-001",
    price_per_hour: 500,
    Useruser_id: { _id: "u-001", fullname: "Ram Bahadur", email: "ram@test.com" },
    ServiceCategorycatgeory_id: { category_name: "Plumbing" },
  },
  scheduled_at: "2025-08-15T10:30:00.000Z",
  address: "45 Thamel Marg, Kathmandu",
  price_per_hour: 500,
  severity: "normal",
  effective_price_per_hour: 500,
  status: "pending",
  created_at: "2025-08-10T08:00:00.000Z",
  ...overrides,
});

const noop = jest.fn();
beforeEach(() => jest.clearAllMocks());

// ─────────────────────────────────────────────────────────────────────────────

describe("UserBookingCard.tsx", () => {

  // TEST 1 — Renders provider name and address
  it("renders provider name and address", () => {
    render(<UserBookingCard booking={makeBooking()} onCancel={noop} onDelete={noop} />);
    expect(screen.getByText("Ram Bahadur")).toBeInTheDocument();
    expect(screen.getByText(/45 Thamel Marg/i)).toBeInTheDocument();
  });

  // TEST 2 — StatusBadge renders correct label for all statuses
  it.each([
    ["pending",   "Pending"],
    ["accepted",  "Accepted"],
    ["rejected",  "Rejected"],
    ["completed", "Completed"],
    ["cancelled", "Cancelled"],
  ] as const)("StatusBadge shows '%s' label", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

 
  it.each([
    ["normal",    "Normal"],
    ["emergency", "Emergency"],
    ["urgent",    "Urgent"],
  ] as const)("SeverityBadge shows '%s' label", (severity, label) => {
    render(<SeverityBadge severity={severity} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("shows Cancel button for pending and hides it for completed", () => {
    const { unmount } = render(
      <UserBookingCard booking={makeBooking({ status: "pending" })} onCancel={noop} onDelete={noop} />
    );
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    unmount();

    render(
      <UserBookingCard booking={makeBooking({ status: "completed" })} onCancel={noop} onDelete={noop} />
    );
    expect(screen.queryByRole("button", { name: /^cancel$/i })).not.toBeInTheDocument();
  });

  it("calls onCancel and shows success toast after confirming cancel", async () => {
    mockHandleCancelBooking.mockResolvedValueOnce({ success: true });
    const onCancel = jest.fn();

    render(
      <UserBookingCard booking={makeBooking({ status: "pending" })} onCancel={onCancel} onDelete={noop} />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /yes, cancel/i })).toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole("button", { name: /yes, cancel/i }));

    await waitFor(() => {
      expect(mockHandleCancelBooking).toHaveBeenCalledWith("booking-001");
      expect(mockToastSuccess).toHaveBeenCalledWith("Booking cancelled");
      expect(onCancel).toHaveBeenCalledWith("booking-001");
    });
  });
});