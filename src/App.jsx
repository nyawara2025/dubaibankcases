import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import IncidentDashboard from './components/IncidentDashboard/IncidentDashboard';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('soc_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      {/* NO GLOBAL NAV HERE - It should only be inside the Dashboard */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
