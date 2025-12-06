import React from 'react';
import { FeedPost } from './FeedPost';
import { MOCK_POSTS, SQUADS } from '../constants';
import { Post, ViewType } from '../types';
import { Hash, House, MagnifyingGlass, DeviceMobile, Database } from '@phosphor-icons/react';

interface FeedProps {
  currentView: ViewType;
  onPostEmbedClick: (post: Post) => void;
  isSidebarCollapsed: boolean;
  isChatOpen: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
    'mobile-app': DeviceMobile,
    'data-eng': Database
};

export const Feed: React.FC<FeedProps> = ({ currentView, onPostEmbedClick, isSidebarCollapsed, isChatOpen }) => {
  
  // Filter posts based on current view
  const filteredPosts = React.useMemo(() => {
    if (currentView === 'home') return MOCK_POSTS;
    if (currentView === 'saved') return MOCK_POSTS.filter(p => p.reactions.pinned); 
    if (currentView === 'mentions') return MOCK_POSTS.filter(p => p.comments > 0); 
    return MOCK_POSTS.filter(p => p.squadId === currentView);
  }, [currentView]);

  const viewInfo = React.useMemo(() => {
    if (currentView === 'home') return { label: 'My Radar', desc: 'Personalized digest', icon: House };
    if (currentView === 'saved') return { label: 'Saved Items', desc: 'Bookmarks', icon: House };
    if (currentView === 'mentions') return { label: 'Mentions', desc: 'Where you were tagged', icon: House };
    const squad = SQUADS.find(s => s.id === currentView);
    return { 
        label: squad?.label || currentView, 
        desc: squad?.description || 'Team Feed', 
        icon: ICON_MAP[currentView] || Hash 
    };
  }, [currentView]);

  const Icon = viewInfo.icon;

  return (
    <div 
        className={`
            flex-1 h-screen overflow-y-auto bg-corp-bg relative isolate 
            transition-[margin] duration-500 cubic-bezier(0.25, 1, 0.5, 1)
            ${isSidebarCollapsed ? 'ml-[90px]' : 'ml-[320px]'}
            ${isChatOpen ? 'mr-[420px]' : 'mr-0'}
        `}
    >
      {/* Subtle Corporate Gradient Mesh Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        {/* Light Mode Gradients */}
        <div className="dark:hidden absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-300/30 blur-[120px]" />
        <div className="dark:hidden absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-300/30 blur-[120px]" />
        <div className="dark:hidden absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] rounded-full bg-blue-300/20 blur-[120px]" />
        
        {/* Dark Mode Gradients - Darker, more subtle */}
        <div className="hidden dark:block absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-900/20 blur-[150px]" />
        <div className="hidden dark:block absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-900/15 blur-[150px]" />
      </div>

      {/* Increased max-width to 'zoom in' */}
      <div className="relative z-10 max-w-3xl mx-auto pt-20 pb-40 px-6">
        
        {/* View Header */}
        <div className="mb-14 flex items-center justify-between animate-slide-up">
            <div className="flex items-center gap-6">
                <div className="bg-corp-surface text-corp-text p-4 border-2 border-corp-border rounded-2xl shadow-corp-sm flex items-center justify-center">
                    <Icon weight="bold" className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-4xl font-display font-bold text-corp-text leading-none tracking-tight mb-2.5">{viewInfo.label}</h1>
                    <p className="text-sm font-medium text-corp-muted flex items-center gap-2">
                        {viewInfo.desc}
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span className="text-corp-primary font-bold">{filteredPosts.length} updates</span>
                    </p>
                </div>
            </div>
            
            {currentView !== 'home' && (
                <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400 shadow-sm">
                           {String.fromCharCode(64+i)}
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-sm">
                        +12
                    </div>
                </div>
            )}
        </div>

        {/* Date Separator */}
        <div className="flex items-center justify-center mb-10 relative opacity-80">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200 dark:border-gray-800"></div>
            </div>
            <span className="relative z-10 bg-corp-bg px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-corp-muted shadow-sm border border-gray-200 dark:border-gray-800">
                Today, Oct 27
            </span>
        </div>

        <div className="space-y-8">
            {filteredPosts.length > 0 ? (
                filteredPosts.map((post, idx) => (
                <div key={post.id} className="animate-slide-up" style={{animationDelay: `${idx * 80}ms`}}>
                    <FeedPost 
                        post={post} 
                        onEmbedClick={onPostEmbedClick}
                    />
                </div>
                ))
            ) : (
                <div className="text-center py-24 px-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-corp-surface/40">
                    <div className="inline-block p-5 bg-corp-surface rounded-full mb-5 shadow-sm border-2 border-gray-100 dark:border-gray-800">
                        <MagnifyingGlass weight="bold" className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-corp-text">All caught up</h3>
                    <p className="text-sm text-corp-muted mt-2 max-w-xs mx-auto">
                        There are no updates in this feed for the selected timeframe.
                    </p>
                </div>
            )}
        </div>

        {/* Loading / End of feed */}
        {filteredPosts.length > 0 && (
             <div className="text-center py-12 flex flex-col items-center gap-3 opacity-60">
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
