import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver =
  (globalThis.ResizeObserver as typeof ResizeObserver) || (ResizeObserverStub as unknown as typeof ResizeObserver);

afterEach(() => {
  cleanup();
});