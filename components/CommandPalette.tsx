import React, { useEffect, useRef, useState } from 'react';
import { MagnifyingGlass, ArrowRight, HardDrives, CreditCard, Palette, Pulse, FileText, Hash } from '@phosphor-icons/react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onRun: (query: string) => void;
}

// Static Definitions for Navigation Items
const NAV_ITEMS = [
  { id: 'nav-infra', label: 'Platform & Infra', icon: HardDrives, shortcut: 'G P' },
  { id: 'nav-checkout', label: 'Checkout & Pay', icon: CreditCard, shortcut: 'G C' },
  { id: 'nav-design', label: 'Design System', icon: Palette, shortcut: 'G D' },
  { id: 'nav-status', label: 'System Status', icon: Pulse },
];

const RECENT_ITEMS = [
  { id: 'rec-1', label: 'incident-report-10-24.pdf', icon: FileText, meta: '2h ago' },
  { id: 'rec-2', label: 'api-gateway-logs', icon: Hash, meta: '4h ago' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onRun }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Flatten items to a single list for easy index navigation
  const flatItems = [
      { id: 'ai-option', type: 'ai', label: 'Ask ObsAgent' },
      ...NAV_ITEMS.map(i => ({ ...i, type: 'nav' })),
      ...RECENT_ITEMS.map(i => ({ ...i, type: 'recent' }))
  ];

  useEffect(() => {
    if (isOpen) {
      // Reset state when opened
      setSelectedIndex(0);
      setQuery('');
      // Focus input
      const timer = setTimeout(() => {
          inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const executeAction = (index: number) => {
    const item = flatItems[index];
    if (item.type === 'ai') {
        // If query is empty, we might want a default message, or just pass empty string which app handles
        onRun(query || "Start a new conversation");
    } else {
        // For demo purposes, we treat clicking other items as running a command or navigating
        // In a real app this would trigger routing
        onRun(`Navigate to ${item.label || item.id}`);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatItems.length);
        // Optional: Scroll into view logic could go here
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        executeAction(selectedIndex);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal - Glassmorphism applied here */}
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-[#121215]/90 backdrop-blur-2xl rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700/50 overflow-hidden flex flex-col animate-slide-up transform origin-top ring-1 ring-black/5 dark:ring-white/10">
        
        {/* Input Header */}
        <div className="flex items-center px-5 py-5 border-b-2 border-gray-200/50 dark:border-gray-700/50">
            <div className="p-1 text-gray-400 dark:text-gray-500">
                <MagnifyingGlass weight="bold" className="w-6 h-6" />
            </div>
            <input 
                ref={inputRef}
                type="text" 
                placeholder="Ask ObsAgent or search..." 
                className="flex-1 text-xl font-medium font-display text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 bg-transparent border-none outline-none px-4"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0); // Reset selection on type
                }}
                onKeyDown={handleKeyDown}
            />
            <div className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border border-gray-200 dark:border-gray-700/50">
                ESC
            </div>
        </div>

        {/* Results Area */}
        <div ref={containerRef} className="max-h-[450px] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
            
            {/* AI Suggestion Section */}
             <div className="mb-4">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-display">Ask Intelligence</div>
                <div 
                    onClick={() => executeAction(0)}
                    className={`
                        group flex items-center gap-4 px-4 py-3.5 rounded-lg cursor-pointer transition-colors border shadow-sm
                        ${selectedIndex === 0 
                            ? 'bg-corp-primary dark:bg-corp-primary text-white border-transparent' 
                            : 'bg-white/50 dark:bg-white/5 text-gray-900 dark:text-white border-gray-100 dark:border-gray-800 hover:border-transparent hover:bg-corp-primary hover:text-white'}
                    `}
                >
                    <div className={`
                        w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-white overflow-hidden
                        ${selectedIndex === 0
                            ? 'ring-2 ring-white/30'
                            : 'ring-1 ring-gray-200 dark:ring-gray-700'}
                    `}>
                        <img src="ObsTellLogo.png" alt="ObsAgent" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-bold font-display">Ask ObsAgent</div>
                        <div className={`text-xs truncate mt-0.5 ${selectedIndex === 0 ? 'text-white/80' : 'text-gray-500 dark:text-gray-400 group-hover:text-white/80'}`}>
                            {query ? `Query: ${query}` : 'Analyze alerts, logs, and metrics...'}
                        </div>
                    </div>
                    <ArrowRight weight="bold" className={`w-5 h-5 transition-all ${selectedIndex === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </div>
            </div>

            {/* Navigation Section */}
            <div className="mb-4">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-display">Jump to View</div>
                {NAV_ITEMS.map((item, i) => {
                    const actualIndex = 1 + i; // 1 (AI) + current index
                    const isSelected = selectedIndex === actualIndex;
                    return (
                        <CommandItem 
                            key={item.id}
                            icon={item.icon} 
                            label={item.label} 
                            shortcut={item.shortcut} 
                            isSelected={isSelected}
                            onClick={() => executeAction(actualIndex)}
                        />
                    );
                })}
            </div>

             {/* Recent Files */}
             <div className="mb-2">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-display">Recent Context</div>
                {RECENT_ITEMS.map((item, i) => {
                    const actualIndex = 1 + NAV_ITEMS.length + i;
                    const isSelected = selectedIndex === actualIndex;
                    return (
                        <CommandItem 
                            key={item.id}
                            icon={item.icon} 
                            label={item.label} 
                            meta={item.meta} 
                            isSelected={isSelected}
                            onClick={() => executeAction(actualIndex)}
                        />
                    );
                })}
            </div>

        </div>
        
        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50/80 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 backdrop-blur-md">
            <div className="flex gap-4">
                <span><strong className="text-gray-600 dark:text-gray-400">↵</strong> Select</span>
                <span><strong className="text-gray-600 dark:text-gray-400">↑↓</strong> Navigate</span>
            </div>
            <div className="font-mono opacity-60">
                ObsAgent v2.4.0
            </div>
        </div>
      </div>
    </div>
  );
};

interface CommandItemProps {
    icon: any;
    label: string;
    shortcut?: string;
    meta?: string;
    isSelected: boolean;
    onClick: () => void;
}

const CommandItem: React.FC<CommandItemProps> = ({ icon: Icon, label, shortcut, meta, isSelected, onClick }) => (
    <div 
        onClick={onClick}
        className={`
            group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors
            ${isSelected 
                ? 'bg-corp-primary text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'}
        `}
    >
        <Icon weight="bold" className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-200'}`} />
        <span className={`flex-1 text-sm font-medium ${isSelected ? 'text-white' : ''}`}>{label}</span>
        {shortcut && (
            <div className="flex gap-1">
                {shortcut.split(' ').map(key => (
                    <kbd key={key} className={`min-w-[20px] h-5 flex items-center justify-center rounded text-[10px] font-bold border ${isSelected ? 'bg-white/20 border-white/30 text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'}`}>{key}</kbd>
                ))}
            </div>
        )}
        {meta && (
            <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-400 dark:text-gray-600'}`}>{meta}</span>
        )}
    </div>
);
