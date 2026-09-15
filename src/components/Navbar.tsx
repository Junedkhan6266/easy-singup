import React from 'react';
import { 
  Zap, 
  KeyRound, 
  BookmarkCheck, 
  UserCheck, 
  Code2, 
  ShieldCheck, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { IdentityProfile } from '../types';

interface NavbarProps {
  activeTab: 'simulator' | 'vault' | 'bookmarklet' | 'personas' | 'sdk';
  setActiveTab: (tab: 'simulator' | 'vault' | 'bookmarklet' | 'personas' | 'sdk') => void;
  profiles: IdentityProfile[];
  activeProfile: IdentityProfile;
  setActiveProfileId: (id: string) => void;
  accountsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profiles,
  activeProfile,
  setActiveProfileId,
  accountsCount,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('simulator')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
                <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center group-hover:bg-neutral-900 transition-colors">
                  <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-white">OneTap</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Universal 1-Click
                  </span>
                </div>
                <p className="text-xs text-neutral-400 hidden sm:block">
                  Instant sign-up to any website or app
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800/80">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>1-Click Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'vault'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Vault</span>
              <span className="ml-0.5 text-[11px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                {accountsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarklet')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'bookmarklet'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Browser Injector</span>
            </button>

            <button
              onClick={() => setActiveTab('personas')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'personas'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Personas</span>
            </button>

            <button
              onClick={() => setActiveTab('sdk')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'sdk'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>App SDK</span>
            </button>
          </nav>

          {/* Right Action: Active Persona Quick-Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-sm font-medium transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: activeProfile.color }}
                />
                <span className="max-w-[110px] truncate hidden sm:inline">
                  {activeProfile.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-neutral-800/80 mb-1">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Active 1-Click Persona
                    </p>
                    <p className="text-xs text-neutral-300 truncate">
                      {activeProfile.primaryEmail}
                    </p>
                  </div>
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProfileId(p.id);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                        p.id === activeProfile.id
                          ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        <div className="truncate">
                          <div className="font-semibold text-neutral-200">{p.name}</div>
                          <div className="text-[10px] text-neutral-400 font-mono truncate">
                            {p.persona === 'burner' ? 'Burner / Masked' : p.primaryEmail}
                          </div>
                        </div>
                      </div>
                      {p.id === activeProfile.id && (
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="mt-1 pt-1 border-t border-neutral-800">
                    <button
                      onClick={() => {
                        setActiveTab('personas');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Configure Personas & Rules
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-neutral-800/60 no-scrollbar">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'simulator' ? 'bg-indigo-600 text-white' : 'text-neutral-400'
            }`}
          >
            ⚡ Simulator
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'vault' ? 'bg-indigo-600 text-white' : 'text-neutral-400'
            }`}
          >
            🔑 Vault ({accountsCount})
          </button>
          <button
            onClick={() => setActiveTab('bookmarklet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'bookmarklet' ? 'bg-indigo-600 text-white' : 'text-neutral-400'
            }`}
          >
            🌐 Browser Injector
          </button>
          <button
            onClick={() => setActiveTab('personas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'personas' ? 'bg-indigo-600 text-white' : 'text-neutral-400'
            }`}
          >
            👤 Personas
          </button>
          <button
            onClick={() => setActiveTab('sdk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'sdk' ? 'bg-indigo-600 text-white' : 'text-neutral-400'
            }`}
          >
            🛠️ SDK
          </button>
        </div>
      </div>
    </header>
  );
};
