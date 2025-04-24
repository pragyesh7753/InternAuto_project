import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4 gradient-bg">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/20 max-w-lg w-full text-center">
            <FaExclamationTriangle className="text-red-400 text-5xl mx-auto mb-4" />
            <h1 className="text-white text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-white/80 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            <div className="bg-black/20 rounded-lg p-4 mb-4 overflow-x-auto text-left">
              <p className="text-red-300 font-mono text-sm break-words">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-red-500 hover:bg-white/90 py-2 px-6 rounded-lg font-semibold transition-all flex items-center gap-2 mx-auto"
            >
              <FaRedo /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
