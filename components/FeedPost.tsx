import React from 'react';
import { Post, SourceType } from '../types';
import { RichEmbed } from './RichEmbed';
import { ChatCircle, PushPin, Fire, ShareNetwork, Heart, Sparkle, Hash, Lightning } from '@phosphor-icons/react';

interface FeedPostProps {
  post: Post;
  onEmbedClick: (post: Post) => void;
  isReply?: boolean;
}

// Authentic High-Quality Brand Logos
const LOGO_URLS: Record<SourceType, string> = {
    'slack': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    'github': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg',
    'sentry': 'https://static-00.iconduck.com/assets.00/sentry-icon-512x460-s8h08982.png',
    'grafana': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Grafana_icon.svg',
    'datadog': 'https://static-00.iconduck.com/assets.00/datadog-icon-512x512-005t117k.png'
};

const SourceIcon = ({ type }: { type: SourceType }) => {
    const iconClass = "w-4 h-4 object-contain";
    const url = LOGO_URLS[type];

    if (url) {
        return (
             <img 
                src={url} 
                alt={type} 
                className={`${iconClass} ${type === 'github' ? 'opacity-90 dark:invert' : ''}`}
            />
        );
    }
    
    return <Hash weight="bold" className="w-4 h-4 text-corp-muted" />;
}

const SourceLabel: Record<string, string> = {
    'slack': 'Slack',
    'github': 'GitHub',
    'sentry': 'Sentry',
    'grafana': 'Grafana',
    'datadog': 'Datadog'
};

export const FeedPost: React.FC<FeedPostProps> = ({ post, onEmbedClick, isReply = false }) => {
  const isBot = post.author.type === 'bot';
  const isIncident = post.type === 'incident';
  
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-corp-text bg-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-200 px-1 rounded-sm">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-gray-100 dark:bg-gray-800 text-corp-primary border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded text-sm font-mono font-medium">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('@')) {
          return <span key={index} className="text-corp-primary font-bold bg-indigo-50 dark:bg-indigo-900/30 px-1 rounded cursor-pointer hover:underline">{part}</span>
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
    <div className={`
      relative rounded-xl border-2 border-corp-border bg-corp-surface shadow-corp-sm transition-all duration-200 overflow-hidden group/card
      ${isIncident ? 'ring-2 ring-red-100 dark:ring-red-900/30' : ''}
      ${isReply ? 'ml-12 mt-3 border-t-0 border-l-4 border-l-gray-300 dark:border-l-gray-700 rounded-l-none' : 'mb-8 hover:-translate-y-[2px] hover:shadow-corp-md'}
    `}>
      
      {/* Pinned Indicator - Floating */}
      {!isReply && post.reactions.pinned && (
        <div className="absolute top-5 right-5 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity">
             <div className="flex items-center gap-1.5 bg-corp-accent text-corp-bg text-[10px] uppercase font-bold px-2 py-1 rounded-full shadow-sm cursor-default">
                <PushPin weight="bold" className="w-3 h-3" />
                Pinned
             </div>
        </div>
      )}

      <div className={`p-6 ${isReply ? 'py-5 bg-gray-50/50 dark:bg-white/5' : ''}`}>
        <div className="flex gap-5">
            {/* Avatar Column */}
            <div className="flex-shrink-0">
                {isBot ? (
                     <img src="ObsTellLogo.png" alt="ObsAgent" className="w-12 h-12 rounded-full border-2 border-corp-border shadow-sm object-cover relative top-0.5 bg-white" />
                ) : (
                    <img src={post.author.avatarUrl} alt={post.author.name} className="w-12 h-12 rounded-xl border-2 border-corp-border shadow-sm object-cover relative top-0.5" />
                )}
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0 pt-0.5">
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2.5">
                            <span className="font-display font-bold text-corp-text text-[16px] tracking-tight hover:underline decoration-2 decoration-gray-200 dark:decoration-gray-700 cursor-pointer">{post.author.name}</span>
                            {isBot && <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 select-none uppercase tracking-wide">AI</span>}
                            <span className="text-corp-muted text-xs">•</span>
                            <span className="text-corp-muted text-xs font-medium">{post.author.role}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-corp-muted hover:text-corp-text cursor-pointer transition-colors">{post.timestamp}</span>
                            {!isReply && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-corp-muted bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 uppercase tracking-wide hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors">
                                    <Hash weight="bold" className="w-2.5 h-2.5" /> {post.squadId}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Headline */}
                {post.headline && (
                    <h3 className={`text-xl font-display font-bold mb-2.5 leading-tight flex items-center gap-2 ${isIncident ? 'text-red-600 dark:text-red-400' : 'text-corp-text'}`}>
                        {isIncident && <span className="flex h-3 w-3 rounded-full bg-red-600 animate-pulse ring-4 ring-red-100 dark:ring-red-900"></span>}
                        {post.headline}
                    </h3>
                )}

                {/* Body */}
                <div className="text-corp-text/90 text-[15px] leading-relaxed mb-5 font-sans">
                    {renderContent(post.content)}
                </div>

                {/* Tags */}
                {post.tags && (
                    <div className="flex gap-2 mb-4">
                        {post.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold text-corp-muted hover:text-corp-primary cursor-pointer transition-colors uppercase tracking-wider bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Rich Embed */}
                {post.embed && (
                    <RichEmbed 
                        data={post.embed} 
                        onClick={() => onEmbedClick(post)} 
                        primarySource={post.sources?.[0]} 
                    />
                )}

                {/* Sources Row */}
                {post.sources && post.sources.length > 0 && (
                     <div className="mt-5 flex flex-wrap gap-2">
                        {post.sources.map(source => (
                            <div key={source} className="flex items-center gap-2 px-2.5 py-1 bg-corp-bg border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-colors hover:bg-white dark:hover:bg-white/5">
                                <SourceIcon type={source} />
                                <span className="text-[10px] font-bold text-corp-muted">{SourceLabel[source]}</span>
                            </div>
                        ))}
                     </div>
                )}
                
                {/* AI Insight Section (Visible on all posts) */}
                {post.aiInsight && !isReply && (
                    <div className="mt-5 flex gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-xl relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400/30"></div>
                        <div className="flex-shrink-0 mt-0.5">
                            <Lightning weight="fill" className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="text-xs text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed">
                            <span className="font-bold uppercase text-[10px] tracking-wide opacity-70 mr-1.5 font-display">ObsAgent Insight:</span>
                            {post.aiInsight}
                        </div>
                    </div>
                )}

                {/* Footer Interactions */}
                {!isReply && (
                    <div className="mt-6 flex items-center gap-3 opacity-80 group-hover/card:opacity-100 transition-opacity">
                        <button className={`
                            group flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 text-xs font-bold transition-all active:scale-95
                            ${isIncident 
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40' 
                                : 'bg-transparent border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 text-corp-muted'}
                        `}>
                            {isIncident ? <Fire weight="bold" className="w-4 h-4" /> : <Heart weight="bold" className="w-4 h-4 group-hover:text-pink-500 transition-colors" />}
                            <span>{isIncident ? 'Escalate' : (post.reactions.heart || 'Like')}</span>
                        </button>

                        <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 text-corp-muted text-xs font-bold transition-all active:scale-95 group">
                            <ChatCircle weight="bold" className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
                            <span>{post.comments > 0 ? `${post.comments} Comments` : 'Reply'}</span>
                        </button>

                        <div className="flex-1"></div>

                        <button className="p-2.5 text-corp-muted hover:text-corp-text hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all active:scale-95">
                            <ShareNetwork weight="bold" className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
    
    {/* Threaded Replies */}
    {post.replies && post.replies.map(reply => (
        <FeedPost key={reply.id} post={reply} onEmbedClick={onEmbedClick} isReply={true} />
    ))}
    
    {/* If replies exist, add a bit of bottom margin to separate from next main post */}
    {post.replies && post.replies.length > 0 && <div className="mb-8"></div>}
    </>
  );
};
