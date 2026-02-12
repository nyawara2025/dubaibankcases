import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, Users, Bell, LogOut, ShieldAlert, Search, Lock } from 'lucide-react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [incidentText, setIncidentText] = useState("");

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl border-t-8 border-[#003366]">
          <div className="flex flex-col items-center mb-8">
            <ShieldAlert className="w-16 h-16 text-[#003366] mb-2" />
            <h1 className="text-2xl font-black text-center text-[#003366]">Dubai International Bank</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Security Portal</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <input type="text" required className="w-full p-3 border-2 border-gray-400 rounded-lg text-black font-medium" placeholder="Employee ID" />
            <input type="password" required className="w-full p-3 border-2 border-gray-400 rounded-lg text-black font-medium" placeholder="Security Key" />
            <button type="submit" className="w-full bg-[#003366] text-white py-4 rounded-lg font-black text-lg shadow-lg flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" /> ACCESS DASHBOARD
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-[#003366] text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-yellow-400" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Dubai International Bank</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold border-2 border-white">
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 pb-24">
        <h2 className="text-2xl font-extrabold text-slate-800 border-b-4 border-[#003366] inline-block pb-1 mb-6">Security Incident Dashboard</h2>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 mb-8">
          <label className="block text-lg font-bold text-gray-900 mb-3">Report New Security Incident</label>
          <textarea value={incidentText} onChange={(e) => setIncidentText(e.target.value)} placeholder="Start typing incident details here..." className="w-full p-4 text-lg border-2 border-gray-600 rounded-lg bg-gray-50 text-black outline-none min-h-[150px] font-medium" />
          <button className="mt-4 w-full md:w-auto bg-[#003366] text-white px-8 py-3 rounded-lg font-black shadow-lg">SUBMIT REPORT</button>
        </div>

        {/* Hardcoded stats to prevent array truncation errors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm text-center">
            <p className="text-3xl font-black text-blue-700">12</p>
            <p className="text-sm font-bold text-gray-600 uppercase">Active</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm text-center">
            <p className="text-3xl font-black text-orange-600">5</p>
            <p className="text-sm font-bold text-gray-600 uppercase">Pending</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm text-center">
            <p className="text-3xl font-black text-green-600">48</p>
            <p className="text-sm font-bold text-gray-600 uppercase">Resolved</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm text-center">
            <p className="text-3xl font-black text-red-600">2</p>
            <p className="text-sm font-bold text-gray-600 uppercase">Urgent</p>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center max-w-2xl mx-auto h-20">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <MessageSquare size={24} />
            <span className="text-[11px] font-black uppercase">Chat</span>
          </div>
          <div className="flex flex-col items-center justify-center text-[#003366] border-t-4 border-[#003366]">
            <AlertTriangle size={24} />
            <span className="text-[11px] font-black uppercase">Incidents</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Users size={24} />
            <span className="text-[11px] font-black uppercase">Meetings</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Bell size={24} />
            <span className="text-[11px] font-black uppercase">Notices</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Search size={24} />
            <span className="text-[11px] font-black uppercase">Search</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default App;
