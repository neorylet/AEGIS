import { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Square, RefreshCw, Filter, Download, AlertTriangle, Cpu, Activity, Radio } from 'lucide-react';
import { commands } from '../services/tauri';
import {
  EnrichedEvent,
  EventStatus,
  StatCard,
  AssetAnomaly,
  AnomalySeverity,
  EventCounts,
  HourlyEvents,
} from '../types';

const severityColor = (s: AnomalySeverity): string => {
  switch (s) {
    case 'Critical': return 'bg-[#dc3545] text-white border border-[#dc3545]';
    case 'High':     return 'bg-[#fd7e14] text-white border border-[#fd7e14]';
    case 'Medium':   return 'bg-[#ffc107] text-[#1a1a2e] border border-[#ffc107]';
    case 'Low':      return 'bg-[#ffd6a5] text-[#1a1a2e] border border-[#ffd6a5]';
    default:         return 'bg-[#6c757d] text-white border border-[#6c757d]';
  }
};

const severityBadgeColor = (s: AnomalySeverity): string => {
  switch (s) {
    case 'Critical': return 'text-[#dc3545] bg-[#dc3545]/10';
    case 'High':     return 'text-[#fd7e14] bg-[#fd7e14]/10';
    case 'Medium':   return 'text-[#b8860b] bg-[#ffc107]/15';
    case 'Low':      return 'text-[#6c757d] bg-[#6c757d]/10';
    default:         return 'text-[#198754] bg-[#198754]/10';
  }
};

const assetTypeIcon = (t: string) => {
  if (t === 'Process') return <Cpu className="w-4 h-4" />;
  if (t === 'NetworkEndpoint') return <Radio className="w-4 h-4" />;
  return <Activity className="w-4 h-4" />;
};

const formatAssetLabel = (a: AssetAnomaly): string => {
  if (a.asset_type === 'Process') return `${a.display_name} (process)`;
  if (a.asset_type === 'NetworkEndpoint') return a.display_name;
  return a.display_name;
};

export const Dashboard = () => {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [rawEvents, setRawEvents] = useState<EnrichedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EnrichedEvent[]>([]);
  const [anomalies, setAnomalies] = useState<AssetAnomaly[]>([]);
  const [eventCounts, setEventCounts] = useState<EventCounts | null>(null);
  const [hourlyEvents, setHourlyEvents] = useState<HourlyEvents[]>([]);
  const [assetCount, setAssetCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [controlsDisabled, setControlsDisabled] = useState<boolean>(false);

  const isLoopback = (event: EnrichedEvent): boolean => {
    if ('Network' in event.event) {
      const data = event.event.Network;
      const local = data.local_ip;
      const remote = data.remote_ip;
      return (
        local.startsWith('127.') ||
        remote.startsWith('127.') ||
        local === '0.0.0.0' ||
        remote === '0.0.0.0' ||
        local === '[::]' ||
        remote === '[::]' ||
        local === '::1' ||
        remote === '::1'
      );
    }
    return false;
  };

  const loadEvents = async (): Promise<void> => {
    try {
      const events = await commands.getRecentEvents(100);
      setRawEvents(events);
      setFilteredEvents(events.filter(e => !isLoopback(e)));
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const loadAnomalies = async (): Promise<void> => {
    try {
      const a = await commands.getAnomalies(25);
      setAnomalies(a);
    } catch (e) {
      console.error('Failed to load anomalies:', e);
    }
  };

  const loadStats = async (): Promise<void> => {
    try {
      const [counts, assets, hourly] = await Promise.all([
        commands.getEventCounts(),
        commands.getAssetCount(),
        commands.getHourlyEvents24h(),
      ]);
      setEventCounts(counts);
      setAssetCount(assets);
      setHourlyEvents(hourly);
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
  };

  const handleRefreshAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadEvents(), loadAnomalies(), loadStats()]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStartMonitoring = async (): Promise<void> => {
    try {
      setControlsDisabled(true);
      await commands.startMonitoring();
      setIsMonitoring(true);
      handleRefreshAll();
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    } finally {
      setControlsDisabled(false);
    }
  };

  const handleStopMonitoring = async (): Promise<void> => {
    try {
      setControlsDisabled(true);
      await commands.stopMonitoring();
      setIsMonitoring(false);
    } catch (error) {
      console.error('Failed to stop monitoring:', error);
    } finally {
      setControlsDisabled(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let intervalStats: ReturnType<typeof setInterval> | undefined;
    if (isMonitoring) {
      interval = setInterval(loadEvents, 3000);
      intervalStats = setInterval(async () => {
        await Promise.all([loadAnomalies(), loadStats()]);
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (intervalStats) clearInterval(intervalStats);
    };
  }, [isMonitoring]);

  useEffect(() => {
    handleRefreshAll();
  }, [handleRefreshAll]);

  const computedStats = useMemo<StatCard[]>(() => {
    const processCount = eventCounts?.process_events
      ?? rawEvents.filter(e => 'Process' in e.event).length;
    const networkCount = eventCounts?.network_events
      ?? rawEvents.filter(e => 'Network' in e.event).length;
    const total = eventCounts?.total_events ?? rawEvents.length;

    const lastHourTotal = eventCounts?.last_hour?.total ?? 0;
    const prevBaseline = Math.max(lastHourTotal * 2, 1);
    const trendPct = Math.round(Math.min(99, (lastHourTotal / prevBaseline) * 100));
    const trend: 'up' | 'down' | 'neutral' =
      lastHourTotal > prevBaseline * 1.05 ? 'up'
      : lastHourTotal < prevBaseline * 0.95 ? 'down'
      : 'neutral';

    return [
      {
        label: 'Active Assets',
        value: assetCount > 0 ? assetCount : 0,
        trend: assetCount > 0 ? 'up' : 'neutral',
        trendValue: assetCount > 0 ? undefined : undefined,
      },
      {
        label: 'Total Events',
        value: Number(total),
        trend,
        trendValue: trend !== 'neutral' ? trendPct : undefined,
      },
      {
        label: 'Process Events',
        value: Number(processCount),
        trend: 'neutral',
      },
      {
        label: 'Network Events',
        value: Number(networkCount),
        trend: 'neutral',
      },
    ];
  }, [assetCount, eventCounts, rawEvents]);

  const threatLevel = useMemo<{ label: string; color: string }>(() => {
    if (anomalies.some(a => a.max_severity === 'Critical')) return { label: 'Critical', color: 'text-[#dc3545]' };
    if (anomalies.some(a => a.max_severity === 'High')) return { label: 'High', color: 'text-[#fd7e14]' };
    if (anomalies.some(a => a.max_severity === 'Medium')) return { label: 'Medium', color: 'text-[#b8860b]' };
    if (anomalies.some(a => a.max_severity === 'Low')) return { label: 'Low', color: 'text-[#0dcaf0]' };
    return { label: 'Low', color: 'text-[#0dcaf0]' };
  }, [anomalies]);

  const getStatusColor = (status: EventStatus): string => {
    switch (status) {
      case 'Critical': return 'bg-[#dc3545] text-white';
      case 'Warning':  return 'bg-[#ffc107] text-[#1a1a2e]';
      case 'Info':     return 'bg-[#0dcaf0] text-white';
      case 'Resolved': return 'bg-[#198754] text-white';
      case 'Network':  return 'bg-[#6f42c1] text-white';
      case 'Anomaly':  return 'bg-[#fd7e14] text-white';
      default:         return 'bg-[#6c757d] text-white';
    }
  };

  const getEventType = (event: EnrichedEvent): string => {
    if ('Process' in event.event) return 'Process';
    if ('Network' in event.event) return 'Network';
    return 'Unknown';
  };

  const getEventStatus = (event: EnrichedEvent): EventStatus => {
    if ('Process' in event.event) return 'Info';
    if ('Network' in event.event) return 'Network' as EventStatus;
    return 'Info';
  };

  const renderEventDetails = (event: EnrichedEvent): string => {
    if ('Process' in event.event) {
      const data = event.event.Process;
      return `PID: ${data.pid} | ${data.name} | CPU: ${data.cpu_usage.toFixed(1)}% | Mem: ${(data.memory_usage / 1024 / 1024).toFixed(1)}MB`;
    }
    if ('Network' in event.event) {
      const data = event.event.Network;
      return `${data.protocol} | ${data.local_ip}:${data.local_port} → ${data.remote_ip}:${data.remote_port}`;
    }
    return 'N/A';
  };

  const renderTrendArrow = (trend: 'up' | 'down' | 'neutral', value?: number): JSX.Element => {
    if (trend === 'neutral') return <span className="text-[#6c757d]">—</span>;
    const color = trend === 'up' ? 'text-[#198754]' : 'text-[#dc3545]';
    const arrow = trend === 'up' ? '↑' : '↓';
    return <span className={`${color} text-xs`}>{arrow} {value ? value + '%' : ''}</span>;
  };

  const renderChart = (): JSX.Element => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    let data: number[];
    if (hourlyEvents.length > 0) {
      const map = new Map<string, number>();
      for (const h of hourlyEvents) {
        map.set(h.hour_label, h.total_events);
      }
      const now = new Date();
      const labels: string[] = [];
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(now.getHours() - i, 0, 0, 0);
        const y = d.getFullYear();
        const mo = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        labels.push(`${y}-${mo}-${da} ${hh}:00:00`);
      }
      data = labels.map(l => Number(map.get(l) ?? 0));
    } else {
      data = hours.map(() => 0);
    }
    const maxData = Math.max(1, ...data);
    return (
      <div className="h-48 flex items-end gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            title={`${hours[index]}h ago: ${value}`}
            className="flex-1 bg-[#0055a4] rounded-sm transition-all hover:bg-[#0077be]"
            style={{
              height: `${(value / maxData) * 100}%`,
              opacity: 0.55 + (index / 24) * 0.45,
              minHeight: value > 0 ? '3px' : '0',
            }}
          />
        ))}
      </div>
    );
  };

  const formatTime = (ts: string): string => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour12: false });
    } catch {
      return ts;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartMonitoring}
            disabled={isMonitoring || controlsDisabled}
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
            onClick={handleStopMonitoring}
            disabled={!isMonitoring || controlsDisabled}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors flex items-center gap-2 ${
              isMonitoring
                ? 'bg-[#dc3545] text-white hover:bg-[#c82333]'
                : 'bg-[#dee2e6] text-[#6c757d] cursor-not-allowed'
            }`}
          >
            <Square className="w-4 h-4" />
            Stop Monitoring
          </button>
          <button
            onClick={handleRefreshAll}
            disabled={loading}
            className="px-4 py-2 rounded-sm text-sm font-medium border border-[#dee2e6] bg-white text-[#495057] hover:bg-[#f8f9fa] transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-[#198754] animate-pulse' : 'bg-[#6c757d]'}`} />
          <span className="text-sm text-[#6c757d]">{isMonitoring ? 'Monitoring' : 'Stopped'}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {computedStats.map((card, index) => (
          <div key={index} className="bg-white border border-[#dee2e6] rounded-sm p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-[#6c757d]">{card.label}</span>
              {renderTrendArrow(card.trend, card.trendValue)}
            </div>
            <p className="text-3xl font-semibold text-[#1a1a2e] tabular-nums">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-[#dee2e6] rounded-sm p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#495057]">Events Over Last 24 Hours</h3>
            {hourlyEvents.length === 0 && (
              <span className="text-xs text-[#6c757d]">(no historical data yet — starts populating after ~1h)</span>
            )}
          </div>
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
              <span className={`text-sm font-semibold ${threatLevel.color}`}>
                {threatLevel.label}
                {anomalies.length > 0 && ` · ${anomalies.length} flagged`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#495057]">Data Retention</span>
              <span className="text-sm font-medium text-[#495057]">30 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#495057]">Last Analysis</span>
              <span className="text-sm font-medium text-[#6c757d]">
                {isMonitoring ? '~15s cadence' : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Anomalies Panel */}
      <div className="bg-white border border-[#dee2e6] rounded-sm shadow-sm">
        <div className="p-4 border-b border-[#dee2e6] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${anomalies.length > 0 ? 'text-[#fd7e14]' : 'text-[#6c757d]'}`} />
            <h3 className="text-sm font-semibold text-[#495057]">Behavioral Anomalies</h3>
            {anomalies.length > 0 && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-sm ${severityBadgeColor(anomalies[0].max_severity)}`}>
                {anomalies.length} detected
              </span>
            )}
          </div>
          <div className="text-xs text-[#6c757d]">
            z-score based · requires 3+ baseline samples
          </div>
        </div>
        {anomalies.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-[#198754]/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#198754]" />
            </div>
            <div className="text-sm font-medium text-[#1a1a2e] mb-1">No anomalies detected</div>
            <div className="text-xs text-[#6c757d] max-w-md mx-auto">
              Start monitoring and let AEGIS collect 3+ analysis windows (~45–60 seconds).
              Baselines are loaded from the database across restarts.
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#dee2e6]">
            {anomalies.map((a) => {
              const top = [...a.deviations].sort((x, y) => Math.abs(y.z_score) - Math.abs(x.z_score))[0];
              return (
                <div key={a.asset_id} className="p-4 hover:bg-[#f8f9fa] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-8 h-8 rounded-sm flex items-center justify-center text-[#495057] bg-[#f8f9fa] border border-[#dee2e6]`}>
                        {assetTypeIcon(a.asset_type)}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#1a1a2e] truncate">
                          {formatAssetLabel(a)}
                        </div>
                        <div className="text-xs text-[#6c757d] font-mono truncate">
                          {a.asset_id} · detected {formatTime(a.detected_at)} · {a.event_count} events
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-[#6c757d]">Score</div>
                        <div className="text-lg font-semibold text-[#1a1a2e] tabular-nums">
                          {a.overall_score.toFixed(1)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-sm text-xs font-semibold whitespace-nowrap ${severityColor(a.max_severity)}`}>
                        {a.max_severity}
                      </span>
                    </div>
                  </div>
                  {top && (
                    <div className="ml-10 bg-[#f8f9fa] border border-[#dee2e6] rounded-sm p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold text-[#495057] uppercase tracking-wide">
                          Top deviation
                        </div>
                        <div className={`text-xs font-medium ${severityBadgeColor(top.severity)} px-2 py-0.5 rounded-sm`}>
                          z = {top.z_score >= 0 ? '+' : ''}{top.z_score.toFixed(2)}σ
                        </div>
                      </div>
                      <div className="text-sm font-mono text-[#1a1a2e]">
                        <span className="font-semibold">{top.feature_name}</span>
                        {' '}= {top.current_value.toFixed(1)}
                        {' '}<span className="text-[#6c757d]">vs baseline μ={top.baseline_mean.toFixed(1)} σ={top.baseline_stddev.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-[#6c757d]">No events yet (loopback filtered)</div>
        ) : (
          <div className="overflow-x-auto">
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
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-[#dee2e6] hover:bg-[#f8f9fa]">
                    <td className="px-4 py-3 text-sm text-[#495057] font-mono whitespace-nowrap">{event.timestamp}</td>
                    <td className="px-4 py-3 text-sm text-[#1a1a2e]">{event.source}</td>
                    <td className="px-4 py-3 text-sm text-[#495057]">{getEventType(event)}</td>
                    <td className="px-4 py-3 text-sm text-[#495057] font-mono">{renderEventDetails(event)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(getEventStatus(event))}`}>
                        {getEventStatus(event)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
