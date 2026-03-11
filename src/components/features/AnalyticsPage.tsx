import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { TrendingUp, Clock, Calendar, Award, Download, AlertCircle } from 'lucide-react';
import { useToolsStore } from '../../stores/toolsStore';
import { cn } from '../../utils/cn';
import { Button } from '../ui';

const COLORS = ['#00D9FF', '#A855F7', '#F97316', '#22C55E', '#3B82F6', '#EF4444', '#F59E0B'];

type DateRange = 7 | 30 | 90 | 0;

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>(30);
  const { getUsageStats, tools } = useToolsStore();

  const stats = useMemo(() => getUsageStats(range), [range, tools]);

  const ranges: { label: string; value: DateRange }[] = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'All time', value: 0 },
  ];

  const handleExportCSV = () => {
    const rows = [['Tool', 'Category', 'Launches']];
    stats.topTools.forEach((t) => rows.push([t.name, t.category, String(t.count)]));
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
    { label: 'Today', value: stats.todayLaunches, icon: Clock, color: 'text-primary' },
    { label: 'This Week', value: stats.weekLaunches, icon: Calendar, color: 'text-purple-400' },
    { label: 'This Month', value: stats.monthLaunches, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Total', value: stats.totalLaunches, icon: Award, color: 'text-orange-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Analytics</h1>
          <p className="text-gray-600 dark:text-text-secondary text-sm mt-1">Track your AI tool usage patterns</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date range */}
          <div className="flex items-center bg-gray-100 dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-xl p-1 gap-1">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  range === r.value ? 'bg-primary text-black' : 'text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary'
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={handleExportCSV} leftIcon={<Download className="w-4 h-4" />}>
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
            className="bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-text-secondary">{s.label}</span>
              <s.icon className={cn('w-5 h-5', s.color)} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-text-primary">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-text-muted mt-1">launches</p>
          </motion.div>
        ))}
      </div>

      {/* Top Tool Hero */}
      {stats.topTools.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-primary/20 to-primary/5 border-2 border-primary/30 rounded-2xl p-6 flex items-center gap-6"
        >
          <Award className="w-12 h-12 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm text-primary font-medium mb-1">Your #1 Most Used Tool</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">{stats.topTools[0].name}</h2>
            <p className="text-gray-600 dark:text-text-secondary text-sm">
              Used <strong>{stats.topTools[0].count}</strong> times in{' '}
              {range === 0 ? 'all time' : `the last ${range} days`} · {stats.topTools[0].category}
            </p>
          </div>
        </motion.div>
      )}

      {stats.totalLaunches === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 dark:text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-2">No data yet</h3>
          <p className="text-gray-600 dark:text-text-secondary max-w-sm">
            Start launching tools from your dashboard to see analytics here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-4">Usage Timeline</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.dailyTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#737373', fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                  interval={Math.floor(stats.dailyTimeline.length / 6)}
                />
                <YAxis tick={{ fill: '#737373', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#E5E5E5' }}
                />
                <Line type="monotone" dataKey="count" stroke="#00D9FF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-4">Category Breakdown</h3>
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
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.categoryBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#E5E5E5' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-500 dark:text-text-muted text-sm">No data</p>}
          </motion.div>

          {/* Top Tools Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl p-6 lg:col-span-2"
          >
            <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-4">Most Used Tools</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.topTools} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis type="number" tick={{ fill: '#737373', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#A3A3A3', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#E5E5E5' }} />
                <Bar dataKey="count" fill="#00D9FF" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Weekly Pattern */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-4">Weekly Patterns</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.weekdayBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="day" tick={{ fill: '#737373', fontSize: 11 }} />
                <YAxis tick={{ fill: '#737373', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#E5E5E5' }} />
                <Bar dataKey="count" fill="#A855F7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Unused Tools */}
          {stats.unusedTools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl p-6"
            >
              <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-4">
                Unused Tools <span className="text-gray-500 dark:text-text-muted text-sm font-normal">(30+ days)</span>
              </h3>
              <div className="flex flex-col gap-2">
                {stats.unusedTools.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-text-secondary">{t.name}</span>
                    <span className="text-xs text-gray-500 dark:text-text-muted">{t.category}</span>
                  </div>
                ))}
                {stats.unusedTools.length > 5 && (
                  <p className="text-xs text-gray-500 dark:text-text-muted mt-1">+{stats.unusedTools.length - 5} more</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
