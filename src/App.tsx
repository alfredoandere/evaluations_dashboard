import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage';
import GuidePage from './pages/GuidePage';
import AuthPage from './pages/AuthPage';

const ALLOWED_DOMAINS = ['latchbio.com', 'openai.com'];

function App() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-text-dim border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-mono text-text-dim tracking-widest">AUTHENTICATING</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const userEmail = user.email || '';
  const userDomain = userEmail.split('@')[1]?.toLowerCase();
  const isAllowedDomain = ALLOWED_DOMAINS.includes(userDomain);

  if (!isAllowedDomain) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="bg-surface border border-border rounded-lg p-6 w-96 text-center">
          <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-text-muted mb-4">
            ACCESS DENIED
          </h2>
          <p className="text-sm text-text-muted mb-2">
            <span className="text-text-main font-medium">{userEmail}</span> is not authorized.
          </p>
          <p className="text-xs text-text-dim mb-6">
            Only accounts from whitelisted domains can access this dashboard.
          </p>
          <button
            onClick={() => signOut()}
            className="w-full px-4 py-2 bg-surfaceHighlight border border-border text-text-muted font-mono text-xs rounded hover:bg-surface hover:text-text-main transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/guide/oai" element={<GuidePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
