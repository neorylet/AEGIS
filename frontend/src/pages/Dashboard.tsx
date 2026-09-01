import React, { useState, useEffect } from 'react';
import { commands } from '../services/tauri';
import { EnrichedEvent } from '../types';

export const Dashboard: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [recentEvents, setRecentEvents] = useState<EnrichedEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const handleStartMonitoring = async () => {
    try {
      await commands.startMonitoring();
      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const events = await commands.getRecentEvents(5);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Active Devices</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Recent Events</h3>
          <p className="text-3xl font-bold text-white">{recentEvents.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Open Alerts</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Open Incidents</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
      </div>

      {/* Monitoring Control */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Monitoring Control</h3>
        <button
          onClick={handleStartMonitoring}
          disabled={isMonitoring}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            isMonitoring
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
        </button>
      </div>

      {/* Recent Events */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Events</h3>
          <button
            onClick={loadEvents}
            disabled={loading}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        {recentEvents.length === 0 ? (
          <p className="text-gray-400">No events yet</p>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div key={event.id} className="bg-gray-700 rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">{event.timestamp}</p>
                    <p className="text-white font-medium">{event.source}</p>
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    {'event' in event && typeof event.event === 'object' && 'pid' in event.event ? 'Process' : 'Network'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
