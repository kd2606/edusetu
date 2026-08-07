'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center gap-4 text-center p-8">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--danger)/0.1)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[hsl(var(--danger))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))] mb-1">Something went wrong</h3>
            <p className="text-sm text-[hsl(var(--text-secondary))] max-w-md">
              The roadmap failed to render. This might be caused by an unusual layout. Please try generating a new roadmap.
            </p>
          </div>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-5 py-2 text-white shadow-glow-sm text-sm font-medium rounded-lg active:scale-[0.98] transition-all"
            style={{ background: 'var(--grad-btn)' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
