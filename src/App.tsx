import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import GuidePage from './pages/GuidePage';

function App() {
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
