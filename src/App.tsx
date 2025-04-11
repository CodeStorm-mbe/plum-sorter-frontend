// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import des pages
import HomePage from './pages/HomePage';
import PredictionPage from './pages/PredictionPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';

// Import des styles
import './styles/globals.css';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
