import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import PredictionPage from './pages/PredictionPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary text-white">
                <Navbar />
                <main className="container mx-auto px-4 pb-16">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/prediction" element={<PredictionPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/about" element={<AboutPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
