import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Loader2 } from 'lucide-react';
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
        password: credentials.password,
        timestamp: new Date().toISOString()
      });

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
    /* FIXED: Added w-screen and ensured flex-col for mobile stacking */
    <div className="min-h-screen w-screen bg-[#020617] flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
      
      {/* Background Decorative Elements (Optional: adds to the SOC feel) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[400px] animate-in fade-in zoom-in duration-500">
        
        {/* LOGO AREA */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <ShieldAlert className="w-16 h-16 text-indigo-500 mb-4 animate-pulse" />
            <div className="absolute -inset-1 bg-indigo-500/20 blur-xl rounded-full"></div>
          </div>
          <h1 className="text-3xl font-black text-center text-white italic uppercase tracking-tighter">
            DIB <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">SECURE</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-2">Command Access Point</p>
        </div>

        {/* LOGIN FORM */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-950/20">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity</label>
              <input
                type="text"
                name="username"
                placeholder="OPERATOR ID"
                className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white font-bold placeholder:text-slate-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white font-bold placeholder:text-slate-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                onChange={handleInputChange}
                required
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                <p className="text-rose-500 text-[10px] font-black uppercase text-center tracking-widest">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-4 rounded-2xl font-black tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-950/50 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Lock size={18} className="group-hover:rotate-12 transition-transform" /> 
                  <span className="uppercase italic">Authorize</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <p className="text-center mt-8 text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          Classified Information • Terminal ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default Login;
