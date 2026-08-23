import React from 'react';
import { X, ExternalLink, ShieldAlert, CheckCircle2, HelpCircle, Layers } from 'lucide-react';

interface PopupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestPopup: () => void;
}

export const PopupGuideModal: React.FC<PopupGuideModalProps> = ({
  isOpen,
  onClose,
  onTestPopup,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-indigo-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                Autoriser l'ouverture de multiples onglets
              </h3>
              <p className="text-xs text-indigo-200">
                Gestion des blocages de pop-ups par votre navigateur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-indigo-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-600">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Pourquoi mon navigateur peut-il bloquer les onglets ?</p>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                Par sécurité, Google Chrome, Microsoft Edge et Firefox bloquent l'ouverture simultanée de plus de 1 onglet lors d'un seul clic si le site n'est pas autorisé.
              </p>
            </div>
          </div>

          <h4 className="font-bold text-slate-800 text-sm">
            Comment autoriser le lancement en 1 clic :
          </h4>

          <ol className="space-y-3 list-decimal list-inside pl-1 text-xs">
            <li className="leading-relaxed">
              <strong>Repérez l'icône de blocage :</strong> Regardez dans la barre d'adresse de votre navigateur (à droite ou à gauche de l'URL) pour trouver une petite icône rouge avec une croix <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-bold">[Pop-up bloqué]</span>.
            </li>
            <li className="leading-relaxed">
              <strong>Autoriser toujours :</strong> Cliquez sur l'icône et sélectionnez <em>"Toujours autoriser les fenêtres surgissantes et les redirections de ce site"</em>.
            </li>
            <li className="leading-relaxed">
              <strong>Cliquez sur Terminé :</strong> Puis réessayez en cliquant sur le bouton <em>"Lancer la séquence de sourcing (5 onglets restants)"</em>.
            </li>
          </ol>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Astuce : Utiliser le mode progressif avec délai
            </h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Si vous ne pouvez pas modifier les paramètres de votre navigateur d'entreprise, sélectionnez le mode <strong>"Avec délai (Progressif)"</strong> dans le sélecteur sous la séquence d'ouverture !
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onTestPopup}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold rounded-xl text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mr-2 text-slate-500" />
            Tester la popup de test
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all cursor-pointer"
          >
            J'ai compris !
          </button>
        </div>
      </div>
    </div>
  );
};
