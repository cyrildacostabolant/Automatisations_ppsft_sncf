import React, { useState } from 'react';
import { Database, Copy, Check, Terminal, Code2 } from 'lucide-react';

interface SqlQueryGeneratorProps {
  requisitionId: string;
  businessUnit: string;
}

export const SqlQueryGenerator: React.FC<SqlQueryGeneratorProps> = ({
  requisitionId,
  businessUnit,
}) => {
  const [copied, setCopied] = useState(false);

  const formattedBu = businessUnit.trim() || 'BU';
  const formattedDa = requisitionId.trim() || 'DA';

  const sqlQuery = `SELECT DISTINCT
    a.business_unit AS BUPO,
    a.req_id AS DA,
    a.po_id AS CDA,
    'Je viens de forcer le sourcing de la DA ' || a.business_unit || '-' || a.req_id || 
    '. Elle a généré la CDA ' || a.business_unit || '-' || a.po_id || 
    CASE 
        WHEN b.disp_method = 'PRN' 
            THEN ' au mode d''envoi ' 
        ELSE ' qui parviendra au fournisseur via le traitement ' 
    END ||
    CASE 
        WHEN b.disp_method = 'EDX' THEN 'EDI'
        WHEN b.disp_method = 'EML' THEN 'E-Mail'
        WHEN b.disp_method = 'PRN' THEN 'Courrier'
        ELSE b.disp_method
    END || 
    CASE 
        WHEN b.disp_method = 'PRN' 
            THEN '.' 
        ELSE ' de fin de journée.' 
    END AS texte
FROM sysadm.PS_PO_LINE_DISTRIB a
JOIN sysadm.ps_po_hdr b
    ON a.business_unit = b.business_unit
   AND a.po_id = b.po_id
WHERE (a.business_unit, a.req_id) IN
(
    ('${formattedBu}','${formattedDa}')
)
ORDER BY 1, 2;`;

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(sqlQuery);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy SQL query', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/60">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              Générateur de Requête SQL Sourcing DA
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                PeopleSoft DB
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Requête dynamique mise à jour en temps réel avec la BU ({formattedBu}) et la DA ({formattedDa})
            </p>
          </div>
        </div>

        <button
          onClick={handleCopySql}
          className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-500/20'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              SQL Copié dans le presse-papier !
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copier la requête SQL
            </>
          )}
        </button>
      </div>

      {/* Code Block */}
      <div className="relative rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2.5 mb-3 select-none">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            Query Oracle / PeopleSoft (sysadm)
          </span>
          <span className="text-slate-500">
            Valeurs actuelles : <span className="text-amber-400 font-bold">BU: '{formattedBu}'</span>, <span className="text-amber-400 font-bold">DA: '{formattedDa}'</span>
          </span>
        </div>
        <pre className="leading-relaxed text-indigo-200/90 selection:bg-indigo-500 selection:text-white">
          {sqlQuery}
        </pre>
      </div>
    </div>
  );
};
