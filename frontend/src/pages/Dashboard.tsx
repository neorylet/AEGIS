import { useState, useEffect } from 'react';
import { Play, RefreshCw, Filter, Download } from 'lucide-react';
import { commands } from '../services/tauri';
import { EnrichedEvent, EventStatus, StatCard } from '../types';

export const Dashboard = () => {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [recentEvents, setRecentEvents] = useState<EnrichedEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const statCards: StatCard[] = [
    { label: 'Active Devices', value: 0, trend: 'neutral' },
    { label: 'Recent Events', value: recentEvents.length, trend: 'up', trendValue: 12 },
    { label: 'Open Alerts', value: 0, trend: 'neutral' },
    { label: 'Open Incidents', value: 0, trend: 'neutral' },
  ];

  const handleStartMonitoring = async (): Promise<void> => {
    try {
      await commands.startMonitoring();
      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  };

  const loadEvents = async (): Promise<void> => {
    setLoading(true);
    try {
      const events = await commands.getRecentEvents(10);
      setRecentEvents(events);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const getStatusColor = (status: EventStatus): string => {
    switch (status) {
      case 'Critical':
        return 'bg-[#dc3545] text-white';
      case 'Warning':
        return 'bg-[#ffc107] text-[#1a1a2e]';
      case 'Info':
        return 'bg-[#0dcaf0] text-white';
      case 'Resolved':
        return 'bg-[#198754] text-white';
      default:
        return 'bg-[#6c757d] text-white';
    }
  };

  const getEventType = (event: EnrichedEvent): string => {
    if ('Process' in event.event) return 'Process';
    if ('Network' in event.event) return 'Network';
    return 'Unknown';
  };

  const renderTrendArrow = (trend: 'up' | 'down' | 'neutral', value?: number): JSX.Element => {
    if (trend === 'neutral') return <span className="text-[#6c757d]">—</span>;
    const color = trend === 'up' ? 'text-[#198754]' : 'text-[#dc3545]';
    const arrow = trend === 'up' ? '↑' : '↓';
    return <span className={`${color} text-xs`}>{arrow} {value ? `${value}%` : ''}</span>;
  };

  const renderChart = (): JSX.Element => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const data = hours.map(() => Math.floor(Math.random() * 50) + 10);
    const maxData = Math.max(...data);

    return (
      <div className="h-48 flex items-end gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-[#0055a4] rounded-sm"
            style={{ height: `${(value / maxData) * 100}%`, opacity: 0.7 + (index / 24) * 0.3 }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Monitoring Control */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartMonitoring}
            disabled={isMonitoring}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors flex items-center gap-2 ${
              isMonitoring
                ? 'bg-[#198754] text-white cursor-not-allowed'
                : 'bg-[#0055a4] text-white hover:bg-[#0077be]'
            }`}
          >
            <Play className="w-4 h-4" />
            {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
          </button>
          <button
            onClick={loadEvents}
            disabled={loading}
            className="px-4 py-2 rounded-sm text-sm font-medium border border-[#dee2e6] bg-white text-[#495057] hover:bg-[#f8f9fa] transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-[#198754]' : 'bg-[#6c757d]'}`} />
          <span className="text-sm text-[#6c757d]">{isMonitoring ? 'Monitoring' : 'Stopped'}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white border border-[#dee2e6] rounded-sm p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-[#6c757d]">{card.label}</span>
              {renderTrendArrow(card.trend, card.trendValue)}
            </div>
            <p className="text-3xl font-semibold text-[#1a1a2e]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Middle Section: Chart + Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-[#dee2e6] rounded-sm p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#495057] mb-4">Events Over Last 24 Hours</h3>
          {renderChart()}
          <div className="flex justify-between mt-2 text-xs text-[#6c757d]">
            <span>24h ago</span>
            <span>Now</span>
          </div>
        </div>
        <div className="bg-white border border-[#dee2e6] rounded-sm p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#495057] mb-4">Quick Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#495057]">System Health</span>
              <span className="text-sm font-medium text-[#198754]">Normal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#495057]">Threat Level</span>
              <span className="text-sm font-medium text-[#0dcaf0]">Low</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#495057]">Data Retention</span>
              <span className="text-sm font-medium text-[#495057]">30 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#495057]">Last Scan</span>
              <span className="text-sm font-medium text-[#6c757d]">2h ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="bg-white border border-[#dee2e6] rounded-sm shadow-sm">
        <div className="p-4 border-b border-[#dee2e6] flex justify-between items-center">
          <h3 className="text-sm font-semibold text-[#495057]">Recent Events</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-sm text-sm border border-[#dee2e6] bg-white text-[#495057] hover:bg-[#f8f9fa] flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-3 py-1.5 rounded-sm text-sm border border-[#dee2e6] bg-white text-[#495057] hover:bg-[#f8f9fa] flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        {recentEvents.length === 0 ? (
          <div className="p-8 text-center text-[#6c757d]">No events yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#dee2e6] bg-[#f8f9fa]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#6c757d] uppercase tracking-wider font-mono">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#6c757d] uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#6c757d] uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#6c757d] uppercase tracking-wider">Details</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#6c757d] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.id} className="border-b border-[#dee2e6] hover:bg-[#f8f9fa]">
                  <td className="px-4 py-3 text-sm text-[#495057] font-mono">{event.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1a2e]">{event.source}</td>
                  <td className="px-4 py-3 text-sm text-[#495057]">{getEventType(event)}</td>
                  <td className="px-4 py-3 text-sm text-[#495057]">{event.details || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(event.status || 'Info')}`}>
                      {event.status || 'Info'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
