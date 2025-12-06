import React from 'react';
import { X, Copy, TerminalWindow, ArrowSquareOut, GitCommit, FileCode, ChartBar, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { DrawerContext, DetailContent, SourceType } from '../types';

interface ContextDrawerProps {
  context: DrawerContext;
  onClose: () => void;
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
    return <DefaultIcon weight="bold" className="w-3 h-3" />;
};

export const ContextDrawer: React.FC<ContextDrawerProps> = ({ context, onClose }) => {
  const { data } = context;

  const renderContent = () => {
    if (!data) return <div className="p-6 text-corp-muted text-center">No details available.</div>;

    switch (data.type) {
        case 'log':
            return <LogView data={data} />;
        case 'pr_diff':
            return <PRView data={data} />;
        case 'metrics':
            return <MetricView data={data} />;
        case 'status_report':
            return <StatusView data={data} />;
        default:
            return <div className="p-6">Unknown content type</div>;
    }
  };

  return (
    <div 
      className={`fixed top-0 right-0 h-screen w-[560px] bg-corp-surface border-l-2 border-corp-border shadow-[-8px_0px_0px_0px_rgba(0,0,0,0.1)] transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) z-50 flex flex-col ${context.isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-8 border-b-2 border-corp-border bg-corp-bg shrink-0">
            <div>
                <h2 className="font-display font-bold text-corp-text text-lg uppercase tracking-tight">{data?.title || 'Details'}</h2>
                <p className="text-xs text-corp-muted font-medium mt-0.5">{data?.subtitle}</p>
            </div>
            <button onClick={onClose} className="text-corp-muted hover:text-corp-text hover:bg-gray-200 dark:hover:bg-white/10 p-2 rounded-lg transition-all active:scale-95">
                <X weight="bold" className="w-6 h-6" />
            </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-corp-surface">
            {renderContent()}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t-2 border-corp-border bg-corp-bg flex justify-end gap-3 shrink-0">
             <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-corp-muted hover:text-corp-text transition-colors uppercase tracking-wide">
                Close
             </button>
             <button className="px-5 py-2.5 bg-corp-text text-corp-bg text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-colors flex items-center gap-2 uppercase tracking-wide">
                <ArrowSquareOut weight="bold" className="w-3 h-3" />
                Open Full View
             </button>
        </div>
    </div>
  );
};

// --- Sub-components for specific views ---

const LogView = ({ data }: { data: DetailContent }) => (
    <div className="p-8">
        <div className="flex items-center gap-2 text-xs font-bold text-corp-muted mb-3 uppercase tracking-wide font-display">
            {/* Try to use brand icon if source allows (e.g. Datadog logs) */}
            <HeaderIcon source={data.source} defaultIcon={TerminalWindow} />
            System Output
        </div>
        <div className="bg-[#1e1e1e] rounded-lg border-2 border-corp-border overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                <span className="text-[10px] text-gray-400 font-mono">stderr</span>
                <Copy weight="bold" className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-white" />
            </div>
            <div className="p-5 overflow-x-auto">
                <pre className="font-mono text-[11px] leading-relaxed text-blue-300">
                    {data.logData}
                </pre>
            </div>
        </div>
        <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
             <h4 className="text-xs font-bold text-yellow-800 dark:text-yellow-200 uppercase mb-2 font-display">AI Recommendation</h4>
             <p className="text-sm text-yellow-900 dark:text-yellow-100 leading-relaxed font-medium">
                Check <code>auth-service</code> latency metrics. This looks like a cascading timeout failure caused by the recent deployment.
             </p>
        </div>
    </div>
);

const PRView = ({ data }: { data: DetailContent }) => (
    <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                <HeaderIcon source="github" defaultIcon={GitCommit} />
                {data.prData?.branch}
            </div>
            <div className="text-xs font-medium text-corp-muted">
                <span className="text-emerald-600 font-bold">+{data.prData?.additions}</span> / <span className="text-red-600 font-bold">-{data.prData?.deletions}</span>
            </div>
        </div>
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2.5 border-b-2 border-gray-200 dark:border-gray-700 flex items-center gap-2.5">
                <FileCode weight="bold" className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 font-mono">src/services/jwt.ts</span>
            </div>
            <pre className="p-4 bg-white dark:bg-[#1E1E1E] text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre text-gray-600 dark:text-gray-300">
                {data.prData?.diff}
            </pre>
        </div>
    </div>
);

const MetricView = ({ data }: { data: DetailContent }) => (
    <div className="p-8">
        <div className="grid grid-cols-1 gap-5">
            {data.metricData?.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-corp-primary/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
                            <HeaderIcon source={data.source} defaultIcon={ChartBar} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide font-display">{metric.label}</div>
                            <div className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 mt-0.5">{metric.value}</div>
                        </div>
                    </div>
                    {metric.delta && (
                        <div className={`text-sm font-bold ${metric.delta.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                            {metric.delta}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const StatusView = ({ data }: { data: DetailContent }) => (
    <div className="p-0">
        {data.statusItems?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <div className={`
                        w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-offset-corp-surface
                        ${item.status === 'healthy' ? 'bg-emerald-500 ring-emerald-100 dark:ring-emerald-900' : item.status === 'degraded' ? 'bg-yellow-500 ring-yellow-100 dark:ring-yellow-900' : 'bg-red-500 ring-red-100 dark:ring-red-900'}
                    `} />
                    <span className="text-sm font-bold text-corp-text font-display tracking-tight">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                     <span className="text-xs font-mono text-corp-muted bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{item.latency}</span>
                     {item.status === 'healthy' ? <CheckCircle weight="bold" className="w-5 h-5 text-emerald-500" /> : <WarningCircle weight="bold" className="w-5 h-5 text-yellow-500" />}
                </div>
            </div>
        ))}
    </div>
);