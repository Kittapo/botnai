"use client";

import React, { Component, type ReactNode } from "react";
import { useUiStore } from "@/store/ui";

interface BoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface BoundaryState {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    useUiStore.getState().setWebglFallback(true);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

export function CssFallbackScene() {
  return null;
}
