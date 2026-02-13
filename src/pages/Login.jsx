import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock } from 'lucide-react';
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
      const response = await apiClient.post('https://n8n.tenear.com/webhook/bank/auth/login', {
        event: "LOGIN_ATTEMPT",
        user: credentials.username,
        password: credentials.password, // No longer empty
        timestamp: new Date().toISOString()
      });

      // Match the storage expected by IncidentDashboard.jsx
      if (response.data && (response.data.token || response.data.status === 'success')) {
        localStorage.setItem('soc_token', response.data.token || 'authenticated-session');
        localStorage.setItem('soc_user', JSON.stringify({
            name: credentials.username,
            role: response.data.role || 'operator'
        }));
        navigate('/'); 
      } else {
        setError('Access Denied: Invalid Security Key');
      }
    } catch (err) {
      setError('Authentication Server Unreachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <ShieldAlert className="w-16 h-16 text-indigo-500 mb-2" />
          <h1 className="text-xl font-black text-center text-white italic uppercase tracking-tighter">
            SOC <span className="text-indigo-500">COMMAND</span>
          </h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="OPERATOR ID"
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold outline-none focus:border-indigo-500"
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="SECURITY KEY"
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold outline-none focus:border-indigo-500"
            onChange={handleInputChange}
            required
          />
          {error && <p className="text-rose-500 text-[10px] font-black uppercase text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-lg font-black tracking-widest flex items-center justify-center gap-2 transition-all">
            <Lock size={18} /> {loading ? 'VERIFYING...' : 'AUTHORIZE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
