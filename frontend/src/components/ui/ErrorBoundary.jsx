import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-950">
        <div className="mx-auto max-w-3xl rounded-lg border border-rose-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-rose-700">Frontend runtime error</p>
          <h1 className="mt-2 text-2xl font-bold">The app could not render this screen.</h1>
          <pre className="mt-4 overflow-auto rounded-lg bg-slate-950 p-4 text-sm text-white">
            {this.state.error.message}
          </pre>
          <p className="mt-4 text-sm text-slate-600">
            Restart the Vite dev server after code changes and open the app at http://127.0.0.1:5173.
          </p>
        </div>
      </div>
    );
  }
}
