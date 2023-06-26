import { Component, ReactNode } from 'react';

export declare type FallbackRender = (errorData: {
  error: Error;
  componentStack: string | null;
  resetError(): void;
}) => React.ReactElement;

export type ReactErrorBoundaryProps = {
  children: ReactNode;
  fallback: FallbackRender;
  onError?(error: Error, componentStack: string): void;
};

export type ErrorBoundaryTrue = {
  hasError: true;
  error: Error;
  componentStack: string;
};

export type ErrorBoundaryFalse = {
  hasError: false;
};
export default class ReactErrorBoundary extends Component<
  ReactErrorBoundaryProps,
  ErrorBoundaryTrue | ErrorBoundaryFalse
> {
  constructor(props: Readonly<ReactErrorBoundaryProps>) {
    super(props);
    this.state = { hasError: false };
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, componentStack: undefined });
  };

  componentDidCatch(error: Error & { cause?: Error }, { componentStack }: React.ErrorInfo) {
    this.setState({ hasError: true, error, componentStack });
    this.props.onError?.(error, componentStack);
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback({
        error: this.state.error,
        componentStack: this.state.componentStack,
        resetError: this.resetError,
      });
    }
    return this.props.children;
  }
}

export function handleReportError({
  error,
  componentStack,
  view,
}: Omit<ErrorBoundaryTrue, 'hasError'> & {
  view: string;
}) {
  const message = error.toString();
  const sendError = new Error(message);
  sendError.stack = componentStack || '';
  sendError.name = `Message:${message}, View:${view}`;
  return sendError;
}
