import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SimulatorView } from './components/SimulatorView';
import { VaultView } from './components/VaultView';
import { BookmarkletView } from './components/BookmarkletView';
import { PersonasView } from './components/PersonasView';
import { DeveloperSdkView } from './components/DeveloperSdkView';
import { IdentityProfile, RegisteredAccount } from './types';
import { DEFAULT_PROFILES, INITIAL_VAULT_ACCOUNTS } from './data/defaultData';
import { Shield, Zap, Lock, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'vault' | 'bookmarklet' | 'personas' | 'sdk'>('simulator');
  
  // Persistent Profiles State
  const [profiles, setProfiles] = useState<IdentityProfile[]>(() => {
    try {
      const saved = localStorage.getItem('onetap_profiles');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILES;
    } catch {
      return DEFAULT_PROFILES;
    }
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem('onetap_active_profile_id');
      return savedId || DEFAULT_PROFILES[0].id;
    } catch {
      return DEFAULT_PROFILES[0].id;
    }
  });

  // Persistent Accounts Vault State
  const [accounts, setAccounts] = useState<RegisteredAccount[]>(() => {
    try {
      const saved = localStorage.getItem('onetap_accounts');
      return saved ? JSON.parse(saved) : INITIAL_VAULT_ACCOUNTS;
    } catch {
      return INITIAL_VAULT_ACCOUNTS;
    }
  });

  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Active Profile object
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  // Save to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('onetap_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.error(e);
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem('onetap_active_profile_id', activeProfileId);
    } catch (e) {
      console.error(e);
    }
  }, [activeProfileId]);

  useEffect(() => {
    try {
      localStorage.setItem('onetap_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  // Check for any accounts captured externally via the Bookmarklet
  useEffect(() => {
    try {
      const captured = localStorage.getItem('onetap_captured_accounts');
      if (captured) {
        const parsed: RegisteredAccount[] = JSON.parse(captured);
        if (parsed && parsed.length > 0) {
          // Merge newly captured
          setAccounts((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newOnes = parsed.filter((a) => !existingIds.has(a.id));
            if (newOnes.length > 0) {
              setSyncToast(`Synced ${newOnes.length} new 1-click registration from browser bookmarklet!`);
              setTimeout(() => setSyncToast(null), 4000);
              return [...newOnes, ...prev];
            }
            return prev;
          });
          localStorage.removeItem('onetap_captured_accounts');
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAccountCreated = (newAccount: RegisteredAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddAccount = (newAccount: RegisteredAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);
  };

  const handleUpdateProfiles = (newProfiles: IdentityProfile[]) => {
    setProfiles(newProfiles);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Universal Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profiles={profiles}
        activeProfile={activeProfile}
        setActiveProfileId={setActiveProfileId}
        accountsCount={accounts.length}
      />

      {/* Sync Toast if bookmarklet triggered outside */}
      {syncToast && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-300 py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'simulator' && (
          <SimulatorView
            activeProfile={activeProfile}
            onAccountCreated={handleAccountCreated}
            onNavigateToVault={() => setActiveTab('vault')}
          />
        )}

        {activeTab === 'vault' && (
          <VaultView
            accounts={accounts}
            onDeleteAccount={handleDeleteAccount}
            onAddAccount={handleAddAccount}
            activeProfile={activeProfile}
          />
        )}

        {activeTab === 'bookmarklet' && (
          <BookmarkletView activeProfile={activeProfile} />
        )}

        {activeTab === 'personas' && (
          <PersonasView
            profiles={profiles}
            activeProfile={activeProfile}
            setActiveProfileId={setActiveProfileId}
            onUpdateProfiles={handleUpdateProfiles}
          />
        )}

        {activeTab === 'sdk' && (
          <DeveloperSdkView activeProfile={activeProfile} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />
            </div>
            <span className="font-semibold text-neutral-300">OneTap System</span>
            <span>— Universal 1-Click Signup & Identity Vault</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Zero Credential Leakage
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Client-Side Encrypted
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
