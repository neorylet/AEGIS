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
    case 'Critical': return 'bg-[#f85149] text-white border border-[#f85149]';
    case 'High':     return 'bg-[#d29922] text-[#0a0e10] border border-[#d29922]';
    case 'Medium':   return 'bg-[#d29922]/80 text-[#0a0e10] border border-[#d29922]/80';
    case 'Low':      return 'bg-[#2a2f35] text-[#e6edf0] border border-[#3a4149]';
    default:         return 'bg-[#2a2f35] text-[#e6edf0] border border-[#3a4149]';
  }
};

const severityBadgeColor = (s: AnomalySeverity): string => {
  switch (s) {
    case 'Critical': return 'text-[#f85149] bg-[#f85149]/10';
    case 'High':     return 'text-[#d29922] bg-[#d29922]/10';
    case 'Medium':   return 'text-[#d29922] bg-[#d29922]/10';
    case 'Low':      return 'text-[#e6edf0] bg-[#8b949e]/10';
    default:         return 'text-[#3fb950] bg-[#3fb950]/10';
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

// Turns a raw source identifier like "process_poller" into "Process Poller".
const formatSourceLabel = (source: string): string =>
  source
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const Dashboard = () => {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [rawEvents, setRawEvents] = useState<EnrichedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EnrichedEvent[]>([]);
  const [anomalies, setAnomalies] = useState<AssetAnomaly[]>([]);
  const [eventCounts, setEventCounts] = useState<EventCounts | null>(null);
  const [hourlyEvents, setHourlyEvents] = useState<HourlyEvents[]>([]);
  const [assetCount, setAssetCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [controlsDisabled, setControlsDisabled] = useState<boolean>(false);
  const [lastAnalysisAt, setLastAnalysisAt] = useState<Date | null>(null);
  const [monitoringStartedAt, setMonitoringStartedAt] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

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

  // Anomalies + stats together form one "analysis pass" — this is what
  // powers the real Last Analysis timestamp in Quick Status.
  const runAnalysisCycle = useCallback(async () => {
    await Promise.all([loadAnomalies(), loadStats()]);
    setLastAnalysisAt(new Date());
  }, []);

  const handleRefreshAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadEvents(), runAnalysisCycle()]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [runAnalysisCycle]);

  const handleStartMonitoring = async (): Promise<void> => {
    try {
      setControlsDisabled(true);
      await commands.startMonitoring();
      setIsMonitoring(true);
      setMonitoringStartedAt(new Date());
      setElapsedSeconds(0);
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
      setMonitoringStartedAt(null);
      setElapsedSeconds(0);
    } catch (error) {
      console.error('Failed to stop monitoring:', error);
    } finally {
      setControlsDisabled(false);
    }
  };

  const handleToggleMonitoring = (): void => {
    if (isMonitoring) {
      handleStopMonitoring();
    } else {
      handleStartMonitoring();
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let intervalStats: ReturnType<typeof setInterval> | undefined;
    if (isMonitoring) {
      interval = setInterval(loadEvents, 3000);
      intervalStats = setInterval(runAnalysisCycle, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (intervalStats) clearInterval(intervalStats);
    };
  }, [isMonitoring, runAnalysisCycle]);

  // Live "Running for: 2m 34s" ticker, separate from the data-refresh intervals above.
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isMonitoring && monitoringStartedAt) {
      timer = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - monitoringStartedAt.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isMonitoring, monitoringStartedAt]);

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
        value: Number(total) || 0,
        trend,
        trendValue: trend !== 'neutral' ? trendPct : undefined,
      },
      {
        label: 'Process Events',
        value: Number(processCount) || 0,
        trend: 'neutral',
      },
      {
        label: 'Network Events',
        value: Number(networkCount) || 0,
        trend: 'neutral',
      },
    ];
  }, [assetCount, eventCounts, rawEvents]);

  const threatLevel = useMemo<{ label: string; color: string }>(() => {
    if (anomalies.some(a => a.max_severity === 'Critical')) return { label: 'Critical', color: 'text-[#f85149]' };
    if (anomalies.some(a => a.max_severity === 'High')) return { label: 'High', color: 'text-[#d29922]' };
    if (anomalies.some(a => a.max_severity === 'Medium')) return { label: 'Medium', color: 'text-[#d29922]' };
    if (anomalies.some(a => a.max_severity === 'Low')) return { label: 'Low', color: 'text-[#58a6ff]' };
    return { label: 'Low', color: 'text-[#58a6ff]' };
  }, [anomalies]);

  const getStatusColor = (status: EventStatus): string => {
    switch (status) {
      case 'Critical': return 'bg-[#f85149]/15 text-[#f85149] border border-[#f85149]/30';
      case 'Warning':  return 'bg-[#d29922]/15 text-[#d29922] border border-[#d29922]/30';
      case 'Info':     return 'bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30';
      case 'Resolved': return 'bg-[#3fb950]/15 text-[#3fb950] border border-[#3fb950]/30';
      case 'Network':  return 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30';
      case 'Anomaly':  return 'bg-[#d29922]/15 text-[#d29922] border border-[#d29922]/30';
      default:         return 'bg-[#2a2f35] text-[#8b949e] border border-[#3a4149]';
    }
  };

  // Already returns the friendly label ("Process" / "Network"), not the raw
  // "process_poller" / "connection_poller" source string — that raw string
  // is what shows in the Source column, now humanized via formatSourceLabel.
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
    if (trend === 'neutral') return <span className="text-[#5c6570]">—</span>;
    const color = trend === 'up' ? 'text-[#3fb950]' : 'text-[#f85149]';
    const arrow = trend === 'up' ? '↑' : '↓';
    return <span className={`${color} text-xs font-mono`}>{arrow} {value ? value + '%' : ''}</span>;
  };

  const renderChart = (): JSX.Element => {
    const now = new Date();

    // Clock-hour label for each of the 24 bins, oldest→newest — e.g. "14:00".
    // Used for the x-axis ticks and the per-bar tooltip.
    const hourLabels: string[] = [];
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(now.getHours() - i, 0, 0, 0);
      hourLabels.push(`${String(d.getHours()).padStart(2, '0')}:00`);
    }

    let data: number[];
    if (hourlyEvents.length > 0) {
      const map = new Map<string, number>();
      for (const h of hourlyEvents) {
        map.set(h.hour_label, h.total_events);
      }
      const bucketKeys: string[] = [];
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(now.getHours() - i, 0, 0, 0);
        const y = d.getFullYear();
        const mo = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        bucketKeys.push(`${y}-${mo}-${da} ${hh}:00:00`);
      }
      data = bucketKeys.map(k => Number(map.get(k) ?? 0));
    } else {
      data = hourLabels.map(() => 0);
    }

    const maxData = Math.max(1, ...data);
    const midValue = Math.round(maxData / 2);
    const totalEvents = data.reduce((sum, v) => sum + v, 0);
    const avgPerHour = totalEvents / 24;
    const peakIndex = data.reduce((best, v, i) => (v > data[best] ? i : best), 0);
    const hasPeak = data[peakIndex] > 0;

    return (
      <div>
        {/* Summary row — the numbers that make the chart actually useful at a glance */}
        <div className="flex items-center gap-5 mb-3 text-xs font-mono">
          <span>
            <span className="text-[#5c6570]">Peak </span>
            <span className="text-[#e6edf0] font-semibold">{maxData}</span>
            {hasPeak && <span className="text-[#5c6570]"> @ {hourLabels[peakIndex]}</span>}
          </span>
          <span>
            <span className="text-[#5c6570]">Total </span>
            <span className="text-[#e6edf0] font-semibold">{totalEvents}</span>
          </span>
          <span>
            <span className="text-[#5c6570]">Avg/hr </span>
            <span className="text-[#e6edf0] font-semibold">{avgPerHour.toFixed(1)}</span>
          </span>
        </div>

        <div className="flex gap-2">
          {/* Y-axis scale */}
          <div className="flex flex-col justify-between h-44 text-[10px] text-[#5c6570] font-mono text-right w-6 shrink-0">
            <span>{maxData}</span>
            <span>{midValue}</span>
            <span>0</span>
          </div>

          {/* Plot area: gridlines behind, bars on top */}
          <div className="relative flex-1 h-44">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-[#2a2f35]" />
              <div className="border-t border-[#1e2327]" />
              <div className="border-t border-[#2a2f35]" />
            </div>
            <div className="absolute inset-0 flex items-end gap-1">
              {data.map((value, index) => {
                const isPeak = hasPeak && index === peakIndex;
                return (
                  <div
                    key={index}
                    title={`${hourLabels[index]} — ${value} event${value === 1 ? '' : 's'}`}
                    className={`flex-1 rounded-sm transition-colors ${
                      isPeak ? 'bg-[#5ce1ff] hover:bg-[#8aeaff]' : 'bg-[#00d4ff] hover:bg-[#5ce1ff]'
                    }`}
                    style={{
                      height: `${(value / maxData) * 100}%`,
                      opacity: isPeak ? 1 : 0.4 + (index / 24) * 0.5,
                      minHeight: value > 0 ? '3px' : '0',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* X-axis — hour label every 4th bar, aligned under the plot area */}
        <div className="flex mt-1.5 pl-8">
          {hourLabels.map((label, index) => (
            <div key={index} className="flex-1 text-center">
              {index % 4 === 0 && (
                <span className="text-[10px] text-[#5c6570] font-mono">{label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Short, readable time only — e.g. "07:48:23" — used for both event
  // timestamps and anomaly detection times. Full ISO strings are for the
  // detail pages, not this summary view.
  const formatTimestamp = (ts: string): string => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour12: false });
    } catch {
      return ts;
    }
  };

  const formatClockTime = (d: Date): string => d.toLocaleTimeString([], { hour12: false });

  const formatDuration = (totalSeconds: number): string => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMonitoring}
            disabled={controlsDisabled}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
              isMonitoring
                ? 'bg-[#f85149] text-[#0a0e10] hover:bg-[#ff6a61]'
                : 'bg-[#00d4ff] text-[#0a0e10] hover:bg-[#5ce1ff]'
            }`}
          >
            {isMonitoring ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
          <button
            onClick={handleRefreshAll}
            disabled={loading}
            className="px-4 py-2 rounded-md text-sm font-medium border border-[#2a2f35] bg-[#14181a] text-[#8b949e] hover:text-[#e6edf0] hover:border-[#3a4149] transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          {isMonitoring && (
            <span className="text-xs text-[#5c6570] font-mono">
              Running for: {formatDuration(elapsedSeconds)}
            </span>
          )}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-[#3fb950] animate-pulse' : 'bg-[#5c6570]'}`} />
            <span className="text-sm text-[#8b949e]">{isMonitoring ? 'Monitoring' : 'Stopped'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {computedStats.map((card, index) => (
          <div key={index} className="bg-[#14181a] border border-[#2a2f35] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-[#8b949e]">{card.label}</span>
              {renderTrendArrow(card.trend, card.trendValue)}
            </div>
            <p className="text-3xl font-semibold text-[#e6edf0] font-mono tabular-nums">
              {initialLoad && loading ? '—' : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 bg-[#14181a] border border-[#2a2f35] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#e6edf0]">Events Over Last 24 Hours</h3>
            {hourlyEvents.length === 0 && (
              <span className="text-xs text-[#5c6570]">(no historical data yet — starts populating after ~1h)</span>
            )}
          </div>
          {renderChart()}
        </div>
        <div className="bg-[#14181a] border border-[#2a2f35] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#e6edf0] mb-4">Quick Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8b949e]">System Health</span>
              <span className="text-sm font-medium text-[#3fb950]">Normal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8b949e]">Threat Level</span>
              <span className={`text-sm font-semibold ${threatLevel.color}`}>
                {threatLevel.label}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8b949e]">Data Retention</span>
              <span className="text-sm font-medium text-[#e6edf0]">30 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8b949e]">Last Analysis</span>
              <span className="text-sm font-medium text-[#5c6570] font-mono">
                {isMonitoring && lastAnalysisAt ? formatClockTime(lastAnalysisAt) : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Anomalies Panel */}
      <div className="bg-[#14181a] border border-[#2a2f35] rounded-lg">
        <div className="p-4 border-b border-[#2a2f35] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${anomalies.length > 0 ? 'text-[#d29922]' : 'text-[#5c6570]'}`} />
            <h3 className="text-sm font-semibold text-[#e6edf0]">Behavioral Anomalies</h3>
            {anomalies.length > 0 && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${severityBadgeColor(anomalies[0].max_severity)}`}>
                {anomalies.length} detected
              </span>
            )}
          </div>
          <div className="text-xs text-[#5c6570] font-mono">
            z-score based · requires 3+ baseline samples
          </div>
        </div>
        {anomalies.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-2 w-8 h-8 rounded-full bg-[#3fb950]/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#3fb950]" />
            </div>
            <div className="text-sm font-medium text-[#e6edf0] mb-1">No anomalies detected</div>
            <div className="text-xs text-[#5c6570] max-w-md mx-auto">
              Start monitoring and let AEGIS collect 3+ analysis windows (~45–60 seconds).
              Baselines are loaded from the database across restarts.
            </div>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto divide-y divide-[#2a2f35]">
            {anomalies.map((a) => {
              const top = [...a.deviations].sort((x, y) => Math.abs(y.z_score) - Math.abs(x.z_score))[0];
              return (
                <div key={a.asset_id} className="p-4 hover:bg-[#181d1f] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-md flex items-center justify-center text-[#8b949e] bg-[#0a0e10] border border-[#2a2f35]">
                        {assetTypeIcon(a.asset_type)}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#e6edf0] truncate">
                          {formatAssetLabel(a)}
                        </div>
                        <div className="text-xs text-[#5c6570] font-mono truncate">
                          detected {formatTimestamp(a.detected_at)} · {a.event_count} events
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-[#5c6570]">Score</div>
                        <div className="text-lg font-semibold text-[#e6edf0] font-mono tabular-nums">
                          {a.overall_score.toFixed(1)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${severityColor(a.max_severity)}`}>
                        {a.max_severity}
                      </span>
                    </div>
                  </div>
                  {top && (
                    <div className="ml-10 text-xs font-mono text-[#5c6570]">
                      Top deviation: <span className="text-[#e6edf0] font-medium">{top.feature_name}</span> = {top.current_value.toFixed(1)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Events Table */}
      <div className="bg-[#14181a] border border-[#2a2f35] rounded-lg">
        <div className="p-4 border-b border-[#2a2f35] flex justify-between items-center">
          <h3 className="text-sm font-semibold text-[#e6edf0]">Recent Events</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-md text-sm border border-[#2a2f35] bg-[#0a0e10] text-[#8b949e] hover:text-[#e6edf0] hover:border-[#3a4149] flex items-center gap-2 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-3 py-1.5 rounded-md text-sm border border-[#2a2f35] bg-[#0a0e10] text-[#8b949e] hover:text-[#e6edf0] hover:border-[#3a4149] flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-[#5c6570]">No events yet (loopback filtered)</div>
        ) : (
          <div className="max-h-80 overflow-y-auto overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#14181a]">
                <tr className="border-b border-[#2a2f35]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#5c6570] uppercase tracking-wider font-mono">Timestamp</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#5c6570] uppercase tracking-wider">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#5c6570] uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#5c6570] uppercase tracking-wider">Details</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#5c6570] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-[#1e2327] hover:bg-[#181d1f] transition-colors">
                    <td className="px-4 py-3 text-sm text-[#8b949e] font-mono whitespace-nowrap">{formatTimestamp(event.timestamp)}</td>
                    <td className="px-4 py-3 text-sm text-[#e6edf0]">{formatSourceLabel(event.source)}</td>
                    <td className="px-4 py-3 text-sm text-[#8b949e]">{getEventType(event)}</td>
                    <td className="px-4 py-3 text-sm text-[#8b949e] font-mono">{renderEventDetails(event)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(getEventStatus(event))}`}>
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