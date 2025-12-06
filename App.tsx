import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { Commander } from './components/Commander';
import { ContextDrawer } from './components/ContextDrawer';
import { CommandPalette } from './components/CommandPalette';
import { RightSidebar } from './components/RightSidebar';
import { ChatTrigger } from './components/ChatTrigger';
import { DrawerContext, Post, ViewType, ChatMessage } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatTyping, setIsChatTyping] = useState(false);

  const [drawerContext, setDrawerContext] = useState<DrawerContext>({
    isOpen: false,
    data: undefined
  });

  // Theme Management
  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global Keyboard Listener for Cmd+K and Cmd+\ (Toggle Sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsCommandPaletteOpen(prev => !prev);
        }
        if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
            e.preventDefault();
            setIsSidebarCollapsed(prev => !prev);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePostEmbedClick = (post: Post) => {
    const source = post.sources?.[0];
    
    if (post.detailContent) {
        setDrawerContext({
            isOpen: true,
            data: { ...post.detailContent, source }
        });
    } else {
        setDrawerContext({
            isOpen: true,
            data: {
                type: 'log',
                title: 'Raw Data',
                subtitle: 'Event Object',
                logData: JSON.stringify(post, null, 2),
                source
            }
        });
    }
  };

  const closeDrawer = () => {
    setDrawerContext(prev => ({ ...prev, isOpen: false }));
  };

  // Triggered by Command Palette OR internal chat input
  const handleChatRun = (query: string) => {
    setIsChatOpen(true);
    // Add user message
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: query,
        timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatTyping(true);

    // Simulate bot response
    setTimeout(() => {
        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: "I've analyzed the recent alerts. It seems like the `api-gateway` latency spike is correlated with the latest deployment to `auth-service`. Would you like me to rollback the deployment or generate a deeper RCA?",
            timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botMsg]);
        setIsChatTyping(false);
    }, 1500);
  };

  // Triggered by Bottom Commander Bar (Feed specific)
  const handleFeedAction = (query: string) => {
      console.log("Feed action triggered:", query);
      // Placeholder: in a real app this might filter the feed or create a post
      // We explicitly do NOT open the chat sidebar here per user request.
  };

  return (
    <div className="flex min-h-screen bg-corp-bg font-sans text-corp-text selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onTriggerCommandPalette={() => setIsCommandPaletteOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(p => !p)}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(p => !p)}
      />
      
      <Feed 
        currentView={currentView} 
        onPostEmbedClick={handlePostEmbedClick} 
        isSidebarCollapsed={isSidebarCollapsed}
        isChatOpen={isChatOpen}
      />
      
      {/* Commander for Feed Actions */}
      <Commander 
        isSidebarCollapsed={isSidebarCollapsed} 
        isChatOpen={isChatOpen}
        onRun={handleFeedAction}
      />

      {/* Manual Trigger for Chat Sidebar */}
      <ChatTrigger 
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(p => !p)}
      />

      <RightSidebar 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        onSendMessage={handleChatRun}
        isTyping={isChatTyping}
      />
      
      {/* Drawer Overlay */}
      {drawerContext.isOpen && (
        <div 
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-[2px] z-40 transition-opacity duration-300" 
            onClick={closeDrawer}
        />
      )}
      
      <ContextDrawer context={drawerContext} onClose={closeDrawer} />

      {/* Command Palette can trigger Chat */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)}
        onRun={handleChatRun}
      />
    </div>
  );
};

export default App;
