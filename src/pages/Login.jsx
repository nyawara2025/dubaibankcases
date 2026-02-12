import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Points to your n8n 'Authentication' Webhook
      const response = await apiClient.post('webhook/bank/auth/login', credentials);
      console.log("n8n Response:", response.data);

      if (response.data && response.data.token) {
        localStorage.setItem('soc_token', response.data.token);
        localStorage.setItem('soc_user', JSON.stringify(response.data.user));
        navigate('/'); // Move to Dashboard
      } else {
        setError('Invalid server response. Contact SOC Admin.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white p-8 rounded shadow-2xl w-96 border-t-4 border-blue-900">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Security Portal Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
              onChange={handleInputChange}
              required
            />
          </div>
          {error && <p className="text-red-600 text-xs italic mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white font-bold py-2 rounded hover:bg-blue-800 transition duration-200"
          >
            {loading ? 'Verifying...' : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
