import { useEffect, useState } from 'react';
import apiClient from '../../utils/apiClient';
import { API_CONFIG } from '../../config/apiConfig';
import Chat from '../Chat';

export default function Dashboard() {
  // --- AUTHENTICATION & UI STATE ---
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('incidents');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- DASHBOARD DATA STATE ---
  const [incidents, setIncidents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    case_no: '',
    date_of_incident: '',
    outcome: '',
    status: 'Open',
    incident_type: '',
    channel: '',
    description: '',
    amount_involved: '',
    amount_recovered: '',
    amount_lost: '',
    branch: ''
  });

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
    window.location.href = '/login';
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

  // --- REPORT EXPORT LOGIC ---
  const exportCSV = () => {
    const headers = "Case No,Date,Type,Channel,Outcome,Involved,Recovered,Lost,Branch\n";
    const csvContent = incidents.map(i => 
      `${i.case_no},${i.date_of_incident},${i.incident_type},${i.channel},${i.outcome},${i.amount_involved},${i.amount_recovered},${i.amount_lost},${i.branch}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SOC_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportPDF = async () => {
    // This triggers your n8n PDF generation webhook
    try {
      const response = await apiClient.post('https://n8n.tenear.com/webhook/generate-pdf', { data: incidents }, { responseType: 'blob' });
      
      // 2. Create a local "Virtual URL" for the file data n8n just sent
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
    
      // 3. Open that virtual URL in a new tab
      window.open(url, '_blank');

      // 4. Clean up the memory after a short delay
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      
    } catch (err) {
      alert("PDF generation failed. Check n8n connection.");
    }
  };

  // --- FORM HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await apiClient.post('https://n8n.tenear.com/webhook/input-bank-incident', formData);
      
      // Reset form
      setFormData({
        case_no: '', date_of_incident: '', outcome: '', incident_type: '',
        channel: '', description: '', amount_involved: '', amount_recovered: '',
        amount_lost: '', branch: ''
      });
      
      setIsModalOpen(false);
      fetchIncidents();
      alert("Incident Logged Successfully!");
      
    } catch (err) {
      console.error("Submission error", err);
      alert("Failed to log incident. Please check n8n connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* SIDEBAR - Fixed for Mobile & Desktop */}
      <aside className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 z-50 md:relative md:flex md:w-64 md:border-r md:border-t-0 flex-row md:flex-col h-16 md:h-screen">
        <nav className="flex flex-row md:flex-col w-full justify-around md:justify-start p-2 md:p-4 md:space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-4 px-3 py-2 rounded-xl transition-all ${
                activeTab === item.id ? 'text-indigo-400' : 'text-slate-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full min-h-screen">
        {activeTab === 'incidents' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <header className="w-full mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight italic uppercase">Security Incidents</h2>
                <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-1">
                  {user?.name || 'OPERATOR'} • ACTIVE COMMAND SESSION
                </p>
              </div>
              
              <div className="flex gap-3">
                <button 
                   onClick={exportCSV}
                   className="px-4 py-2 border border-slate-700 rounded-lg text-[10px] font-bold text-black uppercase hover:bg-slate-800 transition-colors"
                >
                  Export CSV
                </button>
                <button 
                   onClick={() => setIsModalOpen(true)}
                   className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                  + Log Incident
                </button>
              </div>
            </header>

            {/* STATS */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard icon="🚨" label="Active Alerts" count={incidents.length} />
              <StatCard icon="🔥" label="Critical" count={incidents.filter(i => i.severity === 'Critical').length} />
              <StatCard icon="🛡️" label="Shield Status" count="98%" />
              <button onClick={exportPDF} className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-3xl text-left hover:bg-indigo-900/30 transition-all">
                <div className="text-xl mb-2">📄</div>
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Generate PDF Report</div>
              </button>
            </div>

            {/* TABLE */}
            <div className="w-full bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="px-8 py-6 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/20">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400/70">Encrypted Incident Logs</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-950/30 text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="p-4 pl-8">Case No</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Channel</th>
                      <th className="p-4 text-right pr-8">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {loading ? (
                      <tr><td colSpan="4" className="p-10 text-center animate-pulse uppercase text-[10px]">Decrypting...</td></tr>
                    ) : incidents.length > 0 ? (
                      incidents.map((incident) => (
                        <tr key={incident.id} className="hover:bg-slate-800/20 transition-colors group">
                          <td className="p-4 pl-8 text-xs font-mono text-indigo-400">{incident.case_no}</td>
                          <td className="p-4 text-xs font-bold text-white uppercase">{incident.incident_type}</td>
                          <td className="p-4 text-[10px] text-slate-500 uppercase">{incident.channel}</td>
                          <td className="p-4 text-right pr-8 text-xs font-bold text-emerald-400">KES {incident.amount_involved}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="p-10 text-center text-slate-600 text-xs italic">No security breaches detected...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'chat' ? (
          <div className="flex-1 w-full"><Chat /></div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-600 uppercase tracking-widest text-[10px]">Module Offline</div>
        )}
      </main>

      {/* INPUT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-white font-black italic uppercase tracking-tighter text-xl">Log Security Incident</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Case Number</label>
                <input required name="case_no" value={formData.case_no} onChange={handleInputChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. CASE-990" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Incident Date</label>
                <input required type="date" name="date_of_incident" value={formData.date_of_incident} onChange={handleInputChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Incident Type</label>
                <select name="incident_type" value={formData.incident_type} onChange={handleInputChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none">
                  <option value="">Select Type</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Phishing">Phishing</option>
                  <option value="Internal">Internal Breach</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Channel</label>
                <input name="channel" value={formData.channel} onChange={handleInputChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="e.g. Mobile App" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Amount Involved</label>
                <input type="number" name="amount_involved" value={formData.amount_involved} onChange={handleInputChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Amount Recovered</label>
                <input type="number" name="amount_recovered" value={formData.amount_recovered} onChange={handleInputChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Case Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Outcome Text Input (Full Width) */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Case Outcome</label>
                <input 
                  name="outcome" 
                  value={formData.outcome} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" 
                  placeholder="Brief summary of resolution..." 
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Description</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleInputChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm" placeholder="Detail the breach..."></textarea>
              </div>
              <button 
                disabled={submitting}
                type="submit" 
                className="md:col-span-2 bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
              >
                {submitting ? 'Transmitting Data...' : 'Authorize & Log Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, count }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-sm">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</div>
      <div className="text-3xl font-black text-white italic">{count}</div>
    </div>
  );
}
