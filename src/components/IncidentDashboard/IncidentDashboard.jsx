import { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, Clock, ShieldAlert, Plus, X } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // FETCHING VIA n8n WEBHOOK
  const FETCH_WEBHOOK_URL = "https://n8n.tenear.com/webhook/bank/incidents"; // Setup a Webhook node in n8n that queries Postgres and returns the result

  useEffect(() => {
    fetchIncidents();
  }, []);

  async function fetchIncidents() {
    try {
      const response = await axios.get(FETCH_WEBHOOK_URL);
      
      // FIX: If response.data is an object, wrap it in []. If it's already an array, keep it.
      const data = Array.isArray(response.data) 
        ? response.data 
        : (response.data ? [response.data] : []);

      setIncidents(data);
    } catch (err) {
      console.error("n8n Fetch Error:", err);
      setIncidents([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      {/* HEADER SECTION */}
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Security Command Center</h1>
          <p className="text-slate-500 font-medium mt-1">Central Bank Incident Management System</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
        >
          <Plus size={20}/> Log New Incident
        </button>
      </header>

      {/* STAT CARDS - Visual "Whistles" */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<AlertTriangle className="text-orange-500" />} label="Active Cases" count={incidents.length} color="orange" />
        <StatCard icon={<ShieldAlert className="text-red-500" />} label="Critical Threats" count={incidents.filter(i => i.severity === 'Critical').length} color="red" />
        <StatCard icon={<ShieldCheck className="text-emerald-500" />} label="Compliance Score" count="98%" color="emerald" />
      </div>

      {/* RECENT INCIDENTS CARD */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <h2 className="text-lg font-bold text-slate-700">Live Incident Feed</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {incidents.map((incident) => (
            <IncidentRow key={incident.id} incident={incident} />
          ))}
        </div>
      </div>

      {/* NEW INCIDENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Report New Case</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X/></button>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Incident Title</label>
                <input className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Unauthorized Database Access" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Severity</label>
                  <select className="w-full p-3 rounded-xl border border-slate-200">
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Status</label>
                  <select className="w-full p-3 rounded-xl border border-slate-200">
                    <option>Open</option><option>In-Progress</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold mt-4 hover:bg-black transition-colors">
                Submit Report to Bank Security
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, count, color }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
      <div className={`p-4 rounded-2xl bg-${color}-50`}>{icon}</div>
      <div>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-black">{count}</p>
      </div>
    </div>
  );
}

function IncidentRow({ incident }) {
  const sevColors = { Critical: 'bg-red-500', High: 'bg-orange-500', Medium: 'bg-blue-500', Low: 'bg-slate-400' };
  return (
    <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`h-12 w-1 w-1 rounded-full ${sevColors[incident.severity]}`}></div>
        <div>
          <h4 className="font-bold text-slate-800 text-lg">{incident.title}</h4>
          <span className="text-sm text-slate-400 font-medium italic">{new Date(incident.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <span className={`px-4 py-1.5 rounded-lg text-white text-xs font-black uppercase tracking-widest ${sevColors[incident.severity]}`}>
          {incident.severity}
        </span>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-300 uppercase">Status</p>
          <p className="font-bold text-slate-600">{incident.status}</p>
        </div>
      </div>
    </div>
  );
}
