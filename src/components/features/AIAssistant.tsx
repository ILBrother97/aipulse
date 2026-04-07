import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minimize2, Maximize2, Trash2, Zap, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useToolsStore } from '../../stores/toolsStore';
import { useZoomDetection } from '@/hooks/useZoomDetection';
import { cn } from '../../utils/cn';
import type { AITool } from '../../types/index';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  tools?: AITool[];
  actions?: Array<{
    label: string;
    action: 'navigate' | 'open-modal' | 'search';
    value?: string;
  }>;
  timestamp: number;
}

// ── Local intelligence (no API key required) ──────────────────────────
function getLocalResponse(input: string, tools: AITool[], recentlyUsed: string[], conversationHistory: Message[]): { text: string; tools: AITool[]; actions?: Array<{ label: string; action: 'navigate' | 'open-modal' | 'search'; value?: string }> } {
  const q = input.toLowerCase().trim();

  // Track question frequency
  const questionKey = q.split(' ')[0]; // Track by first word/category
  const questionStats: Record<string, number> = JSON.parse(localStorage.getItem('aipulse-question-stats') || '{}');
  questionStats[questionKey] = (questionStats[questionKey] || 0) + 1;
  localStorage.setItem('aipulse-question-stats', JSON.stringify(questionStats));

  // Get most asked question category
  const mostAsked = (Object.entries(questionStats) as [string, number][]).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Context-aware follow-up handling - must be checked first before other patterns
  const lastAssistantMessage = conversationHistory.filter(m => m.role === 'assistant').pop();
  
  // Check for follow-up patterns
  const isFollowUp = q.includes('what about') || q.includes('tell me more') || q.includes('the second one') || q.includes('the first one') || q.includes('another') || q.includes('also') || q.includes('more about') || q.includes('tell me about') || q.includes('and the') || q.includes('what else');
  
  if (lastAssistantMessage && isFollowUp) {
    // If the last response had tools, provide more details
    if (lastAssistantMessage.tools && lastAssistantMessage.tools.length > 0) {
      if (q.includes('second') || (q.includes('the') && q.includes('2'))) {
        if (lastAssistantMessage.tools[1]) {
          const tool = lastAssistantMessage.tools[1];
          return {
            text: `${tool.name} is a ${tool.category} tool. ${tool.description || 'No description available.'}\n\nYou can launch it directly from the main page.`,
            tools: [tool]
          };
        }
        return {
          text: `I only mentioned ${lastAssistantMessage.tools.length} tool${lastAssistantMessage.tools.length > 1 ? 's' : ''} in my previous response. Would you like me to suggest more tools in that category?`,
          tools: []
        };
      }
      if (q.includes('first') || (q.includes('the') && q.includes('1'))) {
        const tool = lastAssistantMessage.tools[0];
        return {
          text: `${tool.name} is a ${tool.category} tool. ${tool.description || 'No description available.'}\n\nYou can launch it directly from the main page.`,
          tools: [tool]
        };
      }
      // General "tell me more" about the tools
      return {
        text: `These tools can help you with various tasks. Each tool in your collection has been categorized for easy discovery. You can launch any of them directly from the main page to explore their features.`,
        tools: lastAssistantMessage.tools
      };
    }
    
    // If no tools but user wants more info, provide contextual response based on last message
    if (lastAssistantMessage.text.toLowerCase().includes('analytics')) {
      return {
        text: `The Analytics page shows your tool usage statistics including total launches, most-used tools, category breakdown, and usage trends over time. Would you like me to navigate you there?`,
        tools: [],
        actions: [{ label: 'Go to Analytics', action: 'navigate', value: 'analytics' }]
      };
    }
    if (lastAssistantMessage.text.toLowerCase().includes('collection')) {
      return {
        text: `Collections help you organize your tools into custom groups. You can create collections for different projects, categories, or any grouping that makes sense for your workflow. Tools can be added to multiple collections.`,
        tools: []
      };
    }
    
    // Default follow-up response
    return {
      text: `I'd be happy to help you learn more! You can ask me about specific tool categories like writing, image generation, video editing, or productivity. I can also help you navigate the app or explain features like collections and analytics.`,
      tools: []
    };
  }

  // Personalized greeting based on usage
  if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
    const personalizedGreeting = mostAsked 
      ? ` Hi! I noticed you often ask about **${mostAsked}**. How can I help today?`
      : ` Hi! I can help you find AI tools, navigate the app, or answer questions about features.`;
    return {
      text: personalizedGreeting,
      tools: []
    };
  }

  // Writing tools
  if (q.includes('writing') || q.includes('write') || q.includes('text') || q.includes('copy') || q.includes('content')) {
    const matches = tools.filter(t => 
      t.category.toLowerCase().includes('writing') || 
      t.category.toLowerCase().includes('text') ||
      t.name.toLowerCase().includes('chat') ||
      t.name.toLowerCase().includes('claude') ||
      t.name.toLowerCase().includes('gemini') ||
      t.description?.toLowerCase().includes('writing')
    ).slice(0, 4);
    
    if (matches.length > 0) {
      return {
        text: `Here are the writing tools in your collection:\n\n${matches.map(t => `• ${t.name} — ${t.description || t.category}`).join('\n')}\n\nYou can launch any of these directly from the main page.`,
        tools: matches
      };
    }
    
    return {
      text: `I don't see any writing tools in your collection. Try adding tools like ChatGPT, Claude, or Writesonic to your collection.`,
      tools: []
    };
  }

  // Image tools
  if (q.includes('image') || q.includes('photo') || q.includes('picture') || q.includes('visual') || q.includes('design')) {
    const matches = tools.filter(t => 
      t.category.toLowerCase().includes('image') || 
      t.category.toLowerCase().includes('photo') ||
      t.category.toLowerCase().includes('design') ||
      t.name.toLowerCase().includes('midjourney') ||
      t.name.toLowerCase().includes('dall') ||
      t.name.toLowerCase().includes('photo')
    ).slice(0, 4);
    
    if (matches.length > 0) {
      return {
        text: `Here are the image tools in your collection:\n\n${matches.map(t => `• ${t.name} — ${t.description || t.category}`).join('\n')}\n\nYou can launch any of these directly from the main page.`,
        tools: matches
      };
    }
    
    return {
      text: `I don't see any image tools in your collection. Try adding tools like Midjourney, DALL-E, or Photoroom to your collection.`,
      tools: []
    };
  }

  // Video tools
  if (q.includes('video') || q.includes('movie') || q.includes('film') || q.includes('clip')) {
    const matches = tools.filter(t => 
      t.category.toLowerCase().includes('video') || 
      t.category.toLowerCase().includes('audio') ||
      t.name.toLowerCase().includes('runway') ||
      t.name.toLowerCase().includes('lumen') ||
      t.name.toLowerCase().includes('fliki')
    ).slice(0, 4);
    
    if (matches.length > 0) {
      return {
        text: `Here are the video tools in your collection:\n\n${matches.map(t => `• ${t.name} — ${t.description || t.category}`).join('\n')}\n\nYou can launch any of these directly from the main page.`,
        tools: matches
      };
    }
    
    return {
      text: `I don't see any video tools in your collection. Try adding tools like Runway ML, Lumen5, or Fliki to your collection.`,
      tools: []
    };
  }

  // Voice/audio tools
  if (q.includes('voice') || q.includes('audio') || q.includes('sound') || q.includes('speech') || q.includes('speak')) {
    const matches = tools.filter(t => 
      t.category.toLowerCase().includes('audio') || 
      t.category.toLowerCase().includes('voice') ||
      t.name.toLowerCase().includes('eleven') ||
      t.name.toLowerCase().includes('murf') ||
      t.name.toLowerCase().includes('speech')
    ).slice(0, 4);
    
    if (matches.length > 0) {
      return {
        text: `Here are the audio tools in your collection:\n\n${matches.map(t => `• ${t.name} — ${t.description || t.category}`).join('\n')}\n\nYou can launch any of these directly from the main page.`,
        tools: matches
      };
    }
    
    return {
      text: `I don't see any audio tools in your collection. Try adding tools like ElevenLabs, Murf AI, or Speechify to your collection.`,
      tools: []
    };
  }

  // Coding tools
  if (q.includes('code') || q.includes('programming') || q.includes('developer') || q.includes('coding')) {
    const matches = tools.filter(t => 
      t.category.toLowerCase().includes('code') || 
      t.category.toLowerCase().includes('development') ||
      t.name.toLowerCase().includes('copilot') ||
      t.name.toLowerCase().includes('github')
    ).slice(0, 4);
    
    if (matches.length > 0) {
      return {
        text: `Here are the coding tools in your collection:\n\n${matches.map(t => `• ${t.name} — ${t.description || t.category}`).join('\n')}\n\nYou can launch any of these directly from the main page.`,
        tools: matches
      };
    }
    
    return {
      text: `I don't see any coding tools in your collection. Try adding tools like GitHub Copilot or Chatbase to your collection.`,
      tools: []
    };
  }

  // Research tools
  if (q.includes('research') || q.includes('search') || q.includes('find information') || q.includes('lookup')) {
    const matches = tools.filter(t => 
      t.category.toLowerCase().includes('research') || 
      t.name.toLowerCase().includes('perplexity') ||
      t.name.toLowerCase().includes('chatpdf') ||
      t.name.toLowerCase().includes('genspark')
    ).slice(0, 4);
    
    if (matches.length > 0) {
      return {
        text: `Here are the research tools in your collection:\n\n${matches.map(t => `• ${t.name} — ${t.description || t.category}`).join('\n')}\n\nYou can launch any of these directly from the main page.`,
        tools: matches
      };
    }
    
    return {
      text: `I don't see any research tools in your collection. Try adding tools like Perplexity AI, ChatPDF, or Genspark to your collection.`,
      tools: []
    };
  }

  // Automation tools
  if (q.includes('automation') || q.includes('automate') || q.includes('workflow') || q.includes('integrate')) {
    const matches = tools.filter(t => 
      t.category.toLowerCase().includes('automation') || 
      t.name.toLowerCase().includes('zapier') ||
      t.name.toLowerCase().includes('bardeen')
    ).slice(0, 4);
    
    if (matches.length > 0) {
      return {
        text: `Here are the automation tools in your collection:\n\n${matches.map(t => `• ${t.name} — ${t.description || t.category}`).join('\n')}\n\nYou can launch any of these directly from the main page.`,
        tools: matches
      };
    }
    
    return {
      text: `I don't see any automation tools in your collection. Try adding tools like Zapier or Bardeen to your collection.`,
      tools: []
    };
  }

  // Productivity tools
  if (q.includes('productivity') || q.includes('efficient') || q.includes('organize') || q.includes('manage')) {
    const matches = tools.filter(t => 
      t.category.toLowerCase().includes('productivity') || 
      t.name.toLowerCase().includes('notion') ||
      t.name.toLowerCase().includes('otter') ||
      t.name.toLowerCase().includes('fireflies')
    ).slice(0, 4);
    
    if (matches.length > 0) {
      return {
        text: `Here are the productivity tools in your collection:\n\n${matches.map(t => `• ${t.name} — ${t.description || t.category}`).join('\n')}\n\nYou can launch any of these directly from the main page.`,
        tools: matches
      };
    }
    
    return {
      text: `I don't see any productivity tools in your collection. Try adding tools like Notion AI, Otter.ai, or Fireflies to your collection.`,
      tools: []
    };
  }

  // Collections
  if (q.includes('collection') || q.includes('create collection') || q.includes('organize tools')) {
    return {
      text: `Collections help you organize tools into custom groups. Click the collections tab, then create a new collection with a name and color. Add tools by clicking the menu on any tool card and selecting "Add to Collection".`,
      tools: []
    };
  }

  // Keyboard shortcuts
  if (q.includes('shortcut') || q.includes('keyboard') || q.includes('hotkey') || q.includes('quick')) {
    return {
      text: `**Keyboard Shortcuts:**\n\n- Ctrl+K — Focus search bar\n- Ctrl+D — Go to Analytics page\n- Ctrl+S — Open Settings\n- Ctrl+1-4 — Switch view modes\n- Ctrl+/ — Show all keyboard shortcuts\n\nPress Ctrl+/ to see the full shortcuts modal.`,
      tools: []
    };
  }

  // Analytics / most used
  if (q.includes('analytics') || q.includes('usage') || q.includes('most used') || q.includes('statistic')) {
    return {
      text: `View your tool usage statistics in the Analytics page. You can see total launches, most-used tools, category breakdown, and usage trends over time.`,
      tools: [],
      actions: [
        { label: 'Go to Analytics', action: 'navigate', value: 'analytics' }
      ]
    };
  }

  // Settings / themes
  if (q.includes('setting') || q.includes('theme') || q.includes('customize') || q.includes('color')) {
    return {
      text: `Access Settings via the gear icon. You can choose from 5 themes: Default Teal, Midnight Purple, Ocean Blue, Forest Green, and Sunset Orange. You can also toggle dark mode, change launch behavior, and adjust accessibility options.`,
      tools: [],
      actions: [
        { label: 'Open Settings', action: 'navigate', value: 'settings' }
      ]
    };
  }

  // Navigation
  if (q.includes('navigate') || q.includes('go to') || q.includes('open') || q.includes('where is')) {
    return {
      text: `Use the navigation on the left to access different pages. Home shows your tools, Analytics displays usage stats, and Settings lets you customize your experience. You can also use keyboard shortcuts for quick navigation.`,
      tools: []
    };
  }

  // Add tool
  if (q.includes('add tool') || q.includes('new tool') || q.includes('create tool')) {
    return {
      text: `Click the "Add Tool" button on the home page. Enter the tool name, URL, category, and optional description. Choose an icon and save. Your custom tool will appear in your collection.`,
      tools: [],
      actions: [
        { label: 'Add New Tool', action: 'open-modal', value: 'add-tool' }
      ]
    };
  }

  // Default response with personalization
  const toolMap = new Map(tools.map(t => [t.id, t]));
  const recentTools = recentlyUsed.slice(0, 3).map(id => toolMap.get(id)).filter((t): t is AITool => t !== undefined);
  
  let personalizedHelp = `I can help you find AI tools, navigate the app, or answer questions about features. Try asking about writing tools, video editing, collections, keyboard shortcuts, or settings.`;
  
  if (recentTools.length > 0) {
    const toolNames = recentTools.map(t => t.name).join(', ');
    personalizedHelp = `I notice you've been using **${toolNames}** recently. I can help you find similar tools, navigate the app, or answer questions about features. Try asking about writing tools, video editing, collections, or keyboard shortcuts.`;
  }
  
  return {
    text: personalizedHelp,
    tools: []
  };
}

// ── Suggestion chips ─────────────────────────────────────────────────
const SUGGESTIONS = [
  "Find me a writing tool",
  "What video tools are available?",
  "How do I create a collection?",
  "Show me keyboard shortcuts",
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
      text: "Hi! I'm your AIPulse Assistant. I can help you find tools, organize your collection, and answer questions about using AIPulse. What can I help you with?",
      tools: [],
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { tools, recordUsage, recentlyUsed, setCurrentPage } = useToolsStore();
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

    const response = getLocalResponse(query, tools, recentlyUsed, messages);
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: response.text,
      tools: response.tools,
      actions: response.actions,
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

  const handleAction = (action: string, value?: string) => {
    if (action === 'navigate' && value) {
      setCurrentPage(value as any);
      setIsOpen(false);
    } else if (action === 'open-modal' && value === 'add-tool') {
      // This would require passing onAddTool from parent
      // For now, just close the chat
      setIsOpen(false);
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
              'fixed z-50 bg-white dark:bg-[#0d1117] border border-[#cbd5e1] dark:border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl flex flex-col overflow-hidden',
              chatWidth, chatHeight,
              'max-sm:right-2 max-sm:left-2 max-sm:w-auto max-sm:max-h-[calc(85dvh-80px)]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#cbd5e1] dark:border-[rgba(255,255,255,0.08)] bg-[#ffffff] dark:bg-[#111827] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                  <img src="/logo.svg" alt="AIPulse" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#1e293b] dark:text-[#f1f5f9]">AIPulse Assistant</p>
                  <p className="text-[12px] text-[var(--color-primary)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="p-1.5 rounded-lg text-[#64748b] dark:text-[#475569] hover:text-[#1e293b] dark:hover:text-[#f1f5f9] hover:bg-[#f1f5f9] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors" title="Clear chat">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-lg text-[#64748b] dark:text-[#475569] hover:text-[#1e293b] dark:hover:text-[#f1f5f9] hover:bg-[#f1f5f9] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors" title="Expand">
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-[#64748b] dark:text-[#475569] hover:text-[#1e293b] dark:hover:text-[#f1f5f9] hover:bg-[#f1f5f9] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0 chat-messages bg-[#f1f5f9] dark:bg-[#0a0e1a]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    </div>
                  )}
                  <div className={cn('max-w-[85%] space-y-2', msg.role === 'user' ? 'items-end' : 'items-start')}>
                    <div className={cn(
                      'px-[14px] py-[10px] rounded-xl text-[13px] leading-[1.6]',
                      msg.role === 'user'
                        ? 'bg-[var(--color-primary)] text-[#0a0e1a] dark:text-[#ffffff] rounded-br-none'
                        : 'bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[rgba(255,255,255,0.06)] text-[#1e293b] dark:text-[#e2e8f0] rounded-bl-none'
                    )}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            a: ({ href, children }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline">
                                {children}
                              </a>
                            ),
                            code: ({ className, children }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                                  {children}
                                </code>
                              ) : (
                                <code className="block p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono overflow-x-auto">
                                  {children}
                                </code>
                              );
                            },
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                            li: ({ children }) => <li className="ml-2">{children}</li>,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      )}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {msg.actions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleAction(action.action, action.value)}
                              className="px-3 py-1.5 text-xs font-medium bg-[var(--color-primary)] text-[#0a0e1a] dark:text-[#0a0e1a] rounded-lg hover:opacity-90 transition-opacity"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
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
                  <div className="w-7 h-7 rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[rgba(255,255,255,0.06)] rounded-xl rounded-bl-none">
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-[#64748b]"
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
              <div className="px-4 pb-2 flex gap-1.5 flex-wrap flex-shrink-0 max-h-24 overflow-y-auto chat-suggestions bg-white dark:bg-[#0d1117]">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 text-[12px] bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[rgba(255,255,255,0.1)] rounded-full text-[#475569] dark:text-[#94a3b8] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#cbd5e1] dark:border-[rgba(255,255,255,0.08)] flex-shrink-0 bg-white dark:bg-[#0d1117]">
              <div className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 focus-within:border-[var(--color-primary)] transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your tools..."
                  className="flex-1 bg-transparent text-[13px] text-[#1e293b] dark:text-[#f1f5f9] placeholder:text-[#94a3b8] dark:placeholder:text-[#475569] outline-none min-w-0"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="flex-shrink-0 p-1.5 rounded-lg bg-[var(--color-primary)] text-[#0a0e1a] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all w-9 h-9"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-center text-[11px] text-[#64748b] dark:text-[#334155] mt-2">Powered by AIPulse Intelligence</p>
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
