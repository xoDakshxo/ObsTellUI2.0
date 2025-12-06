import React, { useState } from 'react';
import { PaperPlaneRight, At, Command } from '@phosphor-icons/react';

interface CommanderProps {
    isSidebarCollapsed: boolean;
    isChatOpen: boolean;
    onRun: (query: string) => void;
}

export const Commander: React.FC<CommanderProps> = ({ isSidebarCollapsed, isChatOpen, onRun }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    onRun(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
  };

  return (
    <div 
        className={`
            fixed bottom-8 flex justify-center px-8 z-40 pointer-events-none
            transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1)
            ${isSidebarCollapsed ? 'left-[90px]' : 'left-[320px]'}
            ${isChatOpen ? 'right-[420px]' : 'right-0'}
        `}
    >
      <div className="w-full max-w-2xl pointer-events-auto">
        <div className="group relative flex items-center bg-white/90 dark:bg-black/80 backdrop-blur-xl border-2 border-corp-border rounded-xl shadow-corp-lg p-2 transition-all hover:shadow-corp-xl focus-within:ring-2 focus-within:ring-corp-primary/20">
            
            {/* Input Area */}
            <div className="flex-1 flex items-center">
                 <div className="pl-3 pr-3 text-gray-400">
                    <Command weight="bold" className="w-5 h-5" />
                </div>
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Share update to feed or tag @ObsAgent..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium text-[15px] py-2.5"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 pr-1">
                <button className="p-2 text-gray-400 hover:text-corp-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Mention">
                    <At weight="bold" className="w-4 h-4" />
                </button>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                <button 
                    onClick={handleSubmit}
                    className="bg-corp-border text-corp-bg px-4 py-2 rounded-lg hover:opacity-90 transition-all font-bold text-xs shadow-sm flex items-center gap-2 transform active:scale-95 uppercase tracking-wide"
                >
                    Post <PaperPlaneRight weight="bold" className="w-3 h-3" />
                </button>
            </div>
        </div>
        
        {/* Helper Hint */}
        <div className="text-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-black/50 backdrop-blur px-2.5 py-1 rounded border border-gray-200 dark:border-gray-700 shadow-sm uppercase tracking-wider">
                Press ⏎ to share
            </span>
        </div>
      </div>
    </div>
  );
};
