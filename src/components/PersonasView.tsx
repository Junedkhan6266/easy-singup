import React, { useState } from 'react';
import { 
  UserCheck, 
  Shield, 
  Sparkles, 
  Lock, 
  Check, 
  Plus, 
  Sliders, 
  Trash2, 
  Zap,
  Info,
  Layers,
  Settings
} from 'lucide-react';
import { IdentityProfile, PersonaType } from '../types';

interface PersonasViewProps {
  profiles: IdentityProfile[];
  activeProfile: IdentityProfile;
  setActiveProfileId: (id: string) => void;
  onUpdateProfiles: (profiles: IdentityProfile[]) => void;
}

export const PersonasView: React.FC<PersonasViewProps> = ({
  profiles,
  activeProfile,
  setActiveProfileId,
  onUpdateProfiles,
}) => {
  const [editingProfile, setEditingProfile] = useState<IdentityProfile>(activeProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // New profile state
  const [newProfileName, setNewProfileName] = useState('');
  const [newPersonaType, setNewPersonaType] = useState<PersonaType>('personal');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDomain, setNewDomain] = useState('onetap.id');

  const handleSelectToEdit = (profile: IdentityProfile) => {
    setEditingProfile(profile);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = profiles.map((p) =>
      p.id === editingProfile.id ? editingProfile : p
    );
    onUpdateProfiles(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName || !newEmail) return;

    const colors = ['#ec4899', '#06b6d4', '#84cc16', '#eab308', '#f97316'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const created: IdentityProfile = {
      id: 'prof-' + Date.now(),
      name: newProfileName,
      persona: newPersonaType,
      fullName: newFullName || 'Alex User',
      primaryEmail: newEmail,
      aliasDomain: newDomain || 'onetap.id',
      defaultUsername: newEmail.split('@')[0],
      autoSubmit: true,
      passwordLength: 20,
      includeSymbols: true,
      includeNumbers: true,
      color: randomColor,
    };

    const updated = [...profiles, created];
    onUpdateProfiles(updated);
    setActiveProfileId(created.id);
    setEditingProfile(created);
    setShowNewModal(false);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      alert("You must keep at least one profile.");
      return;
    }
    const updated = profiles.filter((p) => p.id !== id);
    onUpdateProfiles(updated);
    if (activeProfile.id === id) {
      setActiveProfileId(updated[0].id);
      setEditingProfile(updated[0]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-indigo-400" />
            Identity Personas & Autofill Profiles
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Control how your identities are synthesized across different websites. Use Burner mode for untrusted platforms, Corporate for work tools, and Personal for daily services.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Persona
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Profiles List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
            Configured Personas ({profiles.length})
          </h3>

          <div className="space-y-2">
            {profiles.map((p) => {
              const isActive = p.id === activeProfile.id;
              const isSelectedForEdit = p.id === editingProfile.id;

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectToEdit(p)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelectedForEdit
                      ? 'bg-neutral-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{p.name}</span>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                              ACTIVE
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-neutral-400 font-mono mt-0.5 truncate max-w-[200px]">
                          {p.primaryEmail}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-semibold text-neutral-400 px-2 py-0.5 bg-neutral-850 rounded">
                      {p.persona}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Key: {p.passwordLength} chars</span>
                    <span>Domain: @{p.aliasDomain}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-300 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
            <p>
              Switching your active persona changes how the 1-Click Simulator and Browser Bookmarklet generate your credentials in real-time.
            </p>
          </div>
        </div>

        {/* Right Side: Profile Editor & Policy Settings */}
        <div className="lg:col-span-8 rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: editingProfile.color }}
                />
                Editing: {editingProfile.name}
              </h2>
              <p className="text-xs text-neutral-400">
                Configure credential synthesis parameters, alias masking, and auto-submit rules.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeProfile.id !== editingProfile.id && (
                <button
                  type="button"
                  onClick={() => setActiveProfileId(editingProfile.id)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
                >
                  Set as Active Persona
                </button>
              )}
              {profiles.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteProfile(editingProfile.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete persona"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveEdit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Persona Label
                </label>
                <input
                  type="text"
                  required
                  value={editingProfile.name}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Persona Archetype
                </label>
                <select
                  value={editingProfile.persona}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      persona: e.target.value as PersonaType,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="personal">Personal (Everyday Accounts)</option>
                  <option value="burner">Burner / Ghost (Disposable Aliases)</option>
                  <option value="work">Work (Enterprise & SSO)</option>
                  <option value="developer">Developer (Testing Bots & Sandboxes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Full Name / Identity Value
                </label>
                <input
                  type="text"
                  required
                  value={editingProfile.fullName}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, fullName: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Base Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editingProfile.primaryEmail}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      primaryEmail: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Masked Alias Host Domain
                </label>
                <input
                  type="text"
                  value={editingProfile.aliasDomain}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      aliasDomain: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Default Handle / Username
                </label>
                <input
                  type="text"
                  value={editingProfile.defaultUsername}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      defaultUsername: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Password Policy Controls */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  Password Synthesis Length: <strong className="text-white font-mono">{editingProfile.passwordLength} characters</strong>
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  Entropy: ~{Math.round(editingProfile.passwordLength * 5.6)} bits
                </span>
              </div>

              <input
                type="range"
                min={12}
                max={36}
                value={editingProfile.passwordLength}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    passwordLength: Number(e.target.value),
                  })
                }
                className="w-full accent-indigo-600"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProfile.includeSymbols}
                    onChange={(e) =>
                      setEditingProfile({
                        ...editingProfile,
                        includeSymbols: e.target.checked,
                      })
                    }
                    className="rounded bg-neutral-900 border-neutral-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Special Symbols (!@#$)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProfile.includeNumbers}
                    onChange={(e) =>
                      setEditingProfile({
                        ...editingProfile,
                        includeNumbers: e.target.checked,
                      })
                    }
                    className="rounded bg-neutral-900 border-neutral-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Numbers (0-9)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProfile.autoSubmit}
                    onChange={(e) =>
                      setEditingProfile({
                        ...editingProfile,
                        autoSubmit: e.target.checked,
                      })
                    }
                    className="rounded bg-neutral-900 border-neutral-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Auto-Submit Immediately</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-500">
                All settings are stored in local secure sandbox storage.
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <span>Save Persona Settings</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal for Creating New Persona */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">Create New Persona</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Persona Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaming & Demo Accounts"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Archetype
                </label>
                <select
                  value={newPersonaType}
                  onChange={(e) => setNewPersonaType(e.target.value as PersonaType)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="personal">Personal</option>
                  <option value="burner">Burner / Ghost</option>
                  <option value="work">Work</option>
                  <option value="developer">Developer</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Full Name / Alias
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Primary Routing Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Alias Mask Domain
                </label>
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                >
                  Create Persona
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
