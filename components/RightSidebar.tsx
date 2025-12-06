import React, { useEffect, useRef, useState } from 'react';
import { X, ClockCounterClockwise, PaperPlaneRight, Robot } from '@phosphor-icons/react';
import { ChatMessage } from '../types';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose, messages, onSendMessage, isTyping }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div 
        className={`
            fixed top-4 bottom-4 right-4 z-30
            flex flex-col
            bg-corp-surface border-2 border-corp-border rounded-2xl shadow-corp-xl
            transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1) overflow-hidden
            ${isOpen ? 'translate-x-0 opacity-100 w-[400px]' : 'translate-x-[120%] opacity-0 w-[400px] pointer-events-none'}
        `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-corp-border bg-corp-bg/50 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
            <img src="ObsTellLogo.png" alt="ObsAgent" className="w-8 h-8 rounded-full border border-corp-border object-cover bg-white" />
            <div>
                <h2 className="font-display font-bold text-corp-text text-base leading-none">Ask ObsAgent</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-corp-muted uppercase tracking-wide">Online</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-1">
            <button className="p-2 text-corp-muted hover:text-corp-text hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors" title="Chat History">
                <ClockCounterClockwise weight="bold" className="w-5 h-5" />
            </button>
            <button 
                onClick={onClose}
                className="p-2 text-corp-muted hover:text-corp-text hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors" 
                title="Collapse Sidebar"
            >
                <X weight="bold" className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
        {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 p-6">
                <Robot weight="duotone" className="w-16 h-16 text-corp-muted mb-4" />
                <p className="text-sm font-medium text-corp-text">How can I help you today?</p>
                <p className="text-xs text-corp-muted mt-1">Ask about alerts, metrics, or deployments.</p>
            </div>
        ) : (
            <>
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div 
                            className={`
                                max-w-[90%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm
                                ${msg.sender === 'user' 
                                    ? 'bg-corp-primary text-white rounded-br-none' 
                                    : 'bg-gray-100 dark:bg-white/5 text-corp-text border border-gray-200 dark:border-gray-700 rounded-bl-none'}
                            `}
                        >
                            {msg.text}
                        </div>
                        <span className="text-[10px] font-bold text-corp-muted mt-1.5 px-1 opacity-70">
                            {msg.sender === 'user' ? 'You' : 'ObsAgent'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex flex-col items-start">
                         <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-700 px-4 py-3.5 rounded-2xl rounded-bl-none flex gap-1 items-center">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                        <span className="text-[10px] font-bold text-corp-muted mt-1.5 px-1 opacity-70">Thinking...</span>
                    </div>
                )}
            </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-corp-surface border-t-2 border-corp-border">
        <form 
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-corp-bg border-2 border-gray-200 dark:border-gray-700 rounded-xl p-1.5 focus-within:border-corp-primary/50 focus-within:ring-2 focus-within:ring-corp-primary/10 transition-all"
        >
            <input 
                ref={inputRef}
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask ObsAgent..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium px-3 text-corp-text placeholder-gray-400"
            />
            <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 bg-corp-text text-corp-bg rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-sm"
            >
                <PaperPlaneRight weight="bold" className="w-4 h-4" />
            </button>
        </form>
      </div>
    </div>
  );
};
