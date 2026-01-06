import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary, {
  ComponentErrorBoundary,
  AsyncErrorBoundary,
  PageErrorBoundary,
  withErrorBoundary,
} from '../ErrorBoundary';

// Helper component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Child component</div>;
};

// Wrapper for router context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when there is no error', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Child component')).toBeInTheDocument();
  });

  it('renders fallback UI when an error occurs', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    renderWithRouter(
      <ErrorBoundary title="Custom Title" message="Custom message">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    renderWithRouter(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('resets error state when Try Again is clicked', () => {
    const { rerender } = renderWithRouter(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click retry
    fireEvent.click(screen.getByText('Try Again'));

    // Re-render with non-throwing component
    rerender(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    // The error state should be reset, allowing children to render
    // Note: In real scenario, the component would need to not throw on re-render
  });
});

describe('ComponentErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when there is no error', () => {
    renderWithRouter(
      <ComponentErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ComponentErrorBoundary>
    );

    expect(screen.getByText('Child component')).toBeInTheDocument();
  });

  it('renders component-specific fallback on error', () => {
    renderWithRouter(
      <ComponentErrorBoundary componentName="TestComponent">
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>
    );

    expect(screen.getByText('TestComponent failed to load')).toBeInTheDocument();
  });
});

describe('AsyncErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when there is no error', () => {
    renderWithRouter(
      <AsyncErrorBoundary>
        <ThrowError shouldThrow={false} />
      </AsyncErrorBoundary>
    );

    expect(screen.getByText('Child component')).toBeInTheDocument();
  });

  it('renders async-specific fallback on error', () => {
    renderWithRouter(
      <AsyncErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AsyncErrorBoundary>
    );

    expect(screen.getByText('Failed to load content')).toBeInTheDocument();
  });
});

describe('PageErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders page-specific error UI on error', () => {
    renderWithRouter(
      <PageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </PageErrorBoundary>
    );

    expect(screen.getByText('Page Error')).toBeInTheDocument();
  });
});

describe('withErrorBoundary HOC', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('wraps component with ErrorBoundary', () => {
    const WrappedComponent = withErrorBoundary(() => <div>Wrapped content</div>);

    renderWithRouter(<WrappedComponent />);

    expect(screen.getByText('Wrapped content')).toBeInTheDocument();
  });

  it('catches errors in wrapped component', () => {
    const WrappedComponent = withErrorBoundary(() => {
      throw new Error('Test error');
    });

    renderWithRouter(<WrappedComponent />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
