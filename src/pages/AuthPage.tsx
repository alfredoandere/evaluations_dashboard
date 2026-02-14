import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'signin') {
      const result = await signIn(email, password);
      if (result.error) setError(result.error);
    } else {
      const result = await signUp(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSignupSuccess(true);
      }
    }

    setLoading(false);
  };

  if (signupSuccess) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="bg-surface border border-border rounded-lg p-6 w-80 text-center">
          <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-text-muted mb-4">
            CHECK YOUR EMAIL
          </h2>
          <p className="text-sm text-text-muted mb-4">
            A verification link has been sent to your email. Please verify your email before signing in.
          </p>
          <button
            onClick={() => { setSignupSuccess(false); setMode('signin'); setPassword(''); }}
            className="w-full px-4 py-2 bg-surfaceHighlight border border-border text-text-muted font-mono text-xs rounded hover:bg-surface hover:text-text-main transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background flex items-center justify-center">
      <div className="bg-surface border border-border rounded-lg p-6 w-80">
        <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-text-muted mb-6 text-center">
          EVALS_BIO_2.0
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-background border border-border rounded text-text-main font-mono text-xs placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 bg-background border border-border rounded text-text-main font-mono text-xs placeholder:text-text-dim focus:outline-none focus:border-primary transition-colors"
          />

          {error && (
            <p className="text-xs text-red-400 font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-surfaceHighlight border border-border text-text-muted font-mono text-xs rounded hover:bg-surface hover:text-text-main transition-colors disabled:opacity-50"
          >
            {loading ? '...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
          className="w-full mt-3 text-[10px] font-mono text-text-dim hover:text-text-muted transition-colors text-center"
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
