import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './services/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import History from './pages/History';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

const AppContent = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('atm_dark') === 'true'
  );

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('atm_dark', next);
      return next;
    });
  };

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      {user && (
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login darkMode={darkMode} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <Signup darkMode={darkMode} />}
        />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard darkMode={darkMode} /></ProtectedRoute>
        } />
        <Route path="/deposit" element={
          <ProtectedRoute><Deposit darkMode={darkMode} /></ProtectedRoute>
        } />
        <Route path="/withdraw" element={
          <ProtectedRoute><Withdraw darkMode={darkMode} /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute><History darkMode={darkMode} /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile darkMode={darkMode} /></ProtectedRoute>
        } />
        <Route path="/change-password" element={
          <ProtectedRoute><ChangePassword darkMode={darkMode} /></ProtectedRoute>
        } />

        {/* Default redirects */}
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
