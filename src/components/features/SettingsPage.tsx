import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Bell, Settings, Database, Info, Shield, FileCheck,
  Check, RotateCcw, Sun, Moon, Zap, Download,
  Upload, Trash2, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { useToolsStore, defaultSettings, accentColors } from '../../stores/toolsStore';
import { applyTheme } from '../../utils/theme';
import { toast } from '../../stores/toastStore';
import { Button } from '../ui';
import { cn } from '../../utils/cn';
import type { AppSettings, ThemeAccent } from '../../types/index';

const tabs = [
  { id: 'display', label: 'Display', icon: Monitor },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'behavior', label: 'Behavior', icon: Settings },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'privacy', label: 'Privacy Policy', icon: Shield },
  { id: 'terms', label: 'Terms of Service', icon: FileCheck },
  { id: 'about', label: 'About', icon: Info },
] as const;

type TabId = typeof tabs[number]['id'];

const accentThemes: { key: ThemeAccent; label: string; color: string }[] = [
  { key: 'teal', label: 'Default Teal', color: '#00D9FF' },
  { key: 'purple', label: 'Midnight Purple', color: '#A855F7' },
  { key: 'blue', label: 'Ocean Blue', color: '#3B82F6' },
  { key: 'green', label: 'Forest Green', color: '#22C55E' },
  { key: 'orange', label: 'Sunset Orange', color: '#F97316' },
  { key: 'mono', label: 'Monochrome', color: '#E5E5E5' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    // Check if there's a stored tab preference from footer navigation
    const storedTab = sessionStorage.getItem('settingsActiveTab');
    if (storedTab && tabs.some(t => t.id === storedTab)) {
      sessionStorage.removeItem('settingsActiveTab'); // Clean up after reading
      return storedTab as TabId;
    }
    return 'display';
  });
  const [showClearConfirm, setShowClearConfirm] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const { settings, updateSettings, resetSettings, isDarkMode, toggleTheme, exportData, importData, tools, collections, currentPage } = useToolsStore();

  // Listen for tab change requests from footer navigation
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'settingsActiveTab' && e.newValue) {
        if (tabs.some(t => t.id === e.newValue)) {
          setActiveTab(e.newValue as TabId);
          sessionStorage.removeItem('settingsActiveTab');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically if we're on settings page and there's a stored tab
    const checkInterval = setInterval(() => {
      if (currentPage === 'settings') {
        const storedTab = sessionStorage.getItem('settingsActiveTab');
        if (storedTab && tabs.some(t => t.id === storedTab)) {
          setActiveTab(storedTab as TabId);
          sessionStorage.removeItem('settingsActiveTab');
        }
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkInterval);
    };
  }, [currentPage]);
  const accentColor = accentColors[settings.themeAccent] || accentColors.teal;

  const handleSettingChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    updateSettings({ [key]: value });
    const newSettings = { ...settings, [key]: value };
    applyTheme(newSettings, isDarkMode);
    toast.success('Preference saved');
  };

  const handleReset = () => {
    resetSettings();
    applyTheme(defaultSettings, isDarkMode);
    toast.success('Settings reset to defaults');
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aipulse-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImport = () => {
    try {
      importData(importText);
      setImportText('');
      setShowImport(false);
      toast.success('Data imported successfully');
    } catch {
      toast.error('Invalid backup file. Please check the format and try again.');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        importData(text);
        toast.success(`Imported ${JSON.parse(text).tools?.length || 0} tools successfully`);
      } catch {
        toast.error('Invalid backup file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = (type: string) => {
    if (type === 'tools') {
      useToolsStore.setState({ tools: [] });
      toast.success('All tools cleared');
    } else if (type === 'analytics') {
      useToolsStore.setState({ usageEvents: [] });
      toast.success('Analytics data cleared');
    } else if (type === 'all') {
      useToolsStore.setState({
        tools: [],
        collections: [],
        workflows: [],
        usageEvents: [],
        activityLog: [],
        settings: defaultSettings,
      });
      applyTheme(defaultSettings, isDarkMode);
      toast.success('All data cleared');
    }
    setShowClearConfirm(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Settings</h1>
        <p className="text-gray-600 dark:text-text-secondary text-sm mt-1">Customize your AIPulse experience</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="lg:w-48 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left w-full',
                  activeTab === tab.id
                    ? 'bg-primary/15 text-primary'
                    : 'text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card'
                )}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
                {activeTab === tab.id && <ChevronRight className="w-3.5 h-3.5 ml-auto hidden lg:block" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* ── DISPLAY ─────────────────────────────────────────────── */}
              {activeTab === 'display' && (
                <>
                  <Section title="Color Theme">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {accentThemes.map((theme) => (
                        <button
                          key={theme.key}
                          onClick={() => handleSettingChange('themeAccent', theme.key)}
                          className={cn(
                            'relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left',
                            settings.themeAccent === theme.key
                              ? 'bg-white dark:bg-background-card'
                              : 'border-gray-200 dark:border-border hover:border-gray-400 dark:hover:border-border-hover bg-white dark:bg-background-card'
                          )}
                          style={settings.themeAccent === theme.key ? { borderColor: accentColor, backgroundColor: `${accentColor}15` } : undefined}
                        >
                          <div className="w-8 h-8 rounded-full flex-shrink-0 shadow-lg" style={{ backgroundColor: theme.color }} />
                          <span className="text-sm font-medium text-gray-900 dark:text-text-primary truncate">{theme.label}</span>
                          {settings.themeAccent === theme.key && (
                            <Check className="w-4 h-4 absolute top-2 right-2" style={{ color: accentColor }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </Section>

                  <Section title="Dark / Light Mode">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => !isDarkMode && toggleTheme()}
                        className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-medium',
                          isDarkMode ? 'text-gray-900 dark:text-text-primary' : 'border-gray-200 dark:border-border text-gray-600 dark:text-text-secondary hover:border-gray-400 dark:hover:border-border-hover'
                        )}
                        style={isDarkMode ? { borderColor: accentColor, backgroundColor: `${accentColor}15`, color: accentColor } : undefined}
                      >
                        <Moon className="w-4 h-4" /> Dark
                      </button>
                      <button
                        onClick={() => isDarkMode && toggleTheme()}
                        className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-medium',
                          !isDarkMode ? 'text-gray-900 dark:text-text-primary' : 'border-gray-200 dark:border-border text-gray-600 dark:text-text-secondary hover:border-gray-400 dark:hover:border-border-hover'
                        )}
                        style={!isDarkMode ? { borderColor: accentColor, backgroundColor: `${accentColor}15`, color: accentColor } : undefined}
                      >
                        <Sun className="w-4 h-4" /> Light
                      </button>
                    </div>
                  </Section>

                  <Section title="Accessibility">
                    <div className="space-y-3">
                      <Toggle
                        label="High Contrast Mode"
                        description="Increases contrast for better readability"
                        value={settings.highContrast}
                        onChange={(v) => handleSettingChange('highContrast', v)}
                      />
                      <Toggle
                        label="Reduce Motion"
                        description="Disable animations for users with motion sensitivity"
                        value={settings.reduceMotion}
                        onChange={(v) => handleSettingChange('reduceMotion', v)}
                      />
                      <Toggle
                        label="Show Tooltips"
                        description="Show hover tooltips on tool cards"
                        value={settings.showTooltips}
                        onChange={(v) => handleSettingChange('showTooltips', v)}
                      />
                      <Toggle
                        label="Show Keyboard Hints"
                        description="Display keyboard shortcut hints in the UI"
                        value={settings.showKeyboardHints}
                        onChange={(v) => handleSettingChange('showKeyboardHints', v)}
                      />
                    </div>
                  </Section>

                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
                      Reset to Defaults
                    </Button>
                  </div>
                </>
              )}

              {/* ── NOTIFICATIONS ───────────────────────────────────────── */}
              {activeTab === 'notifications' && (
                <Section title="Notification Preferences">
                  <div className="space-y-3">
                    <Toggle label="New tool recommendations" description="Get suggestions for new AI tools" value={false} onChange={() => toast.info('Coming soon')} />
                    <Toggle label="Tool update notifications" description="Know when tools are updated" value={false} onChange={() => toast.info('Coming soon')} />
                    <Toggle label="Weekly trending summary" description="Weekly digest of trending tools" value={false} onChange={() => toast.info('Coming soon')} />
                    <Toggle label="Achievement notifications" description="Celebrate usage milestones" value={false} onChange={() => toast.info('Coming soon')} />
                  </div>
                  <p className="text-gray-500 dark:text-text-muted text-xs mt-4">Cloud notifications coming in a future update.</p>
                </Section>
              )}

              {/* ── BEHAVIOR ───────────────────────────────────────────── */}
              {activeTab === 'behavior' && (
                <>
                  <Section title="Default Launch Behavior">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSettingChange('defaultLaunchBehavior', 'new-tab')}
                        className={cn('px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                          settings.defaultLaunchBehavior === 'new-tab'
                            ? ''
                            : 'border-gray-200 dark:border-border text-gray-600 dark:text-text-secondary hover:border-gray-400 dark:hover:border-border-hover'
                        )}
                        style={settings.defaultLaunchBehavior === 'new-tab' ? { borderColor: accentColor, backgroundColor: `${accentColor}15`, color: accentColor } : undefined}
                      >
                        Open in New Tab
                      </button>
                      <button
                        onClick={() => handleSettingChange('defaultLaunchBehavior', 'current-tab')}
                        className={cn('px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                          settings.defaultLaunchBehavior === 'current-tab'
                            ? ''
                            : 'border-gray-200 dark:border-border text-gray-600 dark:text-text-secondary hover:border-gray-400 dark:hover:border-border-hover'
                        )}
                        style={settings.defaultLaunchBehavior === 'current-tab' ? { borderColor: accentColor, backgroundColor: `${accentColor}15`, color: accentColor } : undefined}
                      >
                        Open in Current Tab
                      </button>
                    </div>
                  </Section>
                  <Section title="Analytics">
                    <Toggle
                      label="Enable Usage Analytics"
                      description="Track tool launches to generate insights in the Analytics page"
                      value={settings.analyticsEnabled}
                      onChange={(v) => handleSettingChange('analyticsEnabled', v)}
                    />
                  </Section>
                </>
              )}

              {/* ── DATA ───────────────────────────────────────────────── */}
              {activeTab === 'data' && (
                <>
                  <Section title="Backup & Export">
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={handleExport} leftIcon={<Download className="w-4 h-4" />}>
                        Export as JSON
                      </Button>
                      <label className="cursor-pointer">
                        <input type="file" accept=".json" className="hidden" onChange={handleFileImport} />
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border hover:border-gray-400 dark:hover:border-border-hover rounded-xl text-sm font-medium text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary transition-all cursor-pointer">
                          <Upload className="w-4 h-4" /> Import from File
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-text-muted mt-3">
                      Your data: <strong className="text-gray-700 dark:text-text-secondary">{tools.length} tools</strong>,{' '}
                      <strong className="text-gray-700 dark:text-text-secondary">{collections.length} collections</strong>
                    </p>
                  </Section>

                  <Section title="Manual Import (JSON)">
                    <button
                      onClick={() => setShowImport(!showImport)}
                      className="text-sm text-primary hover:underline"
                    >
                      {showImport ? 'Hide import' : 'Paste JSON to import'}
                    </button>
                    {showImport && (
                      <div className="mt-3 space-y-3">
                        <textarea
                          value={importText}
                          onChange={(e) => setImportText(e.target.value)}
                          placeholder='Paste your JSON backup here...'
                          rows={6}
                          className="w-full bg-gray-100 dark:bg-background-dark border-2 border-gray-200 dark:border-border rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-text-primary font-mono focus:border-primary outline-none resize-none"
                        />
                        <Button onClick={handleImport} disabled={!importText.trim()} leftIcon={<Upload className="w-4 h-4" />}>
                          Import Data
                        </Button>
                      </div>
                    )}
                  </Section>

                  <Section title="Danger Zone">
                    <div className="space-y-3">
                      {[
                        { key: 'tools', label: 'Clear All Tools', desc: 'Remove all tools but keep collections and settings', color: 'text-orange-500 dark:text-orange-400' },
                        { key: 'analytics', label: 'Clear Analytics', desc: 'Delete all usage history', color: 'text-yellow-600 dark:text-yellow-400' },
                        { key: 'all', label: 'Factory Reset', desc: 'Remove everything and start fresh', color: 'text-red-600 dark:text-red-500' },
                      ].map((action) => (
                        <div key={action.key} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-background-dark border-2 border-gray-200 dark:border-border rounded-xl gap-4">
                          <div>
                            <p className={cn('text-sm font-medium', action.color)}>{action.label}</p>
                            <p className="text-xs text-gray-500 dark:text-text-muted mt-0.5">{action.desc}</p>
                          </div>
                          {showClearConfirm === action.key ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleClear(action.key)}
                                className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-medium hover:bg-red-600 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setShowClearConfirm(null)}
                                className="px-3 py-1.5 bg-white dark:bg-background-card text-gray-600 dark:text-text-secondary text-xs rounded-lg hover:text-gray-900 dark:hover:text-text-primary transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowClearConfirm(action.key)}
                              className={cn('flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-lg text-xs font-medium transition-all',
                                action.key === 'all' ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' : 'border-gray-200 dark:border-border text-gray-600 dark:text-text-secondary hover:text-orange-400 hover:border-orange-400/30'
                              )}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {action.key === 'all' ? 'Reset' : 'Clear'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {showClearConfirm && (
                      <div className="flex items-center gap-2 text-orange-400 text-xs mt-2">
                        <AlertTriangle className="w-4 h-4" />
                        This action cannot be undone.
                      </div>
                    )}
                  </Section>
                </>
              )}

              {/* ── PRIVACY POLICY ─────────────────────────────────────── */}
              {activeTab === 'privacy' && (
                <Section title="Privacy Policy">
                  <div className="space-y-4 text-sm text-gray-600 dark:text-text-secondary">
                    <p className="text-xs text-gray-500 dark:text-text-muted italic">Last updated: March 2026</p>
                    
                    <div className="prose dark:prose-invert max-w-none">
                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">1. Introduction</h4>
                      <p>
                        AIPulse ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, 
                        and safeguard your information when you use our AI tool management application.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">2. Information We Collect</h4>
                      <p>We collect the following types of information:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                        <li><strong>Tool Data:</strong> AI tools you add, including names, URLs, categories, and metadata</li>
                        <li><strong>Usage Statistics:</strong> How often you use each tool, favorites, and interaction patterns</li>
                        <li><strong>Collections:</strong> Custom collections and workflows you create</li>
                        <li><strong>Preferences:</strong> Theme settings, display preferences, and behavioral settings</li>
                      </ul>
                      <p className="mt-3">
                        All data is stored locally in your browser. We do not collect personal information or transmit your data to external servers.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">3. How We Use Your Information</h4>
                      <p>Your information is used solely to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                        <li>Provide and maintain the AIPulse application</li>
                        <li>Enable you to organize and manage your AI tools</li>
                        <li>Track usage statistics for your personal insights</li>
                        <li>Improve user experience and application functionality</li>
                      </ul>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">4. Data Storage & Security</h4>
                      <p>
                        All your data is stored locally in your browser using localStorage technology. You have full control over your data 
                        and can export or delete it at any time through the Settings page.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">5. Third-Party Services</h4>
                      <p>
                        AIPulse may contain links to external AI tool websites. We are not responsible for the privacy practices 
                        or content of these third-party sites.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">6. Your Rights</h4>
                      <p>You have the right to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                        <li>Access all your stored data</li>
                        <li>Export your data in JSON format</li>
                        <li>Delete any or all of your data</li>
                        <li>Modify or update your information at any time</li>
                      </ul>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">7. Changes to This Policy</h4>
                      <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                        Privacy Policy on this page and updating the "Last updated" date.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">8. Contact Us</h4>
                      <p>
                        If you have any questions about this Privacy Policy, please contact us through the Contact section in Settings.
                      </p>
                    </div>
                  </div>
                </Section>
              )}

              {/* ── TERMS OF SERVICE ───────────────────────────────────── */}
              {activeTab === 'terms' && (
                <Section title="Terms of Service">
                  <div className="space-y-4 text-sm text-gray-600 dark:text-text-secondary">
                    <p className="text-xs text-gray-500 dark:text-text-muted italic">Last updated: March 2026</p>
                    
                    <div className="prose dark:prose-invert max-w-none">
                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">1. Acceptance of Terms</h4>
                      <p>
                        By accessing and using AIPulse, you accept and agree to be bound by the terms and provision of this agreement. 
                        If you do not agree to abide by these terms, please do not use this application.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">2. License to Use</h4>
                      <p>
                        AIPulse grants you a revocable, non-exclusive, non-transferable, limited license to use the software solely 
                        for your personal or internal business purposes.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">3. User Responsibilities</h4>
                      <p>You agree to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                        <li>Use AIPulse only for lawful purposes</li>
                        <li>Maintain the security of your browser and device</li>
                        <li>Be responsible for maintaining backups of your data</li>
                        <li>Not attempt to gain unauthorized access to the application</li>
                        <li>Not use the application to store or transmit harmful code</li>
                      </ul>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">4. Intellectual Property</h4>
                      <p>
                        The AIPulse name, logo, and all original content, features, and functionality are owned by AIPulse and are 
                        protected by international copyright, trademark, and other intellectual property laws.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">5. Disclaimer of Warranties</h4>
                      <p>
                        AIPulse is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. 
                        We do not warrant that the application will be uninterrupted, error-free, or completely secure.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">6. Limitation of Liability</h4>
                      <p>
                        To the fullest extent permitted by law, AIPulse shall not be liable for any indirect, incidental, special, 
                        consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
                        or any loss of data, use, goodwill, or other intangible losses.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">7. Data Backup</h4>
                      <p>
                        You are responsible for regularly backing up your data. While we provide export functionality, we are not 
                        responsible for any data loss due to browser issues, device failures, or other circumstances.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">8. Modifications to Service</h4>
                      <p>
                        We reserve the right to modify or discontinue, temporarily or permanently, the application with or without notice. 
                        You agree that we shall not be liable to you or to any third party for any modification, suspension, or discontinuance.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">9. Governing Law</h4>
                      <p>
                        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the 
                        developer operates, without regard to its conflict of law provisions.
                      </p>

                      <h4 className="font-semibold text-gray-900 dark:text-text-primary mt-4 mb-2">10. Contact Information</h4>
                      <p>
                        For any questions regarding these Terms of Service, please use the Contact option in the Settings page.
                      </p>
                    </div>
                  </div>
                </Section>
              )}

              {/* ── ABOUT ──────────────────────────────────────────────── */}
              {activeTab === 'about' && (
                <Section title="About AIPulse">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-background-dark border-2 border-gray-200 dark:border-border rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                        <Zap className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-text-primary text-lg">AIPulse</h3>
                        <p className="text-gray-500 dark:text-text-muted text-sm">Version 2.0.0 · March 2026</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Tools', value: tools.length },
                        { label: 'Collections', value: collections.length },
                      ].map((s) => (
                        <div key={s.label} className="p-4 bg-gray-100 dark:bg-background-dark border-2 border-gray-200 dark:border-border rounded-xl">
                          <p className="text-2xl font-bold text-primary">{s.value}</p>
                          <p className="text-sm text-gray-500 dark:text-text-muted">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-text-secondary">
                      AIPulse is your personal AI tools hub — organize, launch, and track all your AI tools in one place.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a href="#" className="text-sm text-primary hover:underline">Privacy Policy</a>
                      <span className="text-gray-400 dark:text-text-muted">·</span>
                      <a href="#" className="text-sm text-primary hover:underline">Send Feedback</a>
                      <span className="text-gray-400 dark:text-text-muted">·</span>
                      <a href="#" className="text-sm text-primary hover:underline">Documentation</a>
                    </div>
                  </div>
                </Section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl p-5">
      <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-4 text-sm uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ label, description, value, onChange }: { label: string; description?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-text-primary">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-text-muted mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0',
          value ? 'bg-primary' : 'bg-gray-300 dark:bg-border'
        )}
      >
        <div className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200',
          value ? 'translate-x-5' : 'translate-x-0.5'
        )} />
      </button>
    </div>
  );
}


