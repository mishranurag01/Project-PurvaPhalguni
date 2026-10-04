import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Purva Phalguni application:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E2D8] p-8 shadow-sm text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#FAF3E3] text-[#C59B4B] mx-auto flex items-center justify-center font-serif text-2xl font-bold">
              ✦
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold text-[#0F172A]">
                Sanctuary Pacing Re-centering
              </h1>
              <p className="text-xs text-[#526071] leading-relaxed">
                The celestial interface encountered an unexpected state. You can reload the sanctuary or reset session state.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#FCFBF9] rounded-xl border border-[#E8E2D8] text-left text-[11px] font-mono text-[#78716C] max-h-32 overflow-y-auto">
                <span className="font-bold text-red-700 block mb-1">Notice:</span>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-2.5 bg-[#0F172A] text-white rounded-xl text-xs font-semibold hover:bg-[#1E293B] transition-colors"
              >
                Reload Sanctuary
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2.5 bg-[#FAF3E3] text-[#7A5B20] border border-[#C59B4B]/30 rounded-xl text-xs font-semibold hover:bg-[#F3E7CA] transition-colors"
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
