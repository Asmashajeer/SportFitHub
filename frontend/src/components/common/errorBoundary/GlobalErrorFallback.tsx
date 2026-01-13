// GlobalErrorFallback.tsx
import type { FallbackProps } from 'react-error-boundary';

export function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Oops! Something went wrong.</h1>
      <p style={{ color: 'red' }}>{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        Try Again / Clear Error
      </button>
    </div>
  );
}