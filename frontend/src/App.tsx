import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Devices } from './pages/Devices';
import { Events } from './pages/Events';
import { Alerts } from './pages/Alerts';
import { Incidents } from './pages/Incidents';
import { Policies } from './pages/Policies';
import { Hunting } from './pages/Hunting';
import { Settings } from './pages/Settings';

function App(): JSX.Element {
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  const renderContent = (): JSX.Element => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'devices':
        return <Devices />;
      case 'events':
        return <Events />;
      case 'alerts':
        return <Alerts />;
      case 'incidents':
        return <Incidents />;
      case 'policies':
        return <Policies />;
      case 'hunting':
        return <Hunting />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-[#1a1a2e]">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-[#dee2e6] flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-[#0055a4]">AEGIS Security System</h1>
          <div className="flex items-center gap-4 text-sm text-[#6c757d]">
            <span>Status: Active</span>
            <span>Device: Local</span>
          </div>
        </header>
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
