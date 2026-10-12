import React, { useState, useEffect } from 'react';
import { INITIAL_ERP_TABS } from './data/tabsData';
import { ErpTab, LaunchMode, WorkflowState } from './types';
import { Header } from './components/Header';
import { WorkflowStepper } from './components/WorkflowStepper';
import { QuickCopyBar } from './components/QuickCopyBar';
import { SqlQueryGenerator } from './components/SqlQueryGenerator';
import { VendorCodification } from './components/VendorCodification';
import { PopupGuideModal } from './components/PopupGuideModal';
import { AlertCircle, ShieldAlert, CheckCircle2, Zap, RotateCcw, HelpCircle, Database, Building2 } from 'lucide-react';

export default function App() {
  const [activeAutomationTab, setActiveAutomationTab] = useState<'sourcing_da' | 'vendor_codification'>('sourcing_da');
  const [tabs, setTabs] = useState<ErpTab[]>(INITIAL_ERP_TABS);
  const [workflow, setWorkflow] = useState<WorkflowState>({
    step: 1,
    connectionStatus: 'not_started',
    openedTabIds: [],
    launchMode: 'all_at_once',
    delayBetweenTabsMs: 600,
    requisitionId: '',
    businessUnit: '',
    processNotes: '',
  });

  const [isPopupGuideOpen, setIsPopupGuideOpen] = useState(false);
  const [popupBlockedWarning, setPopupBlockedWarning] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  // Helper to get formatted current time
  const getFormattedTime = () => {
    return new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const showNotification = (msg: string) => {
    setActiveMessage(msg);
    setTimeout(() => setActiveMessage(null), 4000);
  };

  // 1. Open individual tab
  const handleOpenTab = (tab: ErpTab) => {
    const win = window.open(tab.url, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      setPopupBlockedWarning(true);
      showNotification("Attention : Le navigateur a bloqué l'ouverture de l'onglet.");
    }

    const timeStr = getFormattedTime();

    setTabs((prevTabs) =>
      prevTabs.map((t) =>
        t.id === tab.id
          ? { ...t, opened: true, openedAt: timeStr }
          : t
      )
    );

    setWorkflow((prev) => ({
      ...prev,
      openedTabIds: Array.from(new Set([...prev.openedTabIds, tab.id])),
      connectionStatus: tab.isFirstTab ? 'awaiting_login' : prev.connectionStatus,
    }));

    if (tab.isFirstTab && workflow.step === 1) {
      showNotification("1er onglet ouvert ! Veuillez vous connecter à PeopleSoft puis cliquer sur 'Valider ma connexion'.");
    }
  };

  // 2. Open all 6 tabs directly
  const handleOpenAllTabs = () => {
    if (workflow.launchMode === 'all_at_once') {
      let blockedAny = false;
      const timeStr = getFormattedTime();
      const allIds: number[] = [];

      tabs.forEach((tab) => {
        const win = window.open(tab.url, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          blockedAny = true;
        }
        allIds.push(tab.id);
      });

      setTabs((prevTabs) =>
        prevTabs.map((t) => ({ ...t, opened: true, openedAt: timeStr }))
      );

      setWorkflow((prev) => ({
        ...prev,
        step: 3,
        connectionStatus: 'connected',
        openedTabIds: allIds,
      }));

      if (blockedAny) {
        setPopupBlockedWarning(true);
        setIsPopupGuideOpen(true);
        showNotification("Certains onglets ont été bloqués par votre navigateur. Autorisez les pop-ups.");
      } else {
        showNotification("Les 6 onglets PeopleSoft ont été ouverts directement !");
      }
    } else {
      // Sequential delay mode
      showNotification(`Ouverture séquentielle des 6 onglets (${workflow.delayBetweenTabsMs}ms d'intervalle)...`);
      let count = 0;

      tabs.forEach((tab, index) => {
        setTimeout(() => {
          const win = window.open(tab.url, '_blank');
          if (!win || win.closed || typeof win.closed === 'undefined') {
            setPopupBlockedWarning(true);
          }
          const timeStr = getFormattedTime();

          setTabs((prev) =>
            prev.map((t) => (t.id === tab.id ? { ...t, opened: true, openedAt: timeStr } : t))
          );

          setWorkflow((prev) => ({
            ...prev,
            openedTabIds: Array.from(new Set([...prev.openedTabIds, tab.id])),
          }));

          count++;
          if (count === tabs.length) {
            setWorkflow((prev) => ({ ...prev, step: 3, connectionStatus: 'connected' }));
            showNotification("Les 6 onglets ont été lancés avec succès !");
          }
        }, index * workflow.delayBetweenTabsMs);
      });
    }
  };

  // Toggle individual tab status (Manual check)
  const handleToggleTabStatus = (id: number) => {
    setTabs((prevTabs) =>
      prevTabs.map((t) =>
        t.id === id
          ? { ...t, opened: !t.opened, openedAt: !t.opened ? getFormattedTime() : undefined }
          : t
      )
    );
  };

  // Test popup tool
  const handleTestPopup = () => {
    const win1 = window.open('about:blank', '_blank');
    const win2 = window.open('about:blank', '_blank');

    if (!win1 || !win2 || win1.closed || win2.closed) {
      setPopupBlockedWarning(true);
      setIsPopupGuideOpen(true);
      if (win1) win1.close();
      if (win2) win2.close();
    } else {
      setPopupBlockedWarning(false);
      win1.close();
      win2.close();
      showNotification("Test réussi ! Votre navigateur autorise l'ouverture de fenêtres multiples.");
    }
  };

  // Reset overall state
  const handleReset = () => {
    setTabs(INITIAL_ERP_TABS);
    setWorkflow({
      step: 1,
      connectionStatus: 'not_started',
      openedTabIds: [],
      launchMode: 'all_at_once',
      delayBetweenTabsMs: 600,
      requisitionId: '',
      businessUnit: '',
      processNotes: '',
    });
    setPopupBlockedWarning(false);
    showNotification("Workflow réinitialisé.");
  };

  const openedCount = tabs.filter((t) => t.opened).length;
  const isFirstTabOpened = tabs.find((t) => t.isFirstTab)?.opened || false;
  const isConnected = workflow.connectionStatus === 'connected';
  const remainingCount = tabs.filter((t) => !t.isFirstTab && !t.opened).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <div>
        {/* Top Navigation & Title Bar */}
        <Header />

        {/* Popup Blocked Warning Alert Banner */}
        {popupBlockedWarning && (
          <div className="bg-amber-500 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-medium">
            <div className="max-w-7xl mx-auto flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-bounce" />
              <span>
                Les fenêtres surgissantes (pop-ups) semblent bloquées par votre navigateur.
              </span>
              <button
                onClick={() => setIsPopupGuideOpen(true)}
                className="underline hover:text-amber-100 font-bold ml-2 cursor-pointer"
              >
                Voir la solution
              </button>
            </div>
            <button
              onClick={() => setPopupBlockedWarning(false)}
              className="text-white hover:text-amber-200 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Floating Notification Toast */}
        {activeMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs sm:text-sm flex items-center space-x-2.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{activeMessage}</span>
          </div>
        )}

        {/* Main Content Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
          {/* Top Navigation Tabs for Independent Automations */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setActiveAutomationTab('sourcing_da')}
              className={`flex-1 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                activeAutomationTab === 'sourcing_da'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Database className="w-4 h-4 text-indigo-400" />
              Forcer Sourcing DA
            </button>
            <button
              onClick={() => setActiveAutomationTab('vendor_codification')}
              className={`flex-1 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                activeAutomationTab === 'vendor_codification'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              Codification Fournisseur
            </button>
          </div>

          {activeAutomationTab === 'sourcing_da' ? (
            <>
              {/* Quick Clipboard Helper for Business Unit & DA */}
              <QuickCopyBar
                requisitionId={workflow.requisitionId}
                businessUnit={workflow.businessUnit}
                onChangeRequisitionId={(val) => setWorkflow((prev) => ({ ...prev, requisitionId: val }))}
                onChangeBusinessUnit={(val) => setWorkflow((prev) => ({ ...prev, businessUnit: val }))}
              />

              {/* Direct Workflow Manager */}
              <WorkflowStepper
                tabs={tabs}
                launchMode={workflow.launchMode}
                delayBetweenTabsMs={workflow.delayBetweenTabsMs}
                onOpenAllTabs={handleOpenAllTabs}
                onOpenTab={handleOpenTab}
                onChangeLaunchMode={(mode) => setWorkflow((prev) => ({ ...prev, launchMode: mode }))}
                onChangeDelay={(delay) => setWorkflow((prev) => ({ ...prev, delayBetweenTabsMs: delay }))}
                openedCount={openedCount}
              />

              {/* Dynamic SQL Query Generator for PeopleSoft Sourcing */}
              <SqlQueryGenerator
                requisitionId={workflow.requisitionId}
                businessUnit={workflow.businessUnit}
              />
            </>
          ) : (
            <VendorCodification
              onShowNotification={showNotification}
              onPopupBlocked={() => {
                setPopupBlockedWarning(true);
                setIsPopupGuideOpen(true);
              }}
            />
          )}
        </main>

        {/* Popup Guide Modal Dialog */}
        <PopupGuideModal
          isOpen={isPopupGuideOpen}
          onClose={() => setIsPopupGuideOpen(false)}
          onTestPopup={handleTestPopup}
        />
      </div>

      {/* Sleek Footer */}
      <footer className="h-12 bg-white border-t border-slate-200 flex items-center justify-between px-6 sm:px-10 shrink-0 text-[11px] text-slate-400 font-medium">
        <span>Assistant d'Ouverture PeopleSoft &bull; {activeAutomationTab === 'sourcing_da' ? 'Forcer Sourcing DA' : 'Codification Fournisseur'}</span>
        <span>SNCF ERP &bull; FPROD</span>
      </footer>
    </div>
  );
}
