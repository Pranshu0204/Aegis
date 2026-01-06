import React from 'react';
import { ModuleId } from '../types';

interface ModuleCardProps {
  id: ModuleId;
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: (id: ModuleId) => void;
}

// Map Module IDs to specific vibrant gradients for the liquid effect
const ModuleGradients = {
  [ModuleId.TRIAGE]: 'from-[#FF3B30] to-[#FF9500]', // Red to Orange
  [ModuleId.DISCHARGE]: 'from-[#30B0C7] to-[#5856D6]', // Teal to Indigo
  [ModuleId.INTAKE]: 'from-[#007AFF] to-[#30B0C7]', // Blue to Teal
  [ModuleId.CAREGIVER]: 'from-[#AF52DE] to-[#FF2D55]', // Purple to Pink
  [ModuleId.CHATBOT]: 'from-[#5856D6] to-[#007AFF]', // Indigo to Blue
  [ModuleId.LIVE]: 'from-[#FF9500] to-[#FF2D55]', // Orange to Pink
};

export const ModuleCard: React.FC<ModuleCardProps> = ({ id, title, description, icon, active, onClick }) => {
  const gradient = ModuleGradients[id] || 'from-slate-400 to-slate-600';

  return (
    <button
      onClick={() => onClick(id)}
      className={`group relative flex items-center p-3.5 mb-3 w-full text-left rounded-2xl transition-all duration-500 ease-out overflow-hidden
        ${active 
          ? 'bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] scale-[1.02]' 
          : 'bg-transparent hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/20'
        }`}
    >
      {/* Liquid Glass Icon - Reverted to 14px radius and liquid-icon class */}
      <div className={`
        relative flex items-center justify-center w-12 h-12 shrink-0 rounded-[14px] liquid-icon mr-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
        bg-gradient-to-br ${gradient}
      `}>
        {/* Specular highlight handled by CSS in index.html, adding internal glow here */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 text-white drop-shadow-md">
           {/* Clone element to force white color. Check validity and cast to allow unknown props like className. */}
           {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6 stroke-[2]" }) : icon}
        </div>
      </div>

      <div className="relative z-10 flex-1 min-w-0">
        <h3 className={`font-semibold text-[15px] tracking-tight truncate transition-colors duration-300 ${active ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
            {title}
        </h3>
        <p className={`text-xs mt-0.5 truncate transition-colors duration-300 font-medium ${active ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400'}`}>
            {description}
        </p>
      </div>

      {/* Active State Indicator - Subtle animated glow */}
      {active && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-ios-blue to-transparent rounded-l-full opacity-60"></div>
      )}
    </button>
  );
};