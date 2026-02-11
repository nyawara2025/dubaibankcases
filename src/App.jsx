import IncidentDashboard from './components/IncidentDashboard/IncidentDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-900 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Bank Security Incident Manager</h1>
      </nav>
      <main>
        <IncidentDashboard />
      </main>
    </div>
  );
}

export default App;
