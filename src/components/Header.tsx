import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 lg:px-10 flex items-center justify-between shrink-0 shadow-xs">
      {/* Title & Branding */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-indigo-500/20 border border-slate-200/80 bg-slate-900 shrink-0">
          <img
            src="/src/assets/images/robot_app_icon_1785488706867.jpg"
            alt="Icône Robot Automateur"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
            Automatisations Peoplesoft SNCF
          </h1>
          <p className="text-[11px] sm:text-xs font-medium text-slate-400 uppercase tracking-widest">
            ERP PeopleSoft Automator &bull; SNCF FPROD
          </p>
        </div>
      </div>
    </header>
  );
};

