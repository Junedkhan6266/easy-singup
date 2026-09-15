import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Fingerprint, 
  Layers, 
  ArrowRight,
  Terminal,
  Smartphone,
  Globe
} from 'lucide-react';
import { IdentityProfile } from '../types';

interface DeveloperSdkViewProps {
  activeProfile: IdentityProfile;
}

export const DeveloperSdkView: React.FC<DeveloperSdkViewProps> = ({ activeProfile }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'react' | 'ios' | 'passkey'>('html');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [demoTriggered, setDemoTriggered] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestSdkButton = () => {
    setDemoTriggered(true);
    setDemoSuccess(false);
    setTimeout(() => {
      setDemoSuccess(true);
      setTimeout(() => {
        setDemoTriggered(false);
        setDemoSuccess(false);
      }, 3000);
    }, 600);
  };

  const htmlSnippet = `<!-- 1. Include OneTap Universal Script in your <head> -->
<script src="https://cdn.onetap.id/v1/auth.min.js" async></script>

<!-- 2. Place the 1-Click Sign Up Button anywhere in your registration flow -->
<div 
  class="onetap-signup-button" 
  data-client-id="app_live_847190274"
  data-theme="dark"
  data-text="Sign up in 1-Click"
  data-callback="handleOneTapRegistration">
</div>

<script>
  function handleOneTapRegistration(credential) {
    console.log("One-Click User:", credential.email, credential.userId);
    // Send to your backend /api/auth/onetap
  }
</script>`;

  const reactSnippet = `import React from 'react';
import { OneTapSignUp, useOneTapAuth } from '@onetap/react';

export function RegistrationPage() {
  const handleSuccess = async (user) => {
    const res = await fetch('/api/auth/callback', {
      method: 'POST',
      body: JSON.stringify({ token: user.authToken, email: user.email }),
    });
    window.location.href = '/dashboard';
  };

  return (
    <div className="signup-container">
      <h2>Welcome to Our Platform</h2>
      
      {/* Universal 1-Click Component */}
      <OneTapSignUp 
        clientId="app_live_847190274"
        theme="dark"
        autoPrompt={true}
        onSuccess={handleSuccess}
      />
    </div>
  );
}`;

  const passkeySnippet = `// 1-Click WebAuthn / Passkey Registration
async function registerWithPasskey(userEmail) {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: new Uint8Array([/* server random bytes */]),
      rp: { name: "My Web App", id: window.location.hostname },
      user: {
        id: new TextEncoder().encode(userEmail),
        name: userEmail,
        displayName: userEmail.split('@')[0],
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      authenticatorSelection: { userVerification: "preferred" },
      timeout: 60000,
    }
  });

  // Zero-password instant registration
  await sendAssertionToServer(credential);
}`;

  const mobileSnippet = `// Swift iOS / Android Universal Link SDK Integration
import OneTapSDK

class SignUpViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let oneTapBtn = OneTapButton(clientId: "app_mobile_8471")
        oneTapBtn.onSuccess = { credentials in
            print("1-Click Signed Up:", credentials.email)
            self.proceedToHome()
        }
        view.addSubview(oneTapBtn)
    }
}`;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Code2 className="w-3.5 h-3.5" />
            Developer SDK & OpenID Provider
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Add 1-Click Sign Up To Your Own App
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Eliminate registration friction for your users. Drop in the OneTap SDK to let users register and sign in with a single click, using biometric passkeys, WebAuthn, or cryptographic tokens.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Interactive Live Component Demo */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Live SDK Button Preview
              </span>
              <h3 className="text-base font-bold text-white">
                How users see the embedded button
              </h3>
            </div>

            {/* Embedded Live Button Demo */}
            <div className="p-8 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-4">
              <p className="text-xs text-neutral-400">
                Click below to test the embedded client-side SDK event:
              </p>

              <button
                onClick={handleTestSdkButton}
                disabled={demoTriggered}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {demoTriggered ? (
                  demoSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Authorized with OneTap!</span>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Authenticating Biometrics...</span>
                    </>
                  )
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>⚡ Sign up with OneTap in 1-Click</span>
                  </>
                )}
              </button>

              {demoSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 animate-in fade-in space-y-1">
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>OneTap Token Verified</span>
                  </div>
                  <div className="font-mono text-[11px] text-neutral-400">
                    ID: user_{activeProfile.primaryEmail.split('@')[0]} (1-Click OK)
                  </div>
                </div>
              )}
            </div>

            {/* SDK Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Biometric Passkey Support</h4>
                  <p className="text-xs text-neutral-400">
                    Works natively with Touch ID, Face ID, and Windows Hello without requiring passwords.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Built-in Bot & Sybil Defense</h4>
                  <p className="text-xs text-neutral-400">
                    Hardware cryptographic attestation filters out automated spam registrations automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Code Snippets */}
        <div className="lg:col-span-7 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
          {/* Tabs */}
          <div className="bg-neutral-950 border-b border-neutral-800 px-4 pt-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCodeTab('html')}
              className={`px-3 py-2 rounded-t-lg text-xs font-semibold border-b-2 transition-colors ${
                activeCodeTab === 'html'
                  ? 'border-indigo-500 text-white bg-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              HTML & Vanilla JS
            </button>
            <button
              onClick={() => setActiveCodeTab('react')}
              className={`px-3 py-2 rounded-t-lg text-xs font-semibold border-b-2 transition-colors ${
                activeCodeTab === 'react'
                  ? 'border-indigo-500 text-white bg-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              React / Next.js
            </button>
            <button
              onClick={() => setActiveCodeTab('passkey')}
              className={`px-3 py-2 rounded-t-lg text-xs font-semibold border-b-2 transition-colors ${
                activeCodeTab === 'passkey'
                  ? 'border-indigo-500 text-white bg-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              WebAuthn / Passkeys
            </button>
            <button
              onClick={() => setActiveCodeTab('ios')}
              className={`px-3 py-2 rounded-t-lg text-xs font-semibold border-b-2 transition-colors ${
                activeCodeTab === 'ios'
                  ? 'border-indigo-500 text-white bg-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              iOS & Android
            </button>

            <button
              onClick={() => {
                const code =
                  activeCodeTab === 'html'
                    ? htmlSnippet
                    : activeCodeTab === 'react'
                    ? reactSnippet
                    : activeCodeTab === 'passkey'
                    ? passkeySnippet
                    : mobileSnippet;
                copyToClipboard(code, 'sdk_code');
              }}
              className="ml-auto text-xs text-neutral-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 transition-colors shrink-0"
            >
              {copiedKey === 'sdk_code' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Snippet Display */}
          <div className="p-4 sm:p-6 bg-neutral-950">
            <pre className="text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto max-h-[460px]">
              {activeCodeTab === 'html' && htmlSnippet}
              {activeCodeTab === 'react' && reactSnippet}
              {activeCodeTab === 'passkey' && passkeySnippet}
              {activeCodeTab === 'ios' && mobileSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
