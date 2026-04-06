import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { TrendingUp, Clock, Calendar, Award, Download, AlertCircle } from 'lucide-react';
import { useToolsStore } from '../../stores/toolsStore';
import { cn } from '../../utils/cn';
import { Button } from '../ui';

const COLORS = ['#00D9FF', '#A855F7', '#F97316', '#22C55E', '#3B82F6', '#EF4444', '#F59E0B'];

// Custom tooltip components for light/dark mode
const LightTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 shadow-lg">
        <p className="text-[#0f172a] text-sm font-medium">{label || payload[0].payload.name}</p>
        <p className="text-[#64748b] text-xs">{payload[0].value} launches</p>
      </div>
    );
  }
  return null;
};

const DarkTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 shadow-lg">
        <p className="text-[#f1f5f9] text-sm font-medium">{label || payload[0].payload.name}</p>
        <p className="text-[#94a3b8] text-xs">{payload[0].value} launches</p>
      </div>
    );
  }
  return null;
};

type DateRange = 7 | 30 | 90 | 0;

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>(30);
  const [primaryColor, setPrimaryColor] = useState('#06b6d4');
  const [isDark, setIsDark] = useState(false);
  const { getUsageStats, tools } = useToolsStore();

  // Read CSS variable for primary color and detect theme
  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const color = getComputedStyle(root).getPropertyValue('--color-primary').trim();
      if (color) setPrimaryColor(color);
      
      // Check if dark mode is active
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    updateColors();
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateColors();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  const ranges: { label: string; value: DateRange }[] = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'All time', value: 0 },
  ];

  const stats = useMemo(() => getUsageStats(range), [range, tools]);

  const handleExportCSV = () => {
    const currentStats = getUsageStats(range);
    const rows = [['Tool', 'Category', 'Launches']];
    currentStats.topTools.forEach((t) => rows.push([t.name, t.category, String(t.count)]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aipulse-analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statCards = [
    { label: 'Today', value: stats.todayLaunches, icon: Clock },
    { label: 'This Week', value: stats.weekLaunches, icon: Calendar },
    { label: 'This Month', value: stats.monthLaunches, icon: TrendingUp },
    { label: 'Total', value: stats.totalLaunches, icon: Award },
  ];

  // Chart colors based on theme
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9';
  const axisColor = isDark ? '#475569' : '#94a3b8';
  const axisLineColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-6 py-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9]">Analytics</h1>
          <p className="text-[#64748b] text-sm mt-1">Track your AI tool usage patterns</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date range */}
          <div className="flex items-center bg-white dark:bg-[#0d1117] border border-[#e2e8f0] dark:border-[rgba(255,255,255,0.08)] rounded-lg p-[3px] gap-1 shadow-sm">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200',
                  range === r.value 
                    ? 'text-white dark:text-[#0a0e1a] shadow-sm' 
                    : 'text-[#64748b] hover:text-[#0f172a] dark:hover:text-[#94a3b8] bg-transparent hover:bg-[#f8fafc] dark:hover:bg-[rgba(255,255,255,0.03)]'
                )}
                style={range === r.value ? { backgroundColor: primaryColor } : undefined}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
            className="border border-[#e2e8f0] dark:border-[rgba(255,255,255,0.1)] text-[#64748b] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-transparent"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[#0d1117] border border-[#e2e8f0] dark:border-[rgba(255,255,255,0.08)] rounded-xl p-5 hover:border-[var(--color-primary)] hover:shadow-md transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-[#64748b] font-medium">{s.label}</span>
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <s.icon className="w-4 h-4" stroke={primaryColor} fill="none" strokeWidth={2} />
              </div>
            </div>
            <p className="text-[32px] font-bold text-[#0f172a] dark:text-[#f1f5f9] leading-tight">{s.value}</p>
            <p className="text-xs text-[#94a3b8] mt-1">launches</p>
          </motion.div>
        ))}
      </div>

      {/* Top Tool Hero */}
      {stats.topTools.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-6 flex items-center gap-6 border"
          style={{
            background: isDark 
              ? `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.08)`
              : `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.05)`,
            borderColor: isDark
              ? `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.3)`
              : `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.3)`,
          }}
        >
          <Award className="w-12 h-12 flex-shrink-0" style={{ color: primaryColor }} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: primaryColor }}>
              Your #1 Most Used Tool
            </p>
            <h2 className="text-xl font-bold text-[#0f172a] dark:text-[#f1f5f9]">{stats.topTools[0].name}</h2>
            <p className="text-[#64748b] text-sm mt-1">
              Used <strong className="text-[#0f172a] dark:text-[#f1f5f9]">{stats.topTools[0].count}</strong> times in{' '}
              {range === 0 ? 'all time' : `the last ${range} days`} · <span style={{ color: primaryColor }}>{stats.topTools[0].category}</span>
            </p>
          </div>
        </motion.div>
      )}

      {stats.totalLaunches === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <AlertCircle className="w-12 h-12 text-[#94a3b8] mb-4" />
          <h3 className="text-lg font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-2">No data yet</h3>
          <p className="text-[#64748b] max-w-sm">
            Start launching tools from your dashboard to see analytics here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Usage Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-[#0d1117] border border-[#e2e8f0] dark:border-[rgba(255,255,255,0.08)] rounded-xl p-6 shadow-sm"
          >
            <h3 className="font-semibold text-[#0f172a] dark:text-[#f1f5f9] text-sm mb-4">Usage Timeline</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.dailyTimeline}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: axisColor, fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                  interval={Math.floor(stats.dailyTimeline.length / 6)}
                  axisLine={{ stroke: axisLineColor }}
                  tickLine={{ stroke: axisLineColor }}
                />
                <YAxis 
                  tick={{ fill: axisColor, fontSize: 11 }} 
                  axisLine={{ stroke: axisLineColor }}
                  tickLine={{ stroke: axisLineColor }}
                />
                <Tooltip content={isDark ? <DarkTooltip /> : <LightTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke={primaryColor} 
                  strokeWidth={2} 
                  fill="url(#colorCount)"
                  dot={{ fill: primaryColor, strokeWidth: 0, r: 3 }}
                  activeDot={{ fill: primaryColor, stroke: isDark ? '#0d1117' : '#ffffff', strokeWidth: 2, r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#0d1117] border border-[#e2e8f0] dark:border-[rgba(255,255,255,0.08)] rounded-xl p-6 shadow-sm"
          >
            <h3 className="font-semibold text-[#0f172a] dark:text-[#f1f5f9] text-sm mb-4">Category Breakdown</h3>
            {stats.categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.categoryBreakdown}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label={(entry: any) => `${entry.category} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.categoryBreakdown.map((_, i) => (
                      <Cell 
                        key={i} 
                        fill={COLORS[i % COLORS.length]} 
                        stroke={isDark ? '#0a0e1a' : '#f8fafc'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={isDark ? <DarkTooltip /> : <LightTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-[#64748b] text-sm">No data</p>}
          </motion.div>

          {/* Top Tools Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-[#0d1117] border border-[#e2e8f0] dark:border-[rgba(255,255,255,0.08)] rounded-xl p-6 lg:col-span-2 shadow-sm"
          >
            <h3 className="font-semibold text-[#0f172a] dark:text-[#f1f5f9] text-sm mb-4">Most Used Tools</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.topTools} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis 
                  type="number" 
                  tick={{ fill: axisColor, fontSize: 11 }} 
                  axisLine={{ stroke: axisLineColor }}
                  tickLine={{ stroke: axisLineColor }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120} 
                  tick={{ fill: isDark ? '#64748b' : '#64748b', fontSize: 12 }} 
                  axisLine={{ stroke: axisLineColor }}
                  tickLine={{ stroke: axisLineColor }}
                />
                <Tooltip content={isDark ? <DarkTooltip /> : <LightTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill={primaryColor} 
                  radius={[0, 4, 4, 0]} 
                  fillOpacity={0.85}
                  background={{ fill: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Weekly Pattern */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-[#0d1117] border border-[#e2e8f0] dark:border-[rgba(255,255,255,0.08)] rounded-xl p-6 shadow-sm"
          >
            <h3 className="font-semibold text-[#0f172a] dark:text-[#f1f5f9] text-sm mb-4">Weekly Patterns</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.weekdayBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: axisColor, fontSize: 11 }} 
                  axisLine={{ stroke: axisLineColor }}
                  tickLine={{ stroke: axisLineColor }}
                />
                <YAxis 
                  tick={{ fill: axisColor, fontSize: 11 }} 
                  axisLine={{ stroke: axisLineColor }}
                  tickLine={{ stroke: axisLineColor }}
                />
                <Tooltip content={isDark ? <DarkTooltip /> : <LightTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill={primaryColor} 
                  radius={[4, 4, 0, 0]} 
                  fillOpacity={0.85}
                  background={{ fill: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Unused Tools */}
          {stats.unusedTools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white dark:bg-[#0d1117] border border-[#e2e8f0] dark:border-[rgba(255,255,255,0.08)] rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-[#0f172a] dark:text-[#f1f5f9] text-sm">Unused Tools</h3>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#fef3c7] text-[#92400e] dark:bg-[rgba(251,191,36,0.2)] dark:text-[#fbbf24]">
                  30+ days
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {stats.unusedTools.slice(0, 5).map((t, i) => (
                  <div key={t.id} className={`flex items-center justify-between py-2 ${i !== stats.unusedTools.slice(0, 5).length - 1 ? 'border-b border-[#f8fafc] dark:border-[rgba(255,255,255,0.04)]' : ''}`}>
                    <span className="text-sm text-[#0f172a] dark:text-[#f1f5f9] font-medium">{t.name}</span>
                    <span className="text-xs text-[#94a3b8]">{t.category}</span>
                  </div>
                ))}
                {stats.unusedTools.length > 5 && (
                  <p className="text-xs text-[var(--color-primary)] mt-1 cursor-pointer hover:underline">
                    +{stats.unusedTools.length - 5} more
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
