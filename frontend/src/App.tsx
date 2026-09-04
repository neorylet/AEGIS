import { useState } from 'react';
import {
  ShieldHalf,
  LayoutDashboard,
  Cpu,
  Activity,
  AlertTriangle,
  ShieldAlert,
  FileText,
  Crosshair,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Devices } from './pages/Devices';
import { Events } from './pages/Events';
import { Alerts } from './pages/Alerts';
import { Incidents } from './pages/Incidents';
import { Policies } from './pages/Policies';
import { Hunting } from './pages/Hunting';
import { Settings } from './pages/Settings';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'devices', label: 'Devices', icon: Cpu },
  { id: 'events', label: 'Events', icon: Activity },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'incidents', label: 'Incidents', icon: ShieldAlert },
  { id: 'policies', label: 'Policies', icon: FileText },
  { id: 'hunting', label: 'Threat Hunting', icon: Crosshair },
];

const SECTION_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  devices: 'Devices',
  events: 'Events',
  alerts: 'Alerts',
  incidents: 'Incidents',
  policies: 'Policies',
  hunting: 'Threat Hunting',
  settings: 'Settings',
};

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
    <div className="flex h-screen overflow-hidden bg-[#0a0e10] font-sans text-[#e6edf0]">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#0a0e10] border-r border-[#2a2f35] flex flex-col h-full">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[#2a2f35] flex-shrink-0">
          <ShieldHalf className="w-5 h-5 text-[#00d4ff]" />
          <span className="text-sm font-semibold text-[#e6edf0] tracking-tight">AEGIS</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-[#00d4ff]/10 text-[#00d4ff] font-medium'
                    : 'text-[#8b949e] hover:text-[#e6edf0] hover:bg-[#14181a]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#2a2f35] flex-shrink-0">
          <button
            onClick={() => setActiveSection('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              activeSection === 'settings'
                ? 'bg-[#00d4ff]/10 text-[#00d4ff] font-medium'
                : 'text-[#8b949e] hover:text-[#e6edf0] hover:bg-[#14181a]'
            }`}
          >
            <SettingsIcon className="w-4 h-4 flex-shrink-0" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main content area – scrolls independently of the sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-[#0a0e10] border-b border-[#2a2f35] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-[#e6edf0] tracking-tight">
              {SECTION_LABELS[activeSection] ?? 'AEGIS'}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-[#8b949e]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
              status: active
            </span>
            <span className="text-[#2a2f35]">|</span>
            <span>device: local</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;