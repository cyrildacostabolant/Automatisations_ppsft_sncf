import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Zap, Building2, Clock, Layers } from 'lucide-react';
import { LaunchMode } from '../types';

interface VendorCodificationProps {
  onShowNotification: (msg: string) => void;
  onPopupBlocked: () => void;
}

interface VendorTabItem {
  id: number;
  name: string;
  code: string;
  env: string;
  url: string;
  description: string;
  opened: boolean;
}

export const VendorCodification: React.FC<VendorCodificationProps> = ({
  onShowNotification,
  onPopupBlocked,
}) => {
  const [vendorTabs, setVendorTabs] = useState<VendorTabItem[]>([
    {
      id: 1,
      name: 'Distribution Fournisseur',
      code: 'UM_DISTR_INTVND',
      env: 'FPROD',
      url: 'https://www.erp.sncf.fr/psp/FPROD/EMPLOYEE/ERP/c/MAINTAIN_VENDORS.UM_DISTR_INTVND.GBL?',
      description: 'Distribution interne et affectation du fournisseur',
      opened: false,
    },
    {
      id: 2,
      name: 'Identification Fournisseur',
      code: 'VNDR_ID',
      env: 'FPROD_5',
      url: 'https://www.erp.sncf.fr/psp/FPROD_5/EMPLOYEE/ERP/c/MAINTAIN_VENDORS.VNDR_ID.GBL',
      description: 'Fiche signalétique et identifiant du fournisseur',
      opened: false,
    },
    {
      id: 3,
      name: 'Requête Statut Événement',
      code: 'N2_ACH_STS_FRS_EVE',
      env: 'FPROD_22',
      url: 'https://www.erp.sncf.fr/psc/FPROD_22/EMPLOYEE/ERP/q/?ICAction=ICQryNameURL=PRIVATE.N2_ACH_STS_FRS_EVE',
      description: 'Consultation du statut événement fournisseur',
      opened: false,
    },
    {
      id: 4,
      name: 'Requête Mail Fournisseur',
      code: 'N2_ACH_MAIL_FRS',
      env: 'FPROD_3',
      url: 'https://www.erp.sncf.fr/psc/FPROD_3/EMPLOYEE/ERP/q/?ICAction=ICQryNameURL=PRIVATE.N2_ACH_MAIL_FRS',
      description: 'Adresses e-mail associées aux contacts fournisseurs',
      opened: false,
    },
    {
      id: 5,
      name: 'Requête Compte Fournisseur',
      code: 'N2_ACH_CPT_FRS_STS',
      env: 'FPROD_2',
      url: 'https://www.erp.sncf.fr/psc/FPROD_2/EMPLOYEE/ERP/q/?ICAction=ICQryNameURL=PRIVATE.N2_ACH_CPT_FRS_STS',
      description: 'Comptes et coordonnées bancaires fournisseurs',
      opened: false,
    },
  ]);

  const [launchMode, setLaunchMode] = useState<LaunchMode>('all_at_once');
  const [delayBetweenTabsMs, setDelayBetweenTabsMs] = useState<number>(600);

  const openedCount = vendorTabs.filter((t) => t.opened).length;
  const allOpened = openedCount === vendorTabs.length;

  // Open single tab
  const handleOpenSingleTab = (tab: VendorTabItem) => {
    const win = window.open(tab.url, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      onPopupBlocked();
      onShowNotification("Le navigateur a bloqué l'ouverture de l'onglet.");
    } else {
      setVendorTabs((prev) =>
        prev.map((t) => (t.id === tab.id ? { ...t, opened: true } : t))
      );
      onShowNotification(`Onglet ${tab.name} ouvert !`);
    }
  };

  // Direct open of ALL vendor tabs
  const handleOpenAllTabs = () => {
    if (launchMode === 'all_at_once') {
      let blockedAny = false;
      vendorTabs.forEach((tab) => {
        const win = window.open(tab.url, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          blockedAny = true;
        }
      });

      setVendorTabs((prev) => prev.map((t) => ({ ...t, opened: true })));

      if (blockedAny) {
        onPopupBlocked();
        onShowNotification('Certains onglets ont été bloqués. Autorisez les pop-ups pour ce site.');
      } else {
        onShowNotification('Les 5 onglets de Codification Fournisseur ont été ouverts directement !');
      }
    } else {
      // Sequential delay mode
      onShowNotification(`Ouverture séquentielle des 5 onglets (${delayBetweenTabsMs}ms d'intervalle)...`);
      let count = 0;

      vendorTabs.forEach((tab, index) => {
        setTimeout(() => {
          const win = window.open(tab.url, '_blank');
          if (!win || win.closed || typeof win.closed === 'undefined') {
            onPopupBlocked();
          }

          setVendorTabs((prev) =>
            prev.map((t) => (t.id === tab.id ? { ...t, opened: true } : t))
          );

          count++;
          if (count === vendorTabs.length) {
            onShowNotification('Les 5 onglets ont été ouverts avec succès !');
          }
        }, index * delayBetweenTabsMs);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Zone d'action principale : Bouton AU-DESSUS de la séquence des onglets */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Big Icon Circle */}
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-indigo-100/60">
            <Building2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Module Codification Fournisseur
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-lg">
            Cliquez sur le bouton ci-dessous pour lancer directement les 5 interfaces et requêtes PeopleSoft.
          </p>

          {/* Bouton de lancement direct */}
          <div className="w-full space-y-3 mb-6">
            <button
              onClick={handleOpenAllTabs}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer text-base sm:text-lg group"
            >
              <Zap className="w-6 h-6 text-amber-300 group-hover:scale-110 transition-transform" />
              Ouvrir directement les 5 onglets Codification Fournisseur
            </button>

            <p className="text-xs text-slate-400 font-medium">
              Ouvre UM_DISTR_INTVND (FPROD), VNDR_ID (FPROD_5), N2_ACH_STS_FRS_EVE (FPROD_22), N2_ACH_MAIL_FRS (FPROD_3) et N2_ACH_CPT_FRS_STS (FPROD_2).
            </p>
          </div>

          {/* Barre d'état & Options d'ouverture */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-left">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  allOpened
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {openedCount}/{vendorTabs.length}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Onglets Lancés
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {allOpened ? 'Tous les 5 ouverts' : `${vendorTabs.length - openedCount} non ouverts`}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  allOpened
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Statut
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {allOpened ? 'Séquence terminée' : 'Prêt à lancer'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-center">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Mode
                </span>
                <select
                  value={launchMode}
                  onChange={(e) => setLaunchMode(e.target.value as LaunchMode)}
                  className="bg-white font-semibold text-slate-700 px-2 py-0.5 rounded border border-slate-200 cursor-pointer text-xs focus:outline-none"
                >
                  <option value="all_at_once">Simultané (1 clic)</option>
                  <option value="sequential_delay">Avec délai</option>
                </select>
              </div>
              {launchMode === 'sequential_delay' && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Délai :
                  </span>
                  <select
                    value={delayBetweenTabsMs}
                    onChange={(e) => setDelayBetweenTabsMs(Number(e.target.value))}
                    className="bg-white font-semibold text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 cursor-pointer text-[11px]"
                  >
                    <option value={300}>300 ms</option>
                    <option value={600}>600 ms</option>
                    <option value={1000}>1 sec</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Zone "Séquence des onglets" située AU-DESSOUS du bouton */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Séquence des 5 onglets
              </h3>
              <p className="text-xs text-slate-400">
                Ordre officiel de codification des fournisseurs PeopleSoft SNCF
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {openedCount}/{vendorTabs.length} ouverts
          </span>
        </div>

        {/* Grille des 5 onglets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {vendorTabs.map((tab, idx) => (
            <div
              key={tab.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                tab.opened
                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-800 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      tab.opened
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-indigo-700">
                      {tab.env}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {tab.opened && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Ouvert
                    </span>
                  )}
                  <button
                    onClick={() => handleOpenSingleTab(tab)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-all cursor-pointer border border-transparent hover:border-slate-200 shadow-xs"
                    title="Ouvrir cet onglet individuellement"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                  {tab.name}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {tab.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="truncate max-w-[180px]">{tab.code}</span>
                <button
                  onClick={() => handleOpenSingleTab(tab)}
                  className="text-indigo-600 hover:text-indigo-800 font-sans font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  Ouvrir <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
