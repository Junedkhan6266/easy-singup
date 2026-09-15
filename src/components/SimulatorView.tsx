import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Shield, 
  Globe, 
  Lock, 
  SlidersHorizontal,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { 
  SimulatedSite, 
  IdentityProfile, 
  RegisteredAccount, 
  AutomationStep 
} from '../types';
import { PRESET_SITES } from '../data/presetSites';
import { resolveFieldValues, calculatePasswordScore } from '../services/credentialGenerator';

interface SimulatorViewProps {
  activeProfile: IdentityProfile;
  onAccountCreated: (account: RegisteredAccount) => void;
  onNavigateToVault: () => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  activeProfile,
  onAccountCreated,
  onNavigateToVault,
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(PRESET_SITES[0].id);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customDomain, setCustomDomain] = useState<string>('mycustomportal.app/register');
  const [customSiteName, setCustomSiteName] = useState<string>('My Custom App');
  
  // Active site data
  const currentSite = PRESET_SITES.find((s) => s.id === selectedSiteId) || PRESET_SITES[0];

  // Live input values in the simulated form
  const [formValues, setFormValues] = useState<Record<string, string | boolean>>({});
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

  // Automation state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [steps, setSteps] = useState<AutomationStep[]>([
    { id: 1, label: 'DOM Scanner', description: 'Detecting form inputs & ToS triggers', status: 'pending' },
    { id: 2, label: 'Identity Alias', description: 'Generating privacy email alias', status: 'pending' },
    { id: 3, label: 'Security Core', description: 'Synthesizing 20-char high-entropy password', status: 'pending' },
    { id: 4, label: 'Form Injection', description: 'Dispatching synthetic input & change events', status: 'pending' },
    { id: 5, label: 'Consent Engine', description: 'Auto-accepting required ToS & privacy policy', status: 'pending' },
    { id: 6, label: '1-Click Submit', description: 'Executing submission & saving to Vault', status: 'pending' },
  ]);

  // Completion state
  const [completedAccount, setCompletedAccount] = useState<RegisteredAccount | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(380);

  // Reset form when site changes
  useEffect(() => {
    resetForm();
  }, [selectedSiteId, isCustomMode]);

  const resetForm = () => {
    setFormValues({});
    setTermsAgreed(false);
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setCompletedAccount(null);
    setShowSuccessModal(false);
    setSteps([
      { id: 1, label: 'DOM Scanner', description: 'Detecting form inputs & ToS triggers', status: 'pending' },
      { id: 2, label: 'Identity Alias', description: 'Generating privacy email alias', status: 'pending' },
      { id: 3, label: 'Security Core', description: 'Synthesizing 20-char high-entropy password', status: 'pending' },
      { id: 4, label: 'Form Injection', description: 'Dispatching synthetic input & change events', status: 'pending' },
      { id: 5, label: 'Consent Engine', description: 'Auto-accepting required ToS & privacy policy', status: 'pending' },
      { id: 6, label: '1-Click Submit', description: 'Executing submission & saving to Vault', status: 'pending' },
    ]);
  };

  // The 1-Click Signup Engine trigger
  const triggerOneClickSignup = () => {
    if (isRunning) return;

    setIsRunning(true);
    setCurrentStepIndex(0);
    const startTime = performance.now();

    const targetDomain = isCustomMode ? customDomain : currentSite.domain;
    const targetSiteName = isCustomMode ? customSiteName : currentSite.name;
    const fieldsToFill = isCustomMode
      ? [
          { id: 'cust_name', label: 'Full Name', name: 'name', type: 'text' as const, placeholder: '', required: true, value: '', detectedType: 'fullname' as const },
          { id: 'cust_email', label: 'Email', name: 'email', type: 'email' as const, placeholder: '', required: true, value: '', detectedType: 'email' as const },
          { id: 'cust_pwd', label: 'Password', name: 'pwd', type: 'password' as const, placeholder: '', required: true, value: '', detectedType: 'password' as const },
        ]
      : currentSite.fields;

    const { values, generatedPassword, generatedEmail, generatedUsername } = resolveFieldValues(
      fieldsToFill,
      activeProfile,
      targetDomain
    );

    // Step 1: DOM Inspection (0 - 150ms)
    setSteps((prev) =>
      prev.map((s, idx) => (idx === 0 ? { ...s, status: 'running' } : s))
    );

    setTimeout(() => {
      // Step 1 completed, Step 2 running (Alias)
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === 0 ? { ...s, status: 'completed' } : idx === 1 ? { ...s, status: 'running', description: `Generated: ${generatedEmail}` } : s
        )
      );
      setCurrentStepIndex(1);

      setTimeout(() => {
        // Step 2 completed, Step 3 running (Password)
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === 1 ? { ...s, status: 'completed' } : idx === 2 ? { ...s, status: 'running', description: `Key: ${generatedPassword.slice(0, 5)}••••••••` } : s
          )
        );
        setCurrentStepIndex(2);

        setTimeout(() => {
          // Step 3 completed, Step 4 running (Injection)
          setSteps((prev) =>
            prev.map((s, idx) =>
              idx === 2 ? { ...s, status: 'completed' } : idx === 3 ? { ...s, status: 'running' } : s
            )
          );
          setCurrentStepIndex(3);
          setFormValues(values);

          setTimeout(() => {
            // Step 4 completed, Step 5 running (ToS Consent)
            setSteps((prev) =>
              prev.map((s, idx) =>
                idx === 3 ? { ...s, status: 'completed' } : idx === 4 ? { ...s, status: 'running' } : s
              )
            );
            setCurrentStepIndex(4);
            setTermsAgreed(true);

            setTimeout(() => {
              // Step 5 completed, Step 6 running (Submit)
              setSteps((prev) =>
                prev.map((s, idx) =>
                  idx === 4 ? { ...s, status: 'completed' } : idx === 5 ? { ...s, status: 'running' } : s
                )
              );
              setCurrentStepIndex(5);

              setTimeout(() => {
                // Complete!
                const elapsed = Math.round(performance.now() - startTime);
                setExecutionTimeMs(elapsed);

                setSteps((prev) =>
                  prev.map((s) => ({ ...s, status: 'completed' }))
                );
                setIsRunning(false);

                const newAccount: RegisteredAccount = {
                  id: 'vault-' + Date.now(),
                  siteName: targetSiteName,
                  domain: targetDomain.replace(/\/.*$/, ''),
                  category: isCustomMode ? 'other' : currentSite.category,
                  emailUsed: generatedEmail,
                  username: generatedUsername,
                  password: generatedPassword,
                  createdAt: new Date().toISOString(),
                  lastLoginAt: new Date().toISOString(),
                  status: 'active',
                  securityScore: calculatePasswordScore(generatedPassword),
                  method: 'simulator',
                  notes: `One-Click signup with persona "${activeProfile.name}".`,
                };

                setCompletedAccount(newAccount);
                onAccountCreated(newAccount);
                setShowSuccessModal(true);
              }, 250);
            }, 200);
          }, 250);
        }, 200);
      }, 180);
    }, 150);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with 1-Click Launchpad */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/70 via-neutral-900 to-purple-950/70 border border-indigo-500/30 p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Universal DOM Heuristic Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              One-Click Signup Engine
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Test how OneTap instantly scans form inputs, creates private subaddressed email aliases, generates 20-char high-entropy keys, and submits registration in under a second.
            </p>
          </div>

          {/* Master 1-Click Trigger Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={triggerOneClickSignup}
              disabled={isRunning}
              className={`relative group overflow-hidden px-7 py-4 rounded-xl font-bold text-base shadow-2xl flex items-center justify-center gap-3 transition-all ${
                isRunning
                  ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed border border-neutral-700'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/40 hover:shadow-indigo-500/60 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
                  <span>Robotic Injector Running...</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Zap className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="tracking-wide">⚡ 1-Click Sign Up Now</span>
                </>
              )}
            </button>

            <button
              onClick={resetForm}
              disabled={isRunning}
              title="Reset Simulated Form"
              className="px-3.5 py-4 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick config strip */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Injecting as:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 font-medium text-neutral-200">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeProfile.color }} />
              {activeProfile.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Password: <strong className="text-neutral-200">{activeProfile.passwordLength} chars (Entropy 112+ bits)</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Alias: <strong className="text-neutral-200">@{activeProfile.aliasDomain}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Target Site Selector & Browser Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Browser Mockup & Form */}
        <div className="lg:col-span-8 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">
          {/* Browser Window Header */}
          <div className="bg-neutral-950 border-b border-neutral-800 p-3 sm:px-4 flex items-center justify-between gap-3">
            {/* Window dots */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Address bar */}
            <div className="flex-1 max-w-xl mx-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-neutral-500">https://</span>
                <span className="truncate text-white">
                  {isCustomMode ? customDomain : currentSite.domain}
                </span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  Target Form
                </span>
              </div>
            </div>

            {/* Site switcher pills */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsCustomMode(!isCustomMode)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  isCustomMode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Custom Sandbox
              </button>
            </div>
          </div>

          {/* Preset Site Tabs */}
          {!isCustomMode && (
            <div className="bg-neutral-950/60 border-b border-neutral-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
                Target Presets:
              </span>
              {PRESET_SITES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedSiteId === site.id
                      ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${site.logoColor}`}
                  />
                  <span>{site.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Simulated Web Page Content */}
          <div className="p-6 sm:p-10 bg-neutral-900/60">
            {isCustomMode ? (
              /* Custom Form Setup */
              <div className="max-w-md mx-auto space-y-5">
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-white">Custom Form Playground</h2>
                  <p className="text-xs text-neutral-400">
                    Test the 1-Click injector against any custom website parameters
                  </p>
                </div>
                <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      App / Website Name
                    </label>
                    <input
                      type="text"
                      value={customSiteName}
                      onChange={(e) => setCustomSiteName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Target Domain URL
                    </label>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      readOnly
                      placeholder="e.g. Alex Morgan"
                      value={(formValues['cust_name'] as string) || ''}
                      className={`w-full px-3.5 py-2 rounded-xl bg-neutral-950 border text-sm transition-all ${
                        formValues['cust_name']
                          ? 'border-indigo-500 text-white bg-indigo-950/20 ring-2 ring-indigo-500/20'
                          : 'border-neutral-800 text-neutral-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      readOnly
                      placeholder="user@domain.com"
                      value={(formValues['cust_email'] as string) || ''}
                      className={`w-full px-3.5 py-2 rounded-xl bg-neutral-950 border text-sm transition-all ${
                        formValues['cust_email']
                          ? 'border-indigo-500 text-white bg-indigo-950/20 ring-2 ring-indigo-500/20'
                          : 'border-neutral-800 text-neutral-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Account Password
                    </label>
                    <input
                      type="password"
                      readOnly
                      placeholder="••••••••••••"
                      value={(formValues['cust_pwd'] as string) || ''}
                      className={`w-full px-3.5 py-2 rounded-xl bg-neutral-950 border text-sm transition-all ${
                        formValues['cust_pwd']
                          ? 'border-indigo-500 text-white bg-indigo-950/20 ring-2 ring-indigo-500/20'
                          : 'border-neutral-800 text-neutral-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Preset Site Mock Web Page */
              <div className="max-w-md mx-auto space-y-6">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                  <div
                    className={`inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentSite.logoColor} p-0.5 shadow-lg mx-auto items-center justify-center`}
                  >
                    <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                      <span className="text-lg font-black text-white">
                        {currentSite.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {currentSite.name}
                  </h2>
                  <p className="text-xs text-neutral-400">{currentSite.tagline}</p>
                </div>

                {/* The Target Registration Form Fields */}
                <div className="space-y-4 bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800/90 shadow-xl">
                  {currentSite.fields.map((field) => {
                    const isFilled = Boolean(formValues[field.id]);
                    const val = (formValues[field.id] as string) || '';

                    return (
                      <div key={field.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-neutral-300">
                            {field.label}
                          </label>
                          {isFilled && (
                            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Autofilled
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type={field.type}
                            readOnly
                            placeholder={field.placeholder}
                            value={val}
                            className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border text-sm transition-all focus:outline-none ${
                              isFilled
                                ? 'border-indigo-500 text-white bg-indigo-950/20 ring-2 ring-indigo-500/20'
                                : 'border-neutral-800 text-neutral-400 placeholder-neutral-600'
                            }`}
                          />
                          {isFilled && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <span className="text-xs text-indigo-400 font-bold">⚡</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Terms of Service Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-neutral-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                      />
                      <span>{currentSite.termsText}</span>
                    </label>
                  </div>

                  {/* Simulated Submit Button */}
                  <div className="pt-3">
                    <button
                      type="button"
                      disabled={isRunning}
                      className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        termsAgreed && Object.keys(formValues).length > 0
                          ? 'bg-gradient-to-r ' + currentSite.logoColor + ' text-white shadow-lg shadow-indigo-500/20'
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700/50'
                      }`}
                    >
                      {currentSite.submitButtonText}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Automation Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Execution Telemetry</h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {isRunning ? (
                  <span className="text-amber-400 animate-pulse font-semibold">Active</span>
                ) : (
                  <span>Ready</span>
                )}
              </span>
            </div>

            {/* Stepper Pipeline */}
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isStepRunning = step.status === 'running';
                const isStepDone = step.status === 'completed';

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isStepRunning
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                        : isStepDone
                        ? 'bg-neutral-950/60 border-neutral-800/80'
                        : 'bg-neutral-950/30 border-neutral-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                          isStepDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isStepRunning
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {isStepDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-200">
                            {step.label}
                          </span>
                          {isStepRunning && (
                            <span className="text-[10px] text-indigo-400 font-mono font-medium animate-pulse">
                              Processing...
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Box */}
            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2">
              <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Average 1-Click Latency:</span>
                <strong className="text-white font-mono">0.38 seconds</strong>
              </div>
              <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Password Entropy:</span>
                <strong className="text-emerald-400 font-mono">112+ bits (Military)</strong>
              </div>
              <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                <span>ToS Auto-Accept:</span>
                <strong className="text-indigo-400 font-mono">Enabled</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal / Account Created Celebration */}
      {showSuccessModal && completedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-indigo-500/40 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-2 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Account Created in 1-Click!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                Successfully registered on <strong className="text-white">{completedAccount.siteName}</strong> in{' '}
                <span className="text-indigo-400 font-mono font-semibold">{executionTimeMs}ms</span>.
              </p>
            </div>

            {/* Credential Details Card */}
            <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800 relative z-10">
              {/* Site Domain */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-850">
                <span className="text-neutral-400">Target Website:</span>
                <span className="font-mono text-white font-medium">{completedAccount.domain}</span>
              </div>

              {/* Email Alias */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Generated Privacy Email Alias
                </span>
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <span className="text-xs font-mono text-indigo-300 truncate">
                    {completedAccount.emailUsed}
                  </span>
                  <button
                    onClick={() => copyToClipboard(completedAccount.emailUsed, 'email')}
                    className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  >
                    {copiedKey === 'email' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Secure Password */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Cryptographic Password
                </span>
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <span className="text-xs font-mono text-emerald-300 truncate">
                    {showPassword ? completedAccount.password : '••••••••••••••••••••'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(completedAccount.password, 'pwd')}
                      className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    >
                      {copiedKey === 'pwd' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Score Badge */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-neutral-400">Entropy Security Score:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                  {completedAccount.securityScore}/100 Grade A+
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigateToVault();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>View in Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  resetForm();
                }}
                className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
