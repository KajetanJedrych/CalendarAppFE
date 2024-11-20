import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import DayPage from './components/Calendar/DayPage';
import { getUserRole } from './services/authService';
import "../node_modules/tw-elements/css/tw-elements.min.css";
import "../node_modules/tw-elements/js/tw-elements.es.min.js";

function ProtectedRoute({ children, role }) {
  const userRole = getUserRole();
  if (!userRole || (role && userRole !== role)) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/day" element={<DayPage />} />
    </Routes>
  );
}

export default App;
