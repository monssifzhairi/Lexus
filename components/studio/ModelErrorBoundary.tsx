"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  onError: () => void;
  fallback?: ReactNode;
};

type State = { failed: boolean };

/** Catches GLB load failures (suspense rejects) so the page degrades gracefully. */
export class ModelErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[NOIR] 3D scene failed:", error.message, info.componentStack);
    }
    this.props.onError();
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
