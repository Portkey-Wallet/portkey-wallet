import React, { Component } from 'react';

interface ErrorBoundaryProps {
  message?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

const whiteSpace = 'pre-wrap';

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  {
    error?: Error | null;
    info: any;
  }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, info: null };
  }

  // static getDerivedStateFromError(error:any) {
  //   // Update state so the next render will show the fallback UI.
  //   return { error: error };
  // }

  componentDidCatch(error: Error | null, info: any) {
    // Display fallback UI
    this.setState({ error, info });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: whiteSpace }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.info.componentStack}
          </details>
        </>
      );
    }
    return this.props.children;
  }
}
