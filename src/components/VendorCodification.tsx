import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, ShieldCheck, Zap, Lock, Building2 } from 'lucide-react';

interface VendorCodificationProps {
  onShowNotification: (msg: string) => void;
  onPopupBlocked: () => void;
}

export const VendorCodification: React.FC<VendorCodificationProps> = ({
  onShowNotification,
  onPopupBlocked,
}) => {
  const [isFirstTabOpened, setIsFirstTabOpened] = useState(false);
  const [isConnectedConfirmed, setIsConnectedConfirmed] = useState(false);
  const [sequenceOpened, setSequenceOpened] = useState(false);

  const LOGIN_URL =
    'https://www.erp.sncf.fr/psp/FPROD/EMPLOYEE/ERP/c/MAINTAIN_VENDORS.UM_DISTR_INTVND.GBL?';

  const VENDOR_TABS = [
    {
      id: 1,
      name: '1. Identification Fournisseur (VNDR_ID)',
      env: 'FPROD_5',
      url: 'https://www.erp.sncf.fr/psp/FPROD_5/EMPLOYEE/ERP/c/MAINTAIN_VENDORS.VNDR_ID.GBL',
    },
    {
      id: 2,
      name: '2. Requête Statut Événement (N2_ACH_STS_FRS_EVE)',
      env: 'FPROD_22',
      url: 'https://www.erp.sncf.fr/psc/FPROD_22/EMPLOYEE/ERP/q/?ICAction=ICQryNameURL=PRIVATE.N2_ACH_STS_FRS_EVE',
    },
    {
      id: 3,
      name: '3. Requête Mail Fournisseur (N2_ACH_MAIL_FRS)',
      env: 'FPROD_3',
      url: 'https://www.erp.sncf.fr/psc/FPROD_3/EMPLOYEE/ERP/q/?ICAction=ICQryNameURL=PRIVATE.N2_ACH_MAIL_FRS',
    },
    {
      id: 4,
      name: '4. Requête Compte Fournisseur (N2_ACH_CPT_FRS_STS)',
      env: 'FPROD_2',
      url: 'https://www.erp.sncf.fr/psc/FPROD_2/EMPLOYEE/ERP/q/?ICAction=ICQryNameURL=PRIVATE.N2_ACH_CPT_FRS_STS',
    },
  ];

  // Open main connection tab
  const handleOpenLoginTab = () => {
    const win = window.open(LOGIN_URL, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      onPopupBlocked();
      onShowNotification("Attention : Le navigateur a bloqué l'ouverture de l'onglet.");
    } else {
      setIsFirstTabOpened(true);
      onShowNotification("Onglet Connexion FPROD ouvert ! Veuillez vous connecter.");
    }
  };

  // Launch sequence of 4 tabs
  const handleLaunchSequence = () => {
    if (!isConnectedConfirmed) return;

    let blocked = false;
    VENDOR_TABS.forEach((tab) => {
      const win = window.open(tab.url, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        blocked = true;
      }
    });

    setSequenceOpened(true);

    if (blocked) {
      onPopupBlocked();
      onShowNotification('Certains onglets ont été bloqués. Vérifiez les autorisations de pop-ups.');
    } else {
      onShowNotification('Les 4 onglets de codification fournisseur ont été ouverts !');
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Module Codification Fournisseur
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Séquence d'ouverture automatique des interfaces &amp; requêtes PeopleSoft
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            PeopleSoft FPROD
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${isConnectedConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
            {isConnectedConfirmed ? 'Connecté' : 'Non confirmé'}
          </span>
        </div>
      </div>

      {/* Step 1: Login */}
      <div className={`bg-white rounded-2xl border transition-all p-6 shadow-sm space-y-4 ${isFirstTabOpened ? 'border-indigo-200 bg-indigo-50/10' : 'border-slate-200'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isFirstTabOpened ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Étape 1 : Connexion à PeopleSoft FPROD
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Accéder à l'interface Maintain Vendors (UM_DISTR_INTVND)
              </p>
            </div>
          </div>
          {isFirstTabOpened && (
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Onglet ouvert
            </span>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={handleOpenLoginTab}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer text-sm sm:text-base"
          >
            <ExternalLink className="w-4 h-4 text-indigo-400" />
            Connexion FPROD
          </button>
        </div>
      </div>

      {/* Step 2: Confirmation & Launch Sequence */}
      <div className={`bg-white rounded-2xl border transition-all p-6 shadow-sm space-y-5 ${isConnectedConfirmed ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${sequenceOpened ? 'bg-emerald-500 text-white' : isConnectedConfirmed ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Étape 2 : Lancement de la séquence Codification (4 onglets)
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Confirmez votre authentification puis déclenchez l'ouverture simultanée
              </p>
            </div>
          </div>
          {!isConnectedConfirmed && (
            <span className="inline-flex items-center text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              <Lock className="w-3.5 h-3.5 mr-1 text-slate-400" /> Verrouillé
            </span>
          )}
        </div>

        {/* Confirmation Checkbox */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <label className="flex items-center space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isConnectedConfirmed}
              onChange={(e) => {
                setIsConnectedConfirmed(e.target.checked);
                if (e.target.checked) {
                  onShowNotification('Connexion confirmée. Bouton de séquence débloqué !');
                }
              }}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-sm font-semibold text-slate-800">
              Je confirme être bien connecté à PeopleSoft FPROD
            </span>
          </label>

          {isConnectedConfirmed && (
            <span className="hidden sm:inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Session confirmée
            </span>
          )}
        </div>

        {/* List of 4 target tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {VENDOR_TABS.map((tab) => (
            <div
              key={tab.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-800">{tab.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">Environnement : <span className="font-semibold text-indigo-600">{tab.env}</span></p>
              </div>
              <button
                disabled={!isConnectedConfirmed}
                onClick={() => {
                  const win = window.open(tab.url, '_blank');
                  if (!win || win.closed || typeof win.closed === 'undefined') {
                    onPopupBlocked();
                  }
                }}
                className={`p-2 rounded-lg text-xs font-bold transition-all ${
                  isConnectedConfirmed
                    ? 'bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 shadow-xs cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                title="Ouvrir cet onglet séparément"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Launch Sequence Button */}
        <button
          disabled={!isConnectedConfirmed}
          onClick={handleLaunchSequence}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
            isConnectedConfirmed
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20 cursor-pointer active:scale-[0.99]'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <Zap className="w-4 h-4" />
          Lancer la séquence de codification fournisseur (4 onglets)
        </button>
      </div>
    </div>
  );
};
