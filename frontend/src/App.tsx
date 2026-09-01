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

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
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
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
