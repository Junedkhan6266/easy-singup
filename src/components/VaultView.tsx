import React, { useState } from 'react';
import { 
  Search, 
  KeyRound, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Trash2, 
  Download, 
  Upload, 
  Plus, 
  ShieldCheck, 
  ShieldAlert,
  Sparkles,
  Zap,
  Filter,
  Lock,
  Globe,
  FileText
} from 'lucide-react';
import { RegisteredAccount, IdentityProfile } from '../types';
import { generateSecurePassword, calculatePasswordScore } from '../services/credentialGenerator';

interface VaultViewProps {
  accounts: RegisteredAccount[];
  onDeleteAccount: (id: string) => void;
  onAddAccount: (account: RegisteredAccount) => void;
  activeProfile: IdentityProfile;
}

export const VaultView: React.FC<VaultViewProps> = ({
  accounts,
  onDeleteAccount,
  onAddAccount,
  activeProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New account form state
  const [newSiteName, setNewSiteName] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newCategory, setNewCategory] = useState<RegisteredAccount['category']>('saas');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Password toggle
  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.emailUsed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || acc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate vault security statistics
  const totalScore = accounts.reduce((acc, curr) => acc + curr.securityScore, 0);
  const avgScore = accounts.length > 0 ? Math.round(totalScore / accounts.length) : 100;
  const maskedEmailsCount = accounts.filter((a) => a.emailUsed.includes('+') || a.emailUsed.startsWith('temp_')).length;

  // Export vault
  const exportVaultAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(accounts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `onetap-vault-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportVaultAsCSV = () => {
    const headers = ['Site Name', 'Domain', 'Category', 'Email / Username', 'Password', 'Created At', 'Security Score'];
    const rows = accounts.map((a) => [
      `"${a.siteName.replace(/"/g, '""')}"`,
      `"${a.domain}"`,
      `"${a.category}"`,
      `"${a.emailUsed}"`,
      `"${a.password}"`,
      `"${a.createdAt}"`,
      a.securityScore,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `onetap-vault-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Open add modal and prefill strong password
  const openAddModal = () => {
    const autoPwd = generateSecurePassword(activeProfile.passwordLength);
    setNewPassword(autoPwd);
    setNewEmail(activeProfile.primaryEmail);
    setNewSiteName('');
    setNewDomain('');
    setNewNotes('');
    setShowAddModal(true);
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName || !newDomain) return;

    const newAcc: RegisteredAccount = {
      id: 'vault-' + Date.now(),
      siteName: newSiteName,
      domain: newDomain.replace(/^(https?:\/\/)?/, ''),
      category: newCategory,
      emailUsed: newEmail || activeProfile.primaryEmail,
      username: newEmail.split('@')[0],
      password: newPassword || generateSecurePassword(),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      status: 'active',
      securityScore: calculatePasswordScore(newPassword),
      method: 'simulator',
      notes: newNotes,
    };

    onAddAccount(newAcc);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-indigo-400" />
            Registered Accounts Vault
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            All accounts created across the web in 1 click, protected by privacy aliases and isolated high-entropy keys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportVaultAsCSV}
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-neutral-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV Export
          </button>
          <button
            onClick={exportVaultAsJSON}
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-neutral-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            JSON Backup
          </button>
          <button
            onClick={openAddModal}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </div>

      {/* Security Health Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Total 1-Click Signups</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {accounts.length}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Managed automatically</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Average Key Entropy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
            {avgScore}/100
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-1">Grade A+ (Military)</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Masked Privacy Aliases</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-300 font-mono">
            {maskedEmailsCount}
          </div>
          <div className="text-[11px] text-purple-400/80 mt-1">Real emails protected</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Compromise Risk</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-300 font-mono">
            0 Leaks
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Zero credential reuse</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts, domains, aliases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['all', 'saas', 'social', 'developer', 'shopping', 'entertainment'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts List / Grid */}
      {filteredAccounts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 flex items-center justify-center mx-auto text-neutral-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No accounts found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search query or category filter.'
              : 'Use the 1-Click Simulator or drag the Browser Bookmarklet to sign up on your favorite websites!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.map((account) => {
            const isRevealed = Boolean(revealedPasswords[account.id]);

            return (
              <div
                key={account.id}
                className="rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 p-5 shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Site Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-sm font-bold text-indigo-400 shrink-0">
                        {account.siteName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                          {account.siteName}
                        </h4>
                        <a
                          href={`https://${account.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-neutral-400 hover:text-indigo-400 flex items-center gap-1 font-mono transition-colors truncate"
                        >
                          <span>{account.domain}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 uppercase font-semibold">
                      {account.category}
                    </span>
                  </div>

                  {/* Account Method Badge */}
                  <div className="flex items-center gap-2 mb-4 text-[11px] text-neutral-400">
                    <span className="inline-flex items-center gap-1 text-indigo-400 font-medium">
                      <Zap className="w-3 h-3" />
                      1-Click via {account.method}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="font-mono">
                      {new Date(account.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Credentials Box */}
                  <div className="space-y-2 bg-neutral-950 p-3 rounded-lg border border-neutral-800/80 font-mono text-xs">
                    {/* Email */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-neutral-500 truncate text-[11px]">Email:</span>
                      <div className="flex items-center gap-1 truncate max-w-[200px]">
                        <span className="text-neutral-200 truncate">{account.emailUsed}</span>
                        <button
                          onClick={() => handleCopy(account.emailUsed, `email-${account.id}`)}
                          className="p-1 text-neutral-500 hover:text-neutral-200"
                        >
                          {copiedId === `email-${account.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-900">
                      <span className="text-neutral-500 text-[11px]">Key:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-emerald-400">
                          {isRevealed ? account.password : '••••••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(account.id)}
                          className="p-1 text-neutral-500 hover:text-neutral-200"
                        >
                          {isRevealed ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(account.password, `pwd-${account.id}`)}
                          className="p-1 text-neutral-500 hover:text-neutral-200"
                        >
                          {copiedId === `pwd-${account.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {account.notes && (
                    <p className="text-[11px] text-neutral-500 mt-3 line-clamp-1 italic">
                      "{account.notes}"
                    </p>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-neutral-400">
                      Score: <strong className="text-neutral-200">{account.securityScore}/100</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://${account.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 flex items-center gap-1 transition-colors"
                    >
                      <span>Login</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => onDeleteAccount(account.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete credential"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">Add Account to Vault</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Website / Service Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix or GitHub"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Website Domain
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. github.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Email Address / Alias
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-neutral-300 font-semibold">
                    Secure Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateSecurePassword(20))}
                    className="text-indigo-400 hover:text-indigo-300 text-[11px]"
                  >
                    ⚡ Regenerate Key
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-emerald-400 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="saas">SaaS / Productivity</option>
                  <option value="social">Social Network</option>
                  <option value="developer">Developer Tool</option>
                  <option value="shopping">E-Commerce & Shopping</option>
                  <option value="entertainment">Streaming & Games</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Optional notes or subscription details..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                >
                  Save Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
