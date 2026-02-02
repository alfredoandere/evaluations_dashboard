import { useState, useEffect, useRef } from 'react';

const CORRECT_PASSWORD = 'evaluations';
const STORAGE_KEY = 'eval_dashboard_auth';

interface PasswordModalProps {
  onAuthenticated: () => void;
}

export default function PasswordModal({ onAuthenticated }: PasswordModalProps) {
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if already authenticated on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'authenticated') {
      onAuthenticated();
    }
    setIsChecking(false);
  }, [onAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const password = inputRef.current?.value || '';
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'authenticated');
      onAuthenticated();
    } else {
      setError(true);
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
    }
  };

  // Don't render anything while checking localStorage
  if (isChecking) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface border border-border rounded-lg p-6 w-80 shadow-2xl">
        <h2 className="text-lg font-mono font-bold text-text-main mb-4 text-center">
          🔒 EVALS_BIO_2.0
        </h2>
        <p className="text-text-muted text-sm mb-4 text-center">
          Enter password to access dashboard
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            placeholder="Password"
            className={`w-full px-3 py-2 bg-background border rounded font-mono text-sm text-text-main placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              error ? 'border-red-500' : 'border-border'
            }`}
            autoFocus
            onChange={() => setError(false)}
          />
          {error && (
            <p className="text-red-500 text-xs mt-2 text-center">
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-primary text-white font-mono text-sm rounded hover:bg-primary/90 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

// Helper to check auth status (for use elsewhere if needed)
export function isAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'authenticated';
}

// Helper to logout (for use elsewhere if needed)
export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}
