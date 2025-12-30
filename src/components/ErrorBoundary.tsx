import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 text-center text-red-500">
                    <h2 className="text-xl font-semibold">Something went wrong 😞</h2>
                    <p>We're unable to load the products at the moment.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
