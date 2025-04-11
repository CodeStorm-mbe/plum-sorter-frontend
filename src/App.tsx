"use client"

// App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

// Import des pages
import HomePage from "./pages/HomePage"
import PredictionPage from "./pages/PredictionPage"
import DashboardPage from "./pages/DashboardPage"
import AboutPage from "./pages/AboutPage"

// Import des styles
import "./styles/globals.css"

// Wrapper pour AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation()

  return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AnimatePresence>
  )
}

function App() {
  return (
      <Router>
        <AnimatedRoutes />
      </Router>
  )
}

export default App
