import React, { useState } from 'react';
import { Copy, Check, FileText, Hash, Building } from 'lucide-react';

interface QuickCopyBarProps {
  requisitionId: string;
  businessUnit: string;
  onChangeRequisitionId: (val: string) => void;
  onChangeBusinessUnit: (val: string) => void;
}

export const QuickCopyBar: React.FC<QuickCopyBarProps> = ({
  requisitionId,
  businessUnit,
  onChangeRequisitionId,
  onChangeBusinessUnit,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedBu, setCopiedBu] = useState(false);

  const copyToClipboard = async (text: string, type: 'id' | 'bu') => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'id') {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } else {
        setCopiedBu(true);
        setTimeout(() => setCopiedBu(false), 2000);
      }
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/60">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            Presse-papier &amp; Suivi de la DA en cours
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Copie rapide pour collage dans les formulaires PeopleSoft
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Business Unit */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            Business Unit (BU / Entité)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: SNCF1"
              value={businessUnit}
              onChange={(e) => onChangeBusinessUnit(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <button
              disabled={!businessUnit}
              onClick={() => copyToClipboard(businessUnit, 'bu')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                copiedBu
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : businessUnit
                  ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-sm'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              {copiedBu ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copié
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copier
                </>
              )}
            </button>
          </div>
        </div>

        {/* Requisition ID */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            N° de Demande d'Achat (DA)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: 0000123456"
              value={requisitionId}
              onChange={(e) => onChangeRequisitionId(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <button
              disabled={!requisitionId}
              onClick={() => copyToClipboard(requisitionId, 'id')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                copiedId
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : requisitionId
                  ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-sm'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              {copiedId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copié
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
