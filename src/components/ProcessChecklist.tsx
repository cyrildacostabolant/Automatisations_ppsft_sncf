import React from 'react';
import { Check, ArrowRight, Layers, FileCheck, Circle } from 'lucide-react';
import { ErpTab } from '../types';

interface ProcessChecklistProps {
  tabs: ErpTab[];
  onOpenTab: (tab: ErpTab) => void;
}

export const ProcessChecklist: React.FC<ProcessChecklistProps> = ({ tabs, onOpenTab }) => {
  const completedCount = tabs.filter((t) => t.opened).length;
  const progressPercent = Math.round((completedCount / tabs.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Progression globale de la chaîne Sourcing DA
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {completedCount} sur {tabs.length} onglets ouverts dans cette session ({progressPercent}%)
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-56 bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200 p-0.5">
          <div
            className="bg-indigo-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps visual bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onOpenTab(tab)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              tab.opened
                ? 'bg-emerald-50/80 border-emerald-300 hover:bg-emerald-100/60'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold font-mono text-slate-400">
                0{tab.id}
              </span>
              {tab.opened ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Circle className="w-3 h-3 text-slate-300" />
              )}
            </div>
            <p className="text-xs font-bold text-slate-800 truncate">
              {tab.code}
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
              {tab.envName}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
