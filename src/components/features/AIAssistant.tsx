import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minimize2, Maximize2, Trash2, Zap, ExternalLink } from 'lucide-react';
import { useToolsStore } from '../../stores/toolsStore';
import { useZoomDetection } from '@/hooks/useZoomDetection';
import { cn } from '../../utils/cn';
import type { AITool } from '../../types/index';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  tools?: AITool[];
  timestamp: number;
}

// ── Local intelligence (no API key required) ──────────────────────────
function getLocalResponse(input: string, tools: AITool[], recentIds: string[]): { text: string; tools: AITool[] } {
  const q = input.toLowerCase();

  // Website help and navigation
  if (q.includes('help') || q.includes('how to') || q.includes('tutorial') || q.includes('getting started')) {
    return {
      text: `🚀 **AIPulse Complete Help Center**

## 🎯 Getting Started Guide

**First Steps:**
1. **Explore the Interface**: Familiarize yourself with the layout
2. **Add Your First Tool**: Click "Add Tool" to build your collection
3. **Create Collections**: Organize tools by project or category
4. **Set Up Favorites**: Star frequently used tools
5. **Browse Categories**: Discover tools by type

**Core Concepts:**
• **Tools**: Individual AI applications you use
• **Collections**: Custom groups of related tools
• **Categories**: Pre-defined tool types
• **Favorites**: Quick-access starred tools
• **Analytics**: Usage tracking and insights

**Essential Features:**
• **Search Bar**: Real-time tool search with filters
• **View Modes**: Grid, List, Expanded, Kanban layouts
• **Theme System**: Light/dark modes with custom accents
• **Keyboard Shortcuts**: Power-user navigation
• **Activity Log**: Track all your actions
• **Import/Export**: Backup and share your tool collection

**Keyboard Shortcuts:**
• **Ctrl+K**: Focus search bar
• **Ctrl+N**: Add new tool
• **Ctrl+D**: Go to Analytics
• **Ctrl+S**: Open Settings
• **?**: Show keyboard shortcuts

What specific area would you like to explore in detail?`,
      tools: []
    };
  }

  // Tool search
  if (q.includes('tool') || q.includes('find') || q.includes('recommend')) {
    const matches = tools
      .filter(t => 
        t.name.toLowerCase().includes(q.replace(/tool|find|recommend|best|for/g, '').trim()) ||
        t.category.toLowerCase().includes(q.replace(/tool|find|recommend|best|for/g, '').trim())
      )
      .slice(0, 3);
    
    if (matches.length > 0) {
      return {
        text: `Here are some tools that might help:\n\n${matches.map(t => `• **${t.name}** (${t.category})${t.description ? ` - ${t.description}` : ''}`).join('\n')}`,
        tools: matches
      };
    }
  }

  // Analytics queries
  if (q.includes('usage') || q.includes('analytics') || q.includes('stats')) {
    return {
      text: `📊 **Your Analytics Overview**

You can view detailed usage statistics in the Analytics page:
• Total tool launches
• Most-used tools
• Category breakdown
• Usage trends over time

Click "Analytics" in the navigation to see your full dashboard!`,
      tools: []
    };
  }

  // Collections
  if (q.includes('collection') || q.includes('organize')) {
    return {
      text: `📁 **Collections Guide**

Collections help you organize tools into custom groups:

**Creating Collections:**
1. Click "New Collection" button
2. Name your collection and pick a color
3. Add tools by clicking "Add to Collection"

**Popular Collection Ideas:**
• Daily tools you use frequently
• Project-specific tool sets
• Tools by category or purpose
• Favorite or recommended tools`,
      tools: []
    };
  }

  // Settings
  if (q.includes('setting') || q.includes('theme') || q.includes('customize')) {
    return {
      text: `⚙️ **Settings & Customization**

**Appearance:**
• Light/Dark mode toggle
• 8 accent color options
• Font size adjustments
• Animation intensity

**View Options:**
• Grid, List, Expanded, Kanban layouts
• Compact/Standard/Spacious spacing
• Border radius preferences

Access Settings via the gear icon in the header!`,
      tools: []
    };
  }

  // Default response
  return {
    text: `I'm here to help you get the most out of AIPulse! 

**You can ask me about:**
• Finding specific tools for your needs
• How to use features like collections and analytics
• Keyboard shortcuts and productivity tips
• Organizing and managing your tool library

What would you like to know?`,
    tools: []
  };
}

// ── Suggestion chips ─────────────────────────────────────────────────
const SUGGESTIONS = [
  "Find me writing tools",
  "How do collections work?",
  "Show my most used tools",
  "Keyboard shortcuts",
];

// ── Component ─────────────────────────────────────────────────────────
export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "👋 Hi! I'm your AIPulse Assistant. I can help you find tools, organize your collection, and answer questions about using AIPulse. What can I help you with?",
      tools: [],
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { tools, recordUsage, recentlyUsed } = useToolsStore();
  const { level: zoomLevel, isZoomed, visualViewport } = useZoomDetection();

  const fabStyles = useMemo(() => {
    const baseMargin = 24;
    const mobileMargin = 16;
    const scaleFactor = 1 / Math.min(Math.max(zoomLevel, 0.5), 2);
    const scaledBaseMargin = baseMargin * scaleFactor;
    const scaledMobileMargin = mobileMargin * scaleFactor;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const margin = isMobile ? scaledMobileMargin : scaledBaseMargin;
    const buttonSize = Math.max(48, 56 * scaleFactor);

    let bottomOffset = margin;
    let rightOffset = margin;

    if (visualViewport && isZoomed) {
      const viewportScale = visualViewport.scale;
      bottomOffset = margin / viewportScale;
      rightOffset = margin / viewportScale;
    }

    return {
      width: buttonSize,
      height: buttonSize,
      bottom: bottomOffset,
      right: rightOffset,
      zIndex: isZoomed ? 2000 : 1000,
      scale: Math.min(scaleFactor, 1),
    };
  }, [zoomLevel, isZoomed, visualViewport]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const query = text ?? input.trim();
    if (!query) return;

    setInput('');
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: query,
      tools: [],
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate brief thinking time
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const response = getLocalResponse(query, tools, recentlyUsed);
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: response.text,
      tools: response.tools,
      timestamp: Date.now(),
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      text: "Chat cleared! How can I help you today?",
      tools: [],
      timestamp: Date.now(),
    }]);
  };

  const chatWidth = isExpanded ? 'w-[480px]' : 'w-[360px]';
  const chatHeight = isExpanded ? 'max-h-[calc(85vh-80px)] min-h-[400px]' : 'max-h-[calc(80vh-80px)] min-h-[500px]';

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
            style={{
              bottom: 'clamp(80px, 12vh, 120px)',
              right: 'clamp(12px, 2vw, 24px)',
              maxHeight: 'min(calc(100dvh - 140px), 600px)',
            }}
            className={cn(
              'fixed z-50 bg-white dark:bg-background-card border-2 border-gray-200 dark:border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden',
              chatWidth, chatHeight,
              'max-sm:right-2 max-sm:left-2 max-sm:w-auto max-sm:max-h-[calc(85dvh-80px)]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-border bg-gray-100 dark:bg-background-dark/50 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                  <img src="/logo.svg" alt="AIPulse" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-text-primary">AIPulse Assistant</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card transition-colors" title="Clear chat">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card transition-colors" title="Expand">
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-background-card transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0 chat-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={cn('max-w-[85%] space-y-2', msg.role === 'user' ? 'items-end' : 'items-start')}
>
                    <div className={cn(
                      'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-primary text-black rounded-tr-sm'
                        : 'bg-gray-100 dark:bg-background-dark text-gray-900 dark:text-text-primary rounded-tl-sm'
                    )}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {/* Tool results */}
                    {msg.tools && msg.tools.length > 0 && (
                      <div className="space-y-1.5 w-full">
                        {msg.tools.map((tool) => (
                          <div key={tool.id} className="flex items-center gap-2.5 px-3 py-2 bg-gray-100 dark:bg-background-dark border border-gray-200 dark:border-border rounded-xl hover:border-primary/50 transition-colors group">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 dark:text-text-primary truncate">{tool.name}</p>
                              <p className="text-xs text-gray-500 dark:text-text-muted truncate">{tool.category}</p>
                            </div>
                            <button
                              onClick={() => {
                                recordUsage(tool.id);
                                window.open(tool.url, '_blank', 'noopener,noreferrer');
                              }}
                              className="flex-shrink-0 p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100"
                              title="Launch"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="px-4 py-3 bg-gray-100 dark:bg-background-dark rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-text-muted"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex gap-1.5 flex-wrap flex-shrink-0 max-h-24 overflow-y-auto chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 text-xs bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-full text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/30 hover:border-primary/50 dark:hover:border-primary/60 transition-all font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-border flex-shrink-0">
              <div className="flex items-center gap-2 bg-white dark:bg-background-card border-2 border-primary/30 dark:border-primary/40 rounded-xl px-3 py-2 focus-within:border-primary transition-colors shadow-sm">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your tools..."
                  className="flex-1 bg-transparent text-sm text-gray-900 dark:text-text-primary placeholder:text-primary/60 dark:placeholder:text-primary/50 outline-none min-w-0 font-medium"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="flex-shrink-0 p-1.5 rounded-lg bg-primary text-black hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-center text-xs text-gray-500 dark:text-text-muted mt-2">Powered by AIPulse Intelligence</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className={cn(
          'ai-fab fixed flex items-center justify-center rounded-full transition-all duration-300',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/50',
          'ai-fab--zoom-aware',
          isOpen
            ? 'ai-fab--active'
            : 'ai-fab--default'
        )}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        aria-expanded={isOpen}
        style={{
          width: fabStyles.width,
          height: fabStyles.height,
          bottom: fabStyles.bottom,
          right: fabStyles.right,
          zIndex: fabStyles.zIndex,
        }}
      >
        {/* Pulse ring animation */}
        {!isOpen && (
          <span className="ai-fab__pulse" aria-hidden="true" />
        )}
        
        {/* Glow effect */}
        <span className="ai-fab__glow" aria-hidden="true" />
        
        {/* Icon container */}
        <span className="ai-fab__icon-wrapper relative z-10">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex"
              >
                <img 
                  src="/logo.svg" 
                  alt="AIPulse AI" 
                  className="w-5 h-5 sm:w-6 sm:h-6" 
                />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        {/* Loading indicator */}
        {isTyping && (
          <span className="ai-fab__loading" aria-hidden="true" />
        )}
      </motion.button>
    </>
  );
}
