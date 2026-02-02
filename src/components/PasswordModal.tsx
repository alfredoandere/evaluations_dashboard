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

  if (isChecking) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="bg-surface border border-border rounded-lg p-6 w-72">
        <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-text-muted mb-6 text-center">
          EVALS_BIO_2.0
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            placeholder="Password"
            className={`w-full px-3 py-2 bg-background border rounded font-mono text-sm text-text-main placeholder:text-text-dim focus:outline-none focus:border-text-muted ${
              error ? 'border-red-500' : 'border-border'
            }`}
            autoFocus
            onChange={() => setError(false)}
          />
          {error && (
            <p className="text-red-500 text-[10px] font-mono mt-2 text-center">
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-surfaceHighlight border border-border text-text-muted font-mono text-xs rounded hover:bg-surface hover:text-text-main transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'authenticated';
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}
