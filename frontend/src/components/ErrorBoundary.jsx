import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h2>
                    <p className="text-gray-600 mb-6">We encountered an error while loading this page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
