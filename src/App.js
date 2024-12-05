import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import DayPage from './components/Calendar/DayPage';
import { getUserRole } from './services/authService';
import "../node_modules/tw-elements/css/tw-elements.min.css";
import "../node_modules/tw-elements/js/tw-elements.es.min.js";
import { AuthProvider } from "./components/Auth/AuthContex";
import ProtectedRoute from "./components/ProtectRoute"; // Keep the imported ProtectedRoute

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/day"
            element={
              <ProtectedRoute>
                <DayPage />
              </ProtectedRoute>
            }
          />
        </Routes>
    </AuthProvider>
  );
}

export default App;
