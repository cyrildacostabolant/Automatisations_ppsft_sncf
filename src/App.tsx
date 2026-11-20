import React, { useState } from 'react';
import { INITIAL_ERP_TABS, INITIAL_VENDOR_TABS } from './data/tabsData';
import { ErpTab, WorkflowState } from './types';
import { Header } from './components/Header';
import { WorkflowStepper } from './components/WorkflowStepper';
import { QuickCopyBar } from './components/QuickCopyBar';
import { SqlQueryGenerator } from './components/SqlQueryGenerator';
import { VendorCodification } from './components/VendorCodification';
import { PopupGuideModal } from './components/PopupGuideModal';
import { ShieldAlert, CheckCircle2, Database, Building2 } from 'lucide-react';

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

  // Mark a tab as opened (used by native <a target="_blank"> links without calling window.open)
  const handleMarkTabOpened = (tabId: number) => {
    const timeStr = getFormattedTime();
    setTabs((prevTabs) =>
      prevTabs.map((t) =>
        t.id === tabId ? { ...t, opened: true, openedAt: timeStr } : t
      )
    );
    setWorkflow((prev) => ({
      ...prev,
      openedTabIds: Array.from(new Set([...prev.openedTabIds, tabId])),
    }));
  };

  // Reset only tab opened state (keeps BU / DA / mode)
  const handleResetTabs = () => {
    setTabs(INITIAL_ERP_TABS);
    setWorkflow((prev) => ({
      ...prev,
      step: 1,
      connectionStatus: 'not_started',
      openedTabIds: [],
    }));
    showNotification('Séquence Sourcing DA réinitialisée.');
  };

  // Open all tabs via window.open
  const handleOpenAllTabs = () => {
    if (workflow.launchMode === 'all_at_once') {
      let blockedAny = false;
      const timeStr = getFormattedTime();
      const openedIds: number[] = [];

      tabs.forEach((tab) => {
        const win = window.open(tab.url, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          blockedAny = true;
        } else {
          openedIds.push(tab.id);
        }
      });

      if (openedIds.length > 0) {
        setTabs((prevTabs) =>
          prevTabs.map((t) =>
            openedIds.includes(t.id) ? { ...t, opened: true, openedAt: timeStr } : t
          )
        );
        setWorkflow((prev) => ({
          ...prev,
          openedTabIds: Array.from(new Set([...prev.openedTabIds, ...openedIds])),
        }));
      }

      if (blockedAny) {
        setPopupBlockedWarning(true);
        setIsPopupGuideOpen(true);
        showNotification(
          'Pop-ups bloqués : utilisez l\'export Favoris (.html), le script .bat ou le mode Sans popup.'
        );
      } else {
        setWorkflow((prev) => ({ ...prev, step: 3, connectionStatus: 'connected' }));
        showNotification(`Les ${tabs.length} onglets PeopleSoft ont été ouverts directement !`);
      }
    } else {
      // Sequential delay mode
      showNotification(`Ouverture séquentielle des ${tabs.length} onglets (${workflow.delayBetweenTabsMs}ms d'intervalle)...`);
      let count = 0;
      let blockedAny = false;

      tabs.forEach((tab, index) => {
        setTimeout(() => {
          const win = window.open(tab.url, '_blank');
          if (!win || win.closed || typeof win.closed === 'undefined') {
            blockedAny = true;
          } else {
            const timeStr = getFormattedTime();
            setTabs((prev) =>
              prev.map((t) => (t.id === tab.id ? { ...t, opened: true, openedAt: timeStr } : t))
            );
            setWorkflow((prev) => ({
              ...prev,
              openedTabIds: Array.from(new Set([...prev.openedTabIds, tab.id])),
            }));
          }

          count++;
          if (count === tabs.length) {
            if (blockedAny) {
              setPopupBlockedWarning(true);
              setIsPopupGuideOpen(true);
              showNotification('Pop-ups bloqués par votre navigateur. Utilisez la solution Favoris ou Script .bat.');
            } else {
              setWorkflow((prev) => ({ ...prev, step: 3, connectionStatus: 'connected' }));
              showNotification(`Les ${tabs.length} onglets ont été lancés avec succès !`);
            }
          }
        }, index * workflow.delayBetweenTabsMs);
      });
    }
  };

  const openedCount = tabs.filter((t) => t.opened).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <div>
        {/* Top Navigation & Title Bar */}
        <Header />

        {/* Popup Blocked Warning Alert Banner */}
        {popupBlockedWarning && (
          <div className="bg-amber-500 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-medium">
            <div className="max-w-7xl mx-auto flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>
                Les pop-ups sont bloqués par votre navigateur/administrateur.
              </span>
              <button
                onClick={() => setIsPopupGuideOpen(true)}
                className="underline hover:text-amber-100 font-bold ml-2 cursor-pointer"
              >
                Ouvrir tout automatiquement (Favoris / Script .bat)
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
                onMarkTabOpened={handleMarkTabOpened}
                onResetTabs={handleResetTabs}
                onOpenBypassModal={() => setIsPopupGuideOpen(true)}
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
              onOpenBypassModal={() => setIsPopupGuideOpen(true)}
            />
          )}
        </main>

        {/* Popup Bypass Solutions Modal Dialog */}
        <PopupGuideModal
          isOpen={isPopupGuideOpen}
          onClose={() => setIsPopupGuideOpen(false)}
          activeModule={activeAutomationTab}
          sourcingTabs={INITIAL_ERP_TABS}
          vendorTabs={INITIAL_VENDOR_TABS}
          onShowNotification={showNotification}
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
