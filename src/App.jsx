import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // Path to your Login file
import IncidentDashboard from './components/IncidentDashboard/IncidentDashboard';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('soc_token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <IncidentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
