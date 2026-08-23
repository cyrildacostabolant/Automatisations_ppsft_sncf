import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Clock, Globe, Shield, AlertCircle } from 'lucide-react';
import { ErpTab } from '../types';

interface TabCardProps {
  tab: ErpTab;
  onOpenTab: (tab: ErpTab) => void;
  onToggleStatus: (id: number) => void;
  isConnected: boolean;
}

export const TabCard: React.FC<TabCardProps> = ({
  tab,
  onOpenTab,
  onToggleStatus,
  isConnected,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(tab.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const getEnvBadgeColor = (env: string) => {
    switch (env) {
      case 'FPROD':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FPROD_4':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FPROD_5':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'FPROD_18':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'FPROD_19':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'FPROD_20':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md ${
        tab.opened
          ? 'border-emerald-300 ring-2 ring-emerald-500/10 bg-emerald-50/10'
          : tab.isFirstTab
          ? 'border-indigo-300 ring-2 ring-indigo-500/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3">
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                tab.opened
                  ? 'bg-emerald-600 text-white'
                  : tab.isFirstTab
                  ? 'bg-slate-900 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {tab.id}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                  {tab.name}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border ${getEnvBadgeColor(
                    tab.envName
                  )}`}
                >
                  {tab.envName}
                </span>
                {tab.isFirstTab && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Connexion Requise
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                {tab.code}.GBL
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <button
            onClick={() => onToggleStatus(tab.id)}
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
              tab.opened
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="Cliquer pour faire basculer l'état ouvert/fermé"
          >
            {tab.opened ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Ouvert
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                En attente
              </>
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          {tab.description}
        </p>

        {/* URL Box */}
        <div className="mb-4 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2 group-hover:bg-slate-100/70 transition-colors">
          <div className="flex items-center space-x-2 min-w-0 overflow-hidden">
            <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-[11px] font-mono text-slate-600 truncate select-all">
              {tab.url}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors flex-shrink-0 cursor-pointer"
            title="Copier l'URL"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            {tab.openedAt ? `Ouvert à ${tab.openedAt}` : 'Non lancé'}
          </span>

          <button
            onClick={() => onOpenTab(tab)}
            className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab.isFirstTab
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                : tab.opened
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Ouvrir l'onglet
          </button>
        </div>
      </div>
    </div>
  );
};
