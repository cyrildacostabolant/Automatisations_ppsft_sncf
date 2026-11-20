import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Terminal,
  MousePointerClick,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  FolderOpen,
} from 'lucide-react';
import { ErpTab } from '../types';
import {
  TargetBrowser,
  downloadTextFile,
  generateBatScript,
  generateBookmarksHtml,
  generatePowerShellCommand,
} from '../utils/launcherGenerators';

interface PopupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: 'sourcing_da' | 'vendor_codification';
  sourcingTabs: ErpTab[];
  vendorTabs: ErpTab[];
  onShowNotification: (msg: string) => void;
}

type SolutionTab = 'bookmarks' | 'script' | 'direct_links';

export const PopupGuideModal: React.FC<PopupGuideModalProps> = ({
  isOpen,
  onClose,
  activeModule,
  sourcingTabs,
  vendorTabs,
  onShowNotification,
}) => {
  const [selectedSolution, setSelectedSolution] = useState<SolutionTab>('bookmarks');
  const [targetBrowser, setTargetBrowser] = useState<TargetBrowser>('edge');
  const [copiedPs, setCopiedPs] = useState(false);

  if (!isOpen) return null;

  const currentTabs = activeModule === 'sourcing_da' ? sourcingTabs : vendorTabs;
  const currentModuleName =
    activeModule === 'sourcing_da' ? 'Forcer Sourcing DA' : 'Codification Fournisseur';
  const currentFileSlug =
    activeModule === 'sourcing_da' ? 'Forcer_Sourcing_DA' : 'Codification_Fournisseur';

  const psCommand = generatePowerShellCommand(currentTabs, targetBrowser);

  const handleDownloadBookmarks = () => {
    const html = generateBookmarksHtml(sourcingTabs, vendorTabs);
    downloadTextFile('favoris_peoplesoft_sncf.html', html, 'text/html;charset=utf-8');
    onShowNotification('Fichier favoris_peoplesoft_sncf.html téléchargé !');
  };

  const handleDownloadBat = (module: 'sourcing_da' | 'vendor_codification') => {
    const tabsToExport = module === 'sourcing_da' ? sourcingTabs : vendorTabs;
    const label = module === 'sourcing_da' ? 'Forcer Sourcing DA' : 'Codification Fournisseur';
    const filename =
      module === 'sourcing_da'
        ? 'Lancer_Forcer_Sourcing_DA.bat'
        : 'Lancer_Codification_Fournisseur.bat';
    const batContent = generateBatScript(tabsToExport, targetBrowser, label);
    downloadTextFile(filename, batContent, 'application/bat;charset=utf-8');
    onShowNotification(`Script ${filename} téléchargé !`);
  };

  const handleCopyPowerShell = async () => {
    try {
      await navigator.clipboard.writeText(psCommand);
      setCopiedPs(true);
      onShowNotification('Commande PowerShell copiée dans le presse-papier !');
      setTimeout(() => setCopiedPs(false), 2500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                Ouvrir tous les onglets sans autoriser les pop-ups
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Solutions compatibles avec un poste d&apos;entreprise verrouillé par l&apos;administrateur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Solution Tabs Selector */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setSelectedSolution('bookmarks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedSolution === 'bookmarks'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            1. Dossier de Favoris (Recommandé)
          </button>
          <button
            onClick={() => setSelectedSolution('script')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedSolution === 'script'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            2. Lanceur Windows (.bat / PowerShell)
          </button>
          <button
            onClick={() => setSelectedSolution('direct_links')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedSolution === 'direct_links'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            3. Mode Sans Popup intégré
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600">
          {selectedSolution === 'bookmarks' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <p className="font-bold text-sm flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-emerald-600" />
                  La méthode 100% native qui ne peut jamais être bloquée
                </p>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Edge et Chrome autorisent toujours l&apos;ouverture simultanée d&apos;un dossier de favoris complet, même lorsque les pop-ups JavaScript sont bloqués par stratégie d&apos;entreprise (GPO). Zéro script, zéro droit administrateur requis.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">
                    Fichier complet PeopleSoft SNCF (.html)
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Contient 2 dossiers : Forcer Sourcing DA ({sourcingTabs.length} onglets) et Codification Fournisseur ({vendorTabs.length} onglets).
                  </p>
                </div>
                <button
                  onClick={handleDownloadBookmarks}
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Télécharger les Favoris
                </button>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Installation en 30 secondes (à faire une seule fois) :
                </h4>
                <ol className="space-y-2.5 list-decimal list-inside text-xs text-slate-600 bg-white border border-slate-200 rounded-2xl p-4">
                  <li className="leading-relaxed">
                    Téléchargez le fichier <span className="font-mono font-bold text-slate-800">favoris_peoplesoft_sncf.html</span> ci-dessus.
                  </li>
                  <li className="leading-relaxed">
                    Dans Edge ou Chrome, appuyez sur <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-bold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-bold">Maj</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-bold">O</kbd>, cliquez sur <strong>•••</strong> puis <strong>Importer des favoris</strong> &rarr; <strong>Fichier HTML</strong>.
                  </li>
                  <li className="leading-relaxed">
                    Placez le dossier <strong>PeopleSoft SNCF</strong> dans votre barre de favoris (<kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-bold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-bold">Maj</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-bold">B</kbd>).
                  </li>
                  <li className="leading-relaxed">
                    <strong>Au quotidien :</strong> faites un <strong>Clic molette</strong> sur le dossier (ou <strong>Clic droit &rarr; Ouvrir tout ({sourcingTabs.length})</strong>) pour lancer automatiquement tous les onglets d&apos;un coup !
                  </li>
                </ol>
              </div>
            </div>
          )}

          {selectedSolution === 'script' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                <p className="font-bold text-sm">
                  Lancement direct depuis Windows (contourne le navigateur)
                </p>
                <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                  Lorsqu&apos;un raccourci Windows ou PowerShell ouvre les URLs, ce n&apos;est pas une page web qui les déclenche : le bloqueur de pop-ups du navigateur ne s&apos;active jamais.
                </p>
              </div>

              {/* Browser selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  Navigateur à utiliser :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: 'edge', label: 'Microsoft Edge' },
                      { id: 'chrome', label: 'Google Chrome' },
                      { id: 'default', label: 'Par défaut Windows' },
                    ] as const
                  ).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setTargetBrowser(b.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        targetBrowser === b.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download .bat */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    Option A : Fichier double-clic sur le Bureau (.bat)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enregistrez ce fichier sur votre Bureau et double-cliquez dessus pour ouvrir tous les onglets.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDownloadBat(activeModule)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger {currentFileSlug}.bat ({currentTabs.length} onglets)
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadBat(
                        activeModule === 'sourcing_da' ? 'vendor_codification' : 'sourcing_da'
                      )
                    }
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {activeModule === 'sourcing_da'
                      ? `Codification Fournisseur (${vendorTabs.length})`
                      : `Forcer Sourcing DA (${sourcingTabs.length})`}
                  </button>
                </div>
              </div>

              {/* PowerShell one-liner */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">
                      Option B : Commande PowerShell (si les .bat sont bloqués)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Module actif : {currentModuleName} ({currentTabs.length} onglets)
                    </p>
                  </div>
                  <button
                    onClick={handleCopyPowerShell}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                      copiedPs
                        ? 'bg-emerald-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copiedPs ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPs ? 'Copié' : 'Copier'}
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-indigo-200 bg-slate-950/80 p-3 rounded-xl overflow-x-auto select-all whitespace-pre-wrap break-all">
                  {psCommand}
                </pre>
              </div>
            </div>
          )}

          {selectedSolution === 'direct_links' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <p className="font-bold text-sm">
                  Pourquoi un clic unique ne peut pas ouvrir 7 pop-ups en JavaScript ?
                </p>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Lorsqu&apos;un administrateur verrouille les pop-ups sur Chrome/Edge, le navigateur bloque tout appel multiple à <code className="font-mono bg-amber-100 px-1 rounded">window.open()</code> provenant d&apos;une page web. En revanche, un <strong>vrai lien HTML</strong> cliqué par vous reste autorisé comme une navigation normale.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 text-sm">
                  Comment utiliser le Mode Sans Popup intégré :
                </h4>
                <ul className="space-y-2.5 text-slate-600">
                  <li className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      Utilisez le bouton <strong>&laquo; Ouvrir l&apos;onglet suivant (Lien direct) &raquo;</strong> juste sous le bouton principal. Maintenez la touche <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-bold">Ctrl</kbd> enfoncée et cliquez {currentTabs.length} fois au même endroit : tous les onglets s&apos;ouvrent en arrière-plan en 2 secondes sans jamais quitter cette page !
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MousePointerClick className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      Chaque bouton <strong>&laquo; Ouvrir &raquo;</strong> dans la grille ci-dessous est désormais un vrai lien natif : un <strong>clic molette</strong> (bouton central de la souris) ouvre l&apos;onglet directement en arrière-plan.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-400 font-medium">
            Astuce : Le dossier de Favoris (.html) est la solution la plus rapide au quotidien.
          </span>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shrink-0"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
