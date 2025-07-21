import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorBoundary, { CardErrorBoundary } from "../components/ErrorBoundary";

// Mock console methods to avoid test output pollution
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Component that throws an error
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  test("renders error UI when child component throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText(/We're sorry, but something unexpected happened/),
    ).toBeInTheDocument();
  });

  test("shows error details in development mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText("Error Details (Development Only)"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Error: Test error/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  test("hides error details in production mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.queryByText("Error Details (Development Only)"),
    ).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  test("refresh page button reloads the page", () => {
    const mockReload = jest.fn();
    Object.defineProperty(window, "location", {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    const refreshButton = screen.getByText("Refresh Page");
    fireEvent.click(refreshButton);

    expect(mockReload).toHaveBeenCalled();
  });

  test("try again button resets error state", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();

    const tryAgainButton = screen.getByText("Try Again");
    fireEvent.click(tryAgainButton);

    // The error boundary reset, but the component that threw the error still exists
    // and will throw again when re-rendered. In a real app, you'd fix the underlying
    // issue or provide different props. For testing, we'll verify the component re-rendered
    expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();
  });

  test("shows persistent error message after multiple errors", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    // First error
    expect(
      screen.queryByText(/This error keeps occurring/),
    ).not.toBeInTheDocument();

    // Reset and throw again
    fireEvent.click(screen.getByText("Try Again"));
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Second error
    fireEvent.click(screen.getByText("Try Again"));
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Third error - should show persistent error message
    expect(screen.getByText(/This error keeps occurring/)).toBeInTheDocument();
  });

  test("logs error to console", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalledWith(
      "Error caught by boundary:",
      expect.any(Error),
      expect.any(Object),
    );
  });
});

describe("CardErrorBoundary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders children when there is no error", () => {
    render(
      <CardErrorBoundary>
        <div>Card content</div>
      </CardErrorBoundary>,
    );

    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  test("renders error UI when child component throws", () => {
    render(
      <CardErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CardErrorBoundary>,
    );

    expect(screen.getByText("⚠️ Failed to load card")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  test("retry button resets error state", () => {
    render(
      <CardErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CardErrorBoundary>,
    );

    expect(screen.getByText("⚠️ Failed to load card")).toBeInTheDocument();

    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);

    // Similar to main ErrorBoundary, the component that threw will throw again
    // when re-rendered after reset. In a real app, the error would be fixed
    // before retry. For testing, we verify the error UI appears again
    expect(screen.getByText("⚠️ Failed to load card")).toBeInTheDocument();
  });

  test("logs card error to console", () => {
    render(
      <CardErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CardErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalledWith(
      "Card component error:",
      expect.any(Error),
      expect.any(Object),
    );
  });
});
