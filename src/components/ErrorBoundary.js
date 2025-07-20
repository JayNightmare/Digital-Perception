// src/components/ErrorBoundary.js
import React from "react";
import styled from "styled-components";

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    padding: 2rem;
    text-align: center;
    background: var(--secondary-color);
    border-radius: 8px;
    margin: 2rem;
    border: 1px solid #333;
`;

const ErrorTitle = styled.h2`
    color: #ff6b6b;
    margin-bottom: 1rem;
    font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
    color: var(--text-color);
    margin-bottom: 1.5rem;
    line-height: 1.6;
    max-width: 600px;
`;

const ErrorButton = styled.button`
    background: #61dafb;
    color: #000;
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background: #4fa8c5;
    }
`;

const ErrorDetails = styled.details`
    margin-top: 1rem;
    text-align: left;
    background: #1a1a1a;
    padding: 1rem;
    border-radius: 4px;
    color: #ccc;
    font-family: "Courier New", monospace;
    font-size: 0.9rem;
    max-width: 100%;
    overflow-x: auto;
`;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error details
        console.error("ErrorBoundary caught an error:", error);
        console.error("Error info:", errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
    }

    handleReload = () => {
        // Reset the error state and reload the page
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    handleReset = () => {
        // Just reset the error state without reloading
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorContainer>
                    <ErrorTitle>🚨 Something went wrong</ErrorTitle>
                    <ErrorMessage>
                        We encountered an unexpected error while loading this
                        component. This might be a temporary issue with the
                        database connection or a problem with the application.
                    </ErrorMessage>

                    <div>
                        <ErrorButton
                            onClick={this.handleReset}
                            style={{ marginRight: "1rem" }}
                        >
                            Try Again
                        </ErrorButton>
                        <ErrorButton onClick={this.handleReload}>
                            Reload Page
                        </ErrorButton>
                    </div>

                    {process.env.NODE_ENV === "development" &&
                        this.state.error && (
                            <ErrorDetails>
                                <summary>
                                    Error Details (Development Only)
                                </summary>
                                <div>
                                    <strong>Error:</strong>{" "}
                                    {this.state.error.toString()}
                                </div>
                                <div>
                                    <strong>Stack Trace:</strong>
                                    <pre>
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            </ErrorDetails>
                        )}
                </ErrorContainer>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
