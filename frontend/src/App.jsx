import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import SubmitPage from './pages/SubmitPage';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { pingBackend } from './lib/api';
import './styles/globals.css';

export default function App() {
  // Wake up the Render backend the moment the user lands on any page.
  // This eliminates the ~30s cold-start delay when they eventually hit Analyze.
  useEffect(() => {
    pingBackend();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}