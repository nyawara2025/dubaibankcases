import { useEffect, useState } from 'react';
import apiClient from '../../utils/apiClient';
import { API_CONFIG } from '../../config/apiConfig';

export default function Dashboard() {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // --- DASHBOARD STATE ---
  const [incidents, setIncidents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

   // Check for existing session on load safely
  useEffect(() => {
    const savedUser = localStorage.getItem('soc_user');
    const token = localStorage.getItem('soc_token');
    
    // Check if the items exist AND are not the literal string "undefined"
    if (savedUser && savedUser !== "undefined" && token && token !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Corrupt session data found, clearing storage.");
        localStorage.removeItem('soc_user');
        localStorage.removeItem('soc_token');
      }
    }
  }, []);

  // Fetch incidents only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchIncidents();
    }
  }, [isAuthenticated]);

  async function handleLogin(e) {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');

    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
        username: loginData.username,
        password: loginData.password
      });

      // Expected response from n8n: { token: '...', user: { name: '...', role: 'admin' } }
      const { token, user } = response.data;
      
      localStorage.setItem('soc_token', token);
      localStorage.setItem('soc_user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthError(err.response?.data?.message || 'ACCESS DENIED: UNAUTHORIZED');
    } finally {
      setIsAuthLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('soc_token');
    localStorage.removeItem('soc_user');
    setIsAuthenticated(false);
    setUser(null);
  }

  async function fetchIncidents() {
    setLoading(true);
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.FETCH_INCIDENTS);
      const data = Array.isArray(response.data) ? response.data : [];
      setIncidents(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }

  // --- RENDER LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white italic tracking-tighter">
              SOC <span className="text-indigo-500">COMMAND</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Restricted Access Terminal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Operator ID" 
              required
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all"
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
            />
            <input 
              type="password" 
              placeholder="Access Key" 
              required
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all"
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            />
            {authError && <p className="text-rose-500 text-[10px] font-black text-center uppercase tracking-widest">{authError}</p>}
            <button 
              disabled={isAuthLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-4 rounded-2xl shadow-lg shadow-indigo-950/50 transition-all disabled:opacity-50"
            >
              {isAuthLoading ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD VIEW ---
  return (
    <div className="min-h-screen text-sm bg-[#020617] text-slate-300 p-4 md:p-10 font-sans selection:bg-indigo-500/30">
      
      <header className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight italic">
            SOC <span className="text-indigo-500">COMMAND</span>
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-slate-500 tracking-[0.2em] uppercase">
            {user?.name || 'Operator'} • {user?.role?.toUpperCase()} FEED
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {/* RBAC: Only show Add Incident for non-viewers */}
          {user?.role !== 'viewer' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-950/50 transition-all"
            >
              ➕ Log Incident
            </button>
          )}
          <button onClick={handleLogout} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
        <StatCard icon="🚨" label="Active" count={incidents.length} />
        <StatCard icon="🔥" label="Critical" count={incidents.filter(i => i.severity === 'Critical').length} />
        <StatCard icon="🛡️" label="Network Health" count="98%" className="col-span-2 md:col-span-1" />
      </div>

      <div className="max-w-5xl mx-auto bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/20">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Incident Logs</h2>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div className="divide-y divide-slate-800/40">
          {loading ? (
            <div className="p-10 text-center text-slate-600 animate-pulse text-xs uppercase tracking-widest">Scanning encrypted logs...</div>
          ) : incidents.length > 0 ? (
            incidents.map((incident) => <IncidentRow key={incident.id} incident={incident} />)
          ) : (
            <div className="p-10 text-center text-slate-600 text-sm italic">No incidents reported...</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 border-t md:border border-slate-800 rounded-t-[2rem] md:rounded-[2rem] w-full max-w-md p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Report Incident</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-xl text-slate-500 hover:text-white">✕</button>
            </div>
            <form className="space-y-4">
              <input className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm text-white outline-none focus:border-indigo-500" placeholder="Incident Title" />
              <div className="grid grid-cols-2 gap-3">
                <select className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm text-slate-400 outline-none">
                  <option>Severity</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                </select>
                <select className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm text-slate-400 outline-none">
                  <option>Status</option>
                  <option>Open</option>
                  <option>Investigating</option>
                </select>
              </div>
              <button className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold text-sm mt-2 hover:bg-indigo-500 shadow-xl transition-all active:scale-95">
                SEND ALERT
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, count, className = "" }) {
  return (
    <div className={`bg-slate-900/60 p-4 md:p-6 rounded-2xl border border-slate-800/50 flex items-center gap-4 ${className}`}>
      <span className="text-2xl md:text-3xl">{icon}</span>
      <div>
        <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-xl md:text-2xl font-bold text-white leading-none">{count}</p>
      </div>
    </div>
  );
}

function IncidentRow({ incident }) {
  const sevMap = { Critical: '💀', High: '🟠', Medium: '🔵', Low: '⚪' };
  return (
    <div className="p-4 md:p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
      <div className="flex items-center gap-4">
        <span className="text-lg">{sevMap[incident.severity] || '🔹'}</span>
        <div>
          <h4 className="text-sm md:text-base font-bold text-slate-200 line-clamp-1">{incident.title}</h4>
          <p className="text-[10px] text-slate-500 font-medium">
             {incident.created_at ? new Date(incident.created_at).toLocaleDateString() : 'Recent'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-8">
        <span className="hidden md:inline text-[9px] font-black text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded bg-indigo-500/10 uppercase tracking-widest">
          {incident.severity}
        </span>
        <div className="text-right">
          <p className="text-[9px] font-bold text-slate-600 uppercase">Status</p>
          <p className="text-xs font-bold text-slate-400">{incident.status}</p>
        </div>
      </div>
    </div>
  );
}
