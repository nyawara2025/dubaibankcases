import IncidentDashboard from './components/IncidentDashboard/IncidentDashboard';

function App() {
  return (
    <div className="min-h-screen text-sm bg-gray-100">
      <nav className="bg-blue-900 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Dubai International Bank</h1>
        <h2 className="text-x1 font-bold">Security Case Management</h2>
      </nav>
      <main>
        <IncidentDashboard />
      </main>
    </div>
  );
}

export default App;
