import { LayoutDashboard, Server, FileText, AlertTriangle, FolderOpen, FileText as Policy, Search, Settings } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'devices', label: 'Devices', icon: Server },
  { id: 'events', label: 'Events', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'incidents', label: 'Incidents', icon: FolderOpen },
  { id: 'policies', label: 'Policies', icon: Policy },
  { id: 'hunting', label: 'Hunting', icon: Search },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <aside className="w-[200px] bg-[#e9ecef] flex flex-col border-r border-[#dee2e6]">
      <div className="p-4 border-b border-[#dee2e6]">
        <h1 className="text-xl font-bold text-[#0055a4]">AEGIS</h1>
        <p className="text-sm text-[#6c757d]">Security System</p>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full text-left px-3 py-2 rounded-sm text-sm font-medium transition-colors flex items-center gap-2 ${
                activeSection === section.id
                  ? 'bg-[#0055a4] text-white'
                  : 'text-[#495057] hover:bg-[#dee2e6]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
