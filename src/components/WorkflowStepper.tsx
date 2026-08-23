import React from 'react';
import { ExternalLink, CheckCircle2, Lock, ShieldCheck, Zap, Clock, AlertTriangle, Layers, Info } from 'lucide-react';
import { LaunchMode } from '../types';

interface WorkflowStepperProps {
  step: 1 | 2 | 3;
  isFirstTabOpened: boolean;
  isConnected: boolean;
  launchMode: LaunchMode;
  delayBetweenTabsMs: number;
  onOpenFirstTab: () => void;
  onValidateConnection: () => void;
  onOpenRemainingTabs: () => void;
  onChangeLaunchMode: (mode: LaunchMode) => void;
  onChangeDelay: (delay: number) => void;
  remainingCount: number;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  step,
  isFirstTabOpened,
  isConnected,
  launchMode,
  delayBetweenTabsMs,
  onOpenFirstTab,
  onValidateConnection,
  onOpenRemainingTabs,
  onChangeLaunchMode,
  onChangeDelay,
  remainingCount,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Column: Séquence & Mode d'emploi */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Sequence Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Séquence d'ouverture ERP
            </h2>

            <div className="space-y-5">
              {/* Step 1 timeline item */}
              <div className="flex items-start gap-3 relative">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 z-10 ${
                    isConnected || isFirstTabOpened
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                  }`}
                >
                  1
                </div>
                <div className="absolute left-3.5 top-7 w-0.5 h-12 bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">1. Authentification</span>
                  <span className="text-xs text-slate-500">Requisition Inquiry (REQ_INQUIRY)</span>
                  {isConnected && (
                    <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Connecté à FPROD
                    </span>
                  )}
                </div>
              </div>

              {/* Step 2 timeline item */}
              <div className="flex items-start gap-3 relative">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 z-10 ${
                    step === 3
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : isConnected
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  2
                </div>
                <div className="absolute left-3.5 top-7 w-0.5 h-28 bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${isConnected ? 'text-slate-800' : 'text-slate-400'}`}>
                    2. Processus de Sourcing (5 modules)
                  </span>
                  <div className="mt-2 space-y-1">
                    <p className={`text-[11px] font-mono ${isConnected ? 'text-indigo-900 font-semibold' : 'text-slate-400'}`}>
                      • PO Req Select (FPROD_4)
                    </p>
                    <p className={`text-[11px] font-mono ${isConnected ? 'text-indigo-900 font-semibold' : 'text-slate-400'}`}>
                      • Batch PO Calc (FPROD_5)
                    </p>
                    <p className={`text-[11px] font-mono ${isConnected ? 'text-indigo-900 font-semibold' : 'text-slate-400'}`}>
                      • Batch PO Build (FPROD_18)
                    </p>
                    <p className={`text-[11px] font-mono ${isConnected ? 'text-indigo-900 font-semibold' : 'text-slate-400'}`}>
                      • PO KK Check Req (FPROD_19)
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 timeline item */}
              <div className="flex items-start gap-3 pt-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    step === 3
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  3
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${step === 3 ? 'text-slate-800' : 'text-slate-400'}`}>
                    3. Dispatch final
                  </span>
                  <span className="text-xs text-slate-500">PO Dispatch (FPROD_20)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Selector within card */}
          {isConnected && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Mode de lancement :</span>
              <select
                value={launchMode}
                onChange={(e) => onChangeLaunchMode(e.target.value as LaunchMode)}
                className="bg-slate-100 font-bold text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer focus:outline-none"
              >
                <option value="all_at_once">Simultané (1 clic)</option>
                <option value="sequential_delay">Avec délai (Progressif)</option>
              </select>
            </div>
          )}
        </div>

        {/* Instructions Card (Sleek Dark Indigo) */}
        <div className="bg-indigo-900 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative border border-indigo-800">
          <div className="relative z-10 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Info className="w-4 h-4" /> Mode d'emploi
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-indigo-100">
              Ouvrez d'abord le 1er onglet pour vous authentifier sur le portail PeopleSoft. Après validation de la connexion, lancez la séquence complète des 5 onglets suivants en un clic.
            </p>
          </div>
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Right Column: Hero Interactive Workflow Card */}
      <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto my-auto py-4">
          {/* Big Icon Circle */}
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-inner border border-indigo-100/60">
            <Zap className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            Forcer la chaîne de Sourcing DA
          </h3>
          <p className="text-sm text-slate-500 mb-8 max-w-md">
            Pour assurer l'attribution des sessions PeopleSoft, veuillez vous authentifier d'abord sur la page de recherche DA.
          </p>

          {/* Action Box */}
          <div className="w-full space-y-4">
            {/* Action 1: Open Tab 1 */}
            <button
              onClick={onOpenFirstTab}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer group text-sm sm:text-base"
            >
              <ExternalLink className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              Connexion FPROD
            </button>

            {/* Checkbox confirmation container */}
            <div className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isConnected}
                  onChange={(e) => {
                    if (e.target.checked) onValidateConnection();
                  }}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
                  Je confirme être bien connecté à PeopleSoft FPROD
                </span>
              </label>

              {/* Action 2: Open Remaining Tabs */}
              <button
                disabled={!isConnected}
                onClick={onOpenRemainingTabs}
                className={`w-full font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all text-sm sm:text-base ${
                  isConnected
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20 cursor-pointer'
                    : 'bg-indigo-100 text-indigo-400 opacity-60 cursor-not-allowed border border-indigo-200/50'
                }`}
              >
                <Zap className="w-5 h-5" />
                Lancer la séquence de sourcing (5 onglets restants)
              </button>
            </div>
          </div>
        </div>

        {/* Quick status bar inside hero card */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
              {remainingCount}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Onglets Restants
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {remainingCount === 0 ? 'Tous lancés' : `${remainingCount} en attente`}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Statut Serveur
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {isConnected ? 'FPROD Opérationnel' : 'Connexion Requise'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

