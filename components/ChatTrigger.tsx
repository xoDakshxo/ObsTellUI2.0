import React from 'react';

interface ChatTriggerProps {
  isOpen: boolean;
  onClick: () => void;
}

export const ChatTrigger: React.FC<ChatTriggerProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-8 right-8 z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        border-2 border-corp-border shadow-corp-md
        transition-all duration-300 active:scale-95 hover:-translate-y-1 hover:shadow-corp-lg
        bg-white overflow-hidden
        ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
      `}
      title="Ask ObsAgent"
    >
        <img src="ObsTellLogo.png" alt="Ask ObsAgent" className="w-10 h-10 object-cover" />
    </button>
  );
};
