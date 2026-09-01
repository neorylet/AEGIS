import React from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'devices', label: 'Devices' },
  { id: 'events', label: 'Events' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'incidents', label: 'Incidents' },
  { id: 'policies', label: 'Policies' },
  { id: 'hunting', label: 'Hunting' },
  { id: 'settings', label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">AEGIS</h1>
        <p className="text-gray-400 text-sm">Security System</p>
      </div>
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
