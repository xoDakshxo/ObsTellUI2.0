import React from 'react';
import { House, Bell, BookmarkSimple, HardDrives, TrendUp, CreditCard, Palette, Briefcase, Hash, DeviceMobile, Database, Moon, Sun, SidebarSimple, MagnifyingGlass } from '@phosphor-icons/react';
import { SQUADS, CURRENT_USER } from '../constants';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onTriggerCommandPalette: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
    'HardDrives': HardDrives,
    'TrendUp': TrendUp,
    'CreditCard': CreditCard,
    'Palette': Palette,
    'Briefcase': Briefcase,
    'Hash': Hash,
    'DeviceMobile': DeviceMobile,
    'Database': Database
};

export const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, 
    onViewChange, 
    onTriggerCommandPalette, 
    isDarkMode, 
    onToggleTheme,
    isCollapsed,
    toggleCollapse
}) => {
  return (
    <div 
        className={`
            fixed left-4 top-4 bottom-4 z-30
            flex flex-col
            bg-corp-surface border-2 border-corp-border rounded-2xl shadow-corp-xl
            transition-[width] duration-500 cubic-bezier(0.25, 1, 0.5, 1) overflow-hidden
            ${isCollapsed ? 'w-[72px]' : 'w-[280px]'}
        `}
    >
      {/* Header */}
      <div className={`flex flex-col flex-shrink-0 transition-all duration-500 ${isCollapsed ? 'p-3 items-center gap-4' : 'p-6 pb-4'}`}>
        <div 
            className={`flex items-center cursor-pointer group transition-all duration-500 ${isCollapsed ? 'justify-center mb-2' : 'justify-between mb-8'}`}
            onClick={toggleCollapse}
        >
            <div className="flex items-center gap-3.5">
                {/* Brand Logo */}
                <div className={`
                    relative flex items-center justify-center shadow-corp-sm group-hover:scale-105 transition-all duration-300 overflow-hidden shrink-0 border-2 border-corp-border z-10 bg-white
                    ${isCollapsed ? 'w-10 h-10 rounded-full' : 'w-11 h-11 rounded-full'}
                `}>
                    <img src="ObsTellLogo.png" alt="Obstell Workspace" className="w-full h-full object-cover" />
                </div>
                
                {/* Text Label - Fade out/in */}
                <div className={`transition-all duration-300 origin-left ${isCollapsed ? 'opacity-0 w-0 scale-95 hidden' : 'opacity-100 w-auto scale-100'}`}>
                    <div className="font-display font-bold text-corp-text text-xl tracking-tight uppercase leading-none group-hover:text-corp-primary transition-colors whitespace-nowrap">Obstell</div>
                    <div className="text-[11px] font-bold text-corp-muted uppercase tracking-widest mt-1 whitespace-nowrap">Workspace</div>
                </div>
            </div>
        </div>

        {/* Global Search Trigger */}
        <button 
            onClick={onTriggerCommandPalette}
            className={`
                flex items-center bg-corp-surface border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-500 hover:border-corp-border hover:text-corp-text hover:shadow-corp-sm transition-all group active:translate-y-[2px] active:shadow-none
                ${isCollapsed ? 'justify-center w-10 h-10 p-0' : 'w-full justify-between px-4 py-2.5'}
            `}
            title="Search (Cmd+K)"
        >
            {isCollapsed ? (
                <MagnifyingGlass weight="bold" className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
                <>
                    <span className="group-hover:translate-x-0.5 transition-transform whitespace-nowrap">Jump to...</span>
                    <kbd className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-300 dark:border-gray-600 font-mono text-[10px] font-bold group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">⌘K</kbd>
                </>
            )}
        </button>
      </div>

      {/* Main Nav - Scrollbar hidden */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden space-y-8 scrollbar-hide ${isCollapsed ? 'px-3 py-2' : 'px-6 py-2'}`}>
        {/* Radar Section */}
        <div className={`space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            {!isCollapsed && <SectionHeader label="My Radar" />}
            <NavItem 
                icon={House} 
                label="Home" 
                active={currentView === 'home'} 
                onClick={() => onViewChange('home')}
                collapsed={isCollapsed}
            />
            <NavItem 
                icon={Bell} 
                label="Mentions" 
                count={3} 
                active={currentView === 'mentions'}
                onClick={() => onViewChange('mentions')}
                alert
                collapsed={isCollapsed}
            />
            <NavItem 
                icon={BookmarkSimple} 
                label="Saved" 
                active={currentView === 'saved'}
                onClick={() => onViewChange('saved')}
                collapsed={isCollapsed}
            />
        </div>

        {/* Squads Section */}
        <div className={`space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            {!isCollapsed && <SectionHeader label="Squads" />}
            {isCollapsed && <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full my-4" />}
            {SQUADS.map(squad => {
                 const Icon = ICON_MAP[squad.icon] || Hash;
                 return (
                    <NavItem 
                        key={squad.id}
                        icon={Icon} 
                        label={squad.label} 
                        active={currentView === squad.id}
                        onClick={() => onViewChange(squad.id)}
                        collapsed={isCollapsed}
                    />
                 );
            })}
        </div>
      </div>

      {/* User & Footer */}
      <div className={`border-t-2 border-corp-border bg-corp-surface transition-all duration-500 ${isCollapsed ? 'p-3 flex flex-col items-center' : 'p-6'}`}>
         <div 
            className={`
                flex items-center rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group active:scale-[0.98] border border-transparent hover:border-gray-200 dark:hover:border-gray-700
                ${isCollapsed ? 'justify-center w-10 h-10 p-0' : 'gap-3 p-2.5'}
            `}
            onClick={(e) => { e.stopPropagation(); onToggleTheme(); }}
            title={isCollapsed ? "Toggle Theme" : undefined}
         >
            <div className="relative">
                <img src={CURRENT_USER.avatarUrl} className={`rounded-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-corp-border transition-colors shrink-0 bg-gray-200 ${isCollapsed ? 'w-9 h-9' : 'w-10 h-10'}`} alt="User" />
                {isCollapsed && (
                     <div className="absolute -bottom-1 -right-1 bg-corp-surface rounded-full p-0.5 border border-corp-border shadow-sm">
                         {isDarkMode ? <Moon weight="bold" className="w-2.5 h-2.5 text-corp-text" /> : <Sun weight="bold" className="w-2.5 h-2.5 text-corp-text" />}
                     </div>
                )}
            </div>
            
            {!isCollapsed && (
                <>
                    <div className="flex-1 min-w-0 animate-slide-in-right">
                        <div className="text-sm font-bold text-corp-text truncate font-display">{CURRENT_USER.name}</div>
                        <div className="text-[11px] font-medium text-corp-muted truncate">{CURRENT_USER.role}</div>
                    </div>
                    
                    <button 
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-corp-text transition-colors"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun weight="bold" className="w-4 h-4" /> : <Moon weight="bold" className="w-4 h-4" />}
                    </button>
                </>
            )}
         </div>
         
         {!isCollapsed && (
             <div className="mt-5 flex items-center justify-between text-[10px] font-bold uppercase text-gray-400 tracking-wider whitespace-nowrap overflow-hidden">
                <div className="flex items-center gap-2">
                    <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </div>
                    System Healthy
                </div>
            </div>
         )}
      </div>

      {/* Collapse Toggle Handle */}
      <button 
        onClick={(e) => {
            e.stopPropagation();
            toggleCollapse();
        }}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-corp-surface border-2 border-corp-border rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50 opacity-0 group-hover:opacity-100 hover:opacity-100 shadow-sm"
        title={isCollapsed ? "Expand Sidebar (Cmd+\\)" : "Collapse Sidebar (Cmd+\\)"}
      >
        <SidebarSimple weight="bold" className="w-3 h-3 text-corp-muted" />
      </button>
    </div>
  );
};

const SectionHeader = ({ label }: { label: string }) => (
    <div className="px-3 mb-3 text-[11px] font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest select-none whitespace-nowrap overflow-hidden">
        {label}
    </div>
);

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  count?: number;
  alert?: boolean;
  collapsed?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, count, alert, collapsed, onClick }) => (
  <button 
    onClick={onClick}
    className={`
    flex items-center rounded-lg border-2 transition-all duration-300 group relative
    ${collapsed 
        ? 'w-10 h-10 justify-center p-0' 
        : 'w-full justify-between px-3.5 py-2.5'}
    ${active 
        ? 'bg-corp-surface border-corp-border shadow-corp-sm' 
        : 'border-transparent text-corp-muted hover:bg-corp-surface hover:border-gray-200 dark:hover:border-gray-700 hover:text-corp-text'}
    ${!collapsed && active ? 'translate-x-1' : ''}
    ${collapsed && active ? 'scale-105' : ''}
  `}
    title={collapsed ? label : undefined}
  >
    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <Icon weight="bold" className={`w-5 h-5 transition-colors ${active ? 'text-corp-primary' : 'text-corp-muted group-hover:text-corp-text'}`} />
        {!collapsed && <span className={`text-[14px] font-medium tracking-tight whitespace-nowrap ${active ? 'font-bold text-corp-text' : ''}`}>{label}</span>}
    </div>
    
    {/* Badge Logic */}
    {count && (
        <span className={`
            text-[10px] font-mono font-bold rounded flex items-center justify-center
            ${collapsed 
                ? 'absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] shadow-sm ring-2 ring-corp-surface' 
                : 'px-1.5 py-0.5'}
            ${active 
                ? 'bg-corp-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'} 
            ${alert ? 'bg-red-500 text-white' : ''}
        `}>
            {count}
        </span>
    )}
  </button>
);
