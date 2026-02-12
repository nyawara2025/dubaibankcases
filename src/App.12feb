import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import IncidentDashboard from './components/IncidentDashboard/IncidentDashboard';
import Login from './pages/Login'; // Create this component

// Higher-order component to protect routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('soc_token');
  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-sm bg-gray-100">
        <nav className="bg-blue-900 text-white p-4 shadow-md">
          <h1 className="text-xl font-bold">Dubai International Bank</h1>
          <h2 className="text-xl font-bold">Security Case Management</h2>
        </nav>
        <main>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Route */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <IncidentDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
