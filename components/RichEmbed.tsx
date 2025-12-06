import React from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, CartesianGrid, XAxis } from 'recharts';
import { EmbedData, SourceType } from '../types';
import { Play, TrendUp, TrendDown, Pulse, TerminalWindow, ArrowSquareOut } from '@phosphor-icons/react';

interface RichEmbedProps {
  data: EmbedData;
  onClick?: () => void;
  primarySource?: SourceType;
}

const BRAND_LOGOS: Record<string, string> = {
    'slack': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    'github': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg',
    'sentry': 'https://static-00.iconduck.com/assets.00/sentry-icon-512x460-s8h08982.png',
    'grafana': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Grafana_icon.svg',
    'datadog': 'https://static-00.iconduck.com/assets.00/datadog-icon-512x512-005t117k.png',
};

const HeaderIcon = ({ source, defaultIcon: DefaultIcon }: { source?: SourceType, defaultIcon: React.ElementType }) => {
    if (source && BRAND_LOGOS[source]) {
        return (
            <img 
                src={BRAND_LOGOS[source]} 
                alt={source} 
                className={`w-4 h-4 object-contain ${source === 'github' ? 'dark:invert' : ''}`} 
            />
        );
    }
    return <DefaultIcon weight="bold" className="w-4 h-4" />;
};

export const RichEmbed: React.FC<RichEmbedProps> = ({ data, onClick, primarySource }) => {
  if (data.type === 'graph' && data.graphData) {
    return (
      <div 
        onClick={onClick}
        className="mt-5 group cursor-pointer border-2 border-corp-border bg-corp-surface rounded-lg shadow-corp-sm hover:shadow-corp-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-corp-border bg-corp-bg">
          <div className="flex items-center gap-3">
            <div className="bg-corp-surface p-1.5 rounded-md border border-corp-border shadow-sm">
                <HeaderIcon source={primarySource} defaultIcon={Pulse} />
            </div>
            <span className="text-sm font-bold font-display text-corp-text tracking-tight">{data.title}</span>
          </div>
          {data.impact && (
            <span className="text-[10px] font-bold text-corp-danger bg-red-500/10 px-2 py-1 rounded-full border border-corp-danger/20 flex items-center gap-1.5 uppercase tracking-wide">
              <div className="w-1.5 h-1.5 rounded-full bg-corp-danger animate-pulse"></div>
              {data.impact}
            </span>
          )}
        </div>
        {/* Fixed height container for Recharts to prevent 0-height warnings */}
        <div className="h-52 w-full p-2 relative bg-corp-surface" style={{ minHeight: '208px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.graphData} margin={{top: 10, right: 0, bottom: 0, left: 0}}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--corp-border)" opacity={0.3} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--corp-border)', color: 'var(--corp-surface)', border: 'none', borderRadius: '4px', fontSize: '12px', fontFamily: 'Inter', fontWeight: 600 }}
                    cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366F1" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                />
                </AreaChart>
            </ResponsiveContainer>
        </div>
        <div className="px-4 py-2.5 bg-corp-bg border-t-2 border-corp-border flex justify-between items-center">
             <span className="text-[10px] text-corp-muted font-mono font-bold">LIVE 15m WINDOW</span>
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-corp-text group-hover:text-corp-primary transition-colors uppercase tracking-wide">
                View Logs <ArrowSquareOut weight="bold" className="w-3 h-3" />
             </div>
        </div>
      </div>
    );
  }

  if (data.type === 'metric') {
    const isPositive = (data.metricTrend || 0) >= 0;
    return (
      <div className="mt-5 flex items-center justify-between border-2 border-corp-border bg-corp-surface rounded-lg shadow-corp-sm p-6 hover:shadow-corp-md transition-all duration-200">
        <div className="flex items-center gap-5">
            <div className={`p-3.5 rounded-lg border-2 border-corp-border ${isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                 {/* Only use Brand icon if it matches metrics context, otherwise generic trending */}
                 {primarySource && ['grafana', 'datadog'].includes(primarySource) 
                    ? <HeaderIcon source={primarySource} defaultIcon={TrendUp} /> 
                    : (isPositive ? <TrendUp weight="bold" className="w-6 h-6" /> : <TrendDown weight="bold" className="w-6 h-6" />)
                 }
            </div>
            <div>
                <div className="text-3xl font-display font-bold text-corp-text tracking-tight">{data.metricValue}</div>
                <div className="text-xs font-bold text-corp-muted uppercase tracking-wider mt-1">{data.metricLabel}</div>
            </div>
        </div>
        {data.metricTrend && (
            <div className={`px-3 py-1.5 rounded-md border-2 border-corp-border font-bold text-sm ${isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                {data.metricTrend > 0 ? '+' : ''}{data.metricTrend}%
            </div>
        )}
      </div>
    );
  }

  if (data.type === 'video') {
    return (
      <div className="mt-5 relative border-2 border-corp-border rounded-lg shadow-corp-sm group cursor-pointer bg-gray-900 overflow-hidden hover:shadow-corp-md transition-all">
        <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm border-2 border-corp-border rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play weight="fill" className="w-6 h-6 text-gray-900 ml-1 fill-gray-900" />
            </div>
        </div>
        <img 
            src={data.videoUrl} 
            alt="Video thumbnail" 
            className="w-full h-64 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute bottom-4 left-4">
             <span className="px-2.5 py-1.5 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded border border-white/20 flex items-center gap-2">
                <img src="https://cdn.worldvectorlogo.com/logos/loom-logo.svg" className="w-4 h-4" alt="Loom" />
                LOOM RECORDING
            </span>
        </div>
      </div>
    );
  }

  if (data.type === 'code') {
    return (
        <div className="mt-5 border-2 border-corp-border rounded-lg bg-[#1E1E1E] shadow-corp-sm overflow-hidden group hover:shadow-corp-md transition-all">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700 bg-[#252526]">
                <div className="flex items-center gap-2.5">
                    {/* Explicitly check if source is github for code blocks */}
                    <div className="opacity-80">
                        <HeaderIcon source={primarySource === 'github' ? 'github' : undefined} defaultIcon={TerminalWindow} />
                    </div>
                    <span className="text-xs text-gray-400 font-mono font-medium">{data.title || 'snippet.ts'}</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
            </div>
            <div className="p-5 overflow-x-auto">
                <pre className="text-xs font-mono text-gray-300 leading-relaxed">
                    {data.codeSnippet}
                </pre>
            </div>
        </div>
    )
  }

  if (data.type === 'slack_thread') {
    return (
        <div className="mt-5 border-2 border-corp-border rounded-lg bg-corp-surface shadow-corp-sm overflow-hidden group hover:shadow-corp-md transition-all">
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-corp-border bg-corp-bg">
                <div className="flex items-center gap-2.5">
                    <img 
                        src={BRAND_LOGOS['slack']} 
                        alt="Slack" 
                        className="w-4 h-4 object-contain"
                    />
                    <span className="text-xs font-bold text-corp-text">{data.title}</span>
                </div>
                <span className="text-[10px] text-corp-muted font-mono uppercase tracking-wider">SLACK THREAD</span>
            </div>
            <div className="p-5 space-y-4 bg-corp-surface">
                {data.slackMessages?.map((msg, i) => (
                    <div key={i} className="flex gap-3.5">
                         <img src={msg.avatar} className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 shadow-sm" alt={msg.author} />
                         <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-corp-text">{msg.author}</span>
                                <span className="text-[10px] text-corp-muted">{msg.timestamp}</span>
                            </div>
                            <div className="text-xs text-corp-text mt-1 leading-relaxed">
                                {msg.text}
                            </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    )
  }

  return null;
};