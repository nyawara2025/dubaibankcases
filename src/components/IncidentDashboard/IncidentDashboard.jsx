import { useEffect, useState } from 'react';
import apiClient from '../../utils/apiClient';
import { API_CONFIG } from '../../config/apiConfig';

export default function Dashboard() {
  // --- AUTHENTICATION & UI STATE ---
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('incidents');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- DASHBOARD DATA STATE ---
  const [incidents, setIncidents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { id: 'incidents', label: 'Security Incidents', icon: '🚨' },
    { id: 'chat', label: 'Secure Chat', icon: '💬' },
    { id: 'meetings', label: 'Briefings', icon: '📅' },
    { id: 'notices', label: 'Directives', icon: '📜' },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('soc_user');
    const token = localStorage.getItem('soc_token');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        fetchIncidents();
      } catch (e) {
        handleLogout();
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('soc_token');
    localStorage.removeItem('soc_user');
    window.location.href = '/login'; // Force a clean redirect
  }

  async function fetchIncidents() {
    setLoading(true);
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.FETCH_INCIDENTS);
      setIncidents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* SIDEBAR NAVIGATION */}
      {/* Fixed: changed w-full to w-20 for mobile, md:w-64 for desktop */}
      <aside className="w-20 md:w-64 border-r border-slate-800/60 bg-slate-900/20 backdrop-blur-md flex flex-col sticky top-0 h-screen">
        <div className="p-6 mb-4 flex flex-col items-center md:items-start">
          {/* Logo: Hidden text on mobile, shown on desktop */}
          <h3 className="hidden md:block text-sm font-black text-white italic">
            SOC <span className="text-indigo-500">COMMAND</span>
          </h3>
          {/* Mobile Icon: Shown on mobile, hidden on desktop */}
          <div className="md:hidden text-2xl font-black text-indigo-500">S</div>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-center md:justify-start gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
                  : 'hover:bg-slate-800/40 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {/* Text: Hidden on mobile, shown on desktop */}
              <span className="hidden md:block font-bold text-xs uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/40">
          <button onClick={handleLogout} className="w-full flex items-center justify-center md:justify-start gap-4 px-4 py-3 text-slate-500 hover:text-rose-400 transition-colors group">
            <span className="group-hover:animate-pulse">🚪</span>
            <span className="hidden md:block font-bold text-xs uppercase tracking-wider">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        {activeTab === 'incidents' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight italic uppercase">Security Incidents</h2>
                <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">
                  {user?.name || 'OPERATOR'} • ACTIVE COMMAND SESSION
                </p>
              </div>
              {user?.role !== 'viewer' && (
                <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full text-xs font-black shadow-lg shadow-indigo-950/50 transition-all uppercase tracking-widest">
                  ➕ Log Incident
                </button>
              )}
            </header>

            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
              <StatCard icon="🚨" label="Active Alerts" count={incidents.length} />
              <StatCard icon="🔥" label="Critical" count={incidents.filter(i => i.severity === 'Critical').length} />
              <StatCard icon="🛡️" label="Shield Status" count="98%" className="col-span-2 md:col-span-1" />
            </div>

            <div className="max-w-5xl mx-auto bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-4 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/20">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Encrypted Incident Logs</h2>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              </div>
              <div className="divide-y divide-slate-800/40">
                {loading ? (
                  <div className="p-10 text-center text-slate-600 animate-pulse text-[10px] font-black uppercase tracking-widest">Decrypting Secure Feed...</div>
                ) : incidents.length > 0 ? (
                  incidents.map((incident) => <IncidentRow key={incident.id} incident={incident} />)
                ) : (
                  <div className="p-10 text-center text-slate-600 text-xs italic">No security breaches detected...</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
             <div className="text-6xl mb-4 opacity-20 italic font-black">OFFLINE</div>
             <p className="text-slate-600 font-bold uppercase tracking-[0.4em] text-[10px]">The {activeTab} module is currently under maintenance</p>
          </div>
        )}
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 border-t md:border border-slate-800 rounded-t-[2rem] md:rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-white font-black italic uppercase tracking-tighter">New Log Entry</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            {/* Form content goes here */}
            <p className="text-slate-500 text-xs mb-6">Enter protocol details to initialize incident report.</p>
            <button className="w-full bg-indigo-600 text-white font-bold p-4 rounded-2xl" onClick={() => setIsModalOpen(false)}>SUBMIT REPORT</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
function StatCard({ icon, label, count, className = "" }) {
  return (
    <div className={`bg-slate-900/40 border border-slate-800/60 p-4 md:p-6 rounded-3xl backdrop-blur-sm ${className}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-black text-white italic">{count}</div>
    </div>
  );
}

function IncidentRow({ incident }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
      <div className="flex items-center gap-4">
        <span className={`h-2 w-2 rounded-full ${incident.severity === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
        <div>
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wide">{incident.title || 'Unknown Protocol'}</div>
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{incident.id} • {incident.timestamp || 'Just Now'}</div>
        </div>
      </div>
      <div className="text-[10px] font-black text-indigo-500 italic uppercase">View Detail</div>
    </div>
  );
}
