import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotificationFeed from "../NotificationFeed";
import { trpc } from "@/lib/trpc";

// Mock trpc
vi.mock("@/lib/trpc", () => ({
  trpc: {
    notifications: {
      getByJobId: {
        useQuery: vi.fn(),
      },
      delete: {
        useMutation: vi.fn(),
      },
    },
  },
}));

describe("NotificationFeed Component", () => {
  it("should render loading state", () => {
    vi.mocked(trpc.notifications.getByJobId.useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NotificationFeed jobId={1} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render empty state when no notifications", () => {
    vi.mocked(trpc.notifications.getByJobId.useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NotificationFeed jobId={1} />);
    expect(screen.getByText(/no notifications yet/i)).toBeInTheDocument();
  });

  it("should render notifications when data is available", () => {
    const mockNotifications = [
      {
        id: 1,
        jobId: 1,
        type: "status_change",
        subject: "Repair Status Updated",
        message: "Your device is now in Diagnosing stage",
        createdAt: new Date(),
      },
    ];

    vi.mocked(trpc.notifications.getByJobId.useQuery).mockReturnValue({
      data: mockNotifications,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NotificationFeed jobId={1} />);
    expect(screen.getByText("Repair Status Updated")).toBeInTheDocument();
  });
});
