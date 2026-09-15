import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  MousePointerClick, 
  ArrowRight,
  Terminal,
  Zap,
  Globe,
  Smartphone,
  Laptop
} from 'lucide-react';
import { IdentityProfile } from '../types';
import { generateBookmarkletCode, generateUserScriptCode } from '../services/bookmarkletGenerator';

interface BookmarkletViewProps {
  activeProfile: IdentityProfile;
}

export const BookmarkletView: React.FC<BookmarkletViewProps> = ({ activeProfile }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookmarklet' | 'userscript' | 'mobile'>('bookmarklet');

  const bookmarkletCode = generateBookmarkletCode(activeProfile);
  const userScriptCode = generateUserScriptCode(activeProfile);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-neutral-900 via-indigo-950/40 to-neutral-900 border border-indigo-500/20 p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            Universal Browser Integration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Use 1-Click Signup On ANY Website
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Drag the bookmarklet below into your browser’s bookmarks bar. Whenever you are on any registration or signup page on the internet, simply click the bookmarklet to auto-fill unique credentials, accept terms, and sign up in 1 click.
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setActiveTab('bookmarklet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'bookmarklet'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Desktop Bookmarklet (Drag & Drop)</span>
        </button>

        <button
          onClick={() => setActiveTab('userscript')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'userscript'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Userscript (Tampermonkey)</span>
        </button>

        <button
          onClick={() => setActiveTab('mobile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'mobile'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Mobile Browsers (iOS & Android)</span>
        </button>
      </div>

      {/* Tab 1: Bookmarklet (The primary zero-install solution) */}
      {activeTab === 'bookmarklet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Draggable Button Spotlight */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6 text-center shadow-xl">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Drag this button to your bookmarks bar
                </span>
                <p className="text-xs text-neutral-500">
                  (Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">Cmd+Shift+B</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">Ctrl+Shift+B</kbd> to show your bookmarks bar)
                </p>
              </div>

              {/* THE DRAGGABLE BOOKMARKLET BUTTON */}
              <div className="py-4">
                <a
                  href={bookmarkletCode}
                  onClick={(e) => {
                    // Prevent accidental navigation if clicked directly in demo
                    e.preventDefault();
                    alert("To use on other websites: Drag this button into your browser's Bookmarks Bar! When you are on any signup page (like GitHub, Reddit, etc.), click it in your bookmarks to sign up in 1 click.");
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-grab active:cursor-grabbing border border-indigo-400/40"
                  title="Drag me to your Bookmarks bar!"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>⚡ OneTap 1-Click SignUp</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                <MousePointerClick className="w-4 h-4 text-indigo-400" />
                <span>Works on Chrome, Safari, Firefox, Edge, Brave, Opera</span>
              </div>

              {/* Or Copy Code button */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-center gap-3">
                <button
                  onClick={() => copyToClipboard(bookmarkletCode, 'code')}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  {copiedType === 'code' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied Bookmarklet Code!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Bookmarklet JavaScript</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* What Happens When You Click */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                How It Works on Any Real Site
              </h3>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">1.</span>
                  <span><strong>Form Discovery:</strong> Automatically locates email, username, password, confirm password, and phone inputs using semantic HTML heuristics.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">2.</span>
                  <span><strong>Privacy Masking:</strong> Generates a custom alias email (<code className="text-indigo-300 font-mono text-[11px]">{activeProfile.primaryEmail.split('@')[0]}+site@...</code>) so your real email is never exposed to spam.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">3.</span>
                  <span><strong>Military Password:</strong> Generates an isolated {activeProfile.passwordLength}-character high-entropy password for that specific site.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">4.</span>
                  <span><strong>Event Synthesis:</strong> Dispatches native React/Vue/Angular synthetic value events so modern Single-Page Applications capture the values correctly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">5.</span>
                  <span><strong>Consent & Submit:</strong> Ticks the "I agree to Terms & Conditions" box and clicks the Create Account button!</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Step-by-Step Instructions */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
              3-Step Quick Setup Guide
            </h3>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Show Your Bookmarks Bar</h4>
                <p className="text-xs text-neutral-400">
                  In Chrome, Edge, or Brave, press <kbd className="px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300 font-mono">Cmd+Shift+B</kbd> (Mac) or <kbd className="px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300 font-mono">Ctrl+Shift+B</kbd> (Windows). In Safari, choose View → Show Favorites Bar.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Drag the Purple Button Up</h4>
                <p className="text-xs text-neutral-400">
                  Click and hold the purple <strong className="text-white">⚡ OneTap 1-Click SignUp</strong> button and drag it directly onto your bookmarks bar.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Click It on Any Signup Page!</h4>
                <p className="text-xs text-neutral-400">
                  Go to any site's registration page (e.g., Reddit, Spotify, Notion, store), click the bookmarklet, and watch it register your account instantly.
                </p>
              </div>
            </div>

            {/* Code preview snippet */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono text-[11px]">bookmarklet.js (Self-Contained)</span>
                <span className="text-emerald-400 font-mono text-[10px]">Zero Dependencies</span>
              </div>
              <pre className="p-3 rounded-lg bg-neutral-900 text-[10px] font-mono text-neutral-300 overflow-x-auto max-h-36 no-scrollbar">
                {bookmarkletCode.slice(0, 300)}...
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Userscript / Extension */}
      {activeTab === 'userscript' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Tampermonkey / Violentmonkey Userscript</h3>
                <p className="text-xs text-neutral-400">
                  Automatically adds a floating "⚡ 1-Click Sign Up" button to every registration page you visit on the web.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(userScriptCode, 'userscript')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedType === 'userscript' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Userscript</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto max-h-72">
              {userScriptCode}
            </pre>

            <div className="text-xs text-neutral-400 space-y-1.5 pt-2">
              <p><strong>Installation steps:</strong></p>
              <ol className="list-decimal pl-4 space-y-1 text-neutral-300">
                <li>Install the free <strong>Tampermonkey</strong> or <strong>Violentmonkey</strong> extension from the Chrome Web Store, Firefox Add-ons, or Safari Extension store.</li>
                <li>Click the extension icon → "Create a new script".</li>
                <li>Paste the script above and press Save (<kbd className="px-1 py-0.5 rounded bg-neutral-800 text-white">Cmd+S</kbd>).</li>
                <li>Whenever you visit any website with <code className="text-indigo-400 font-mono">/signup</code> or <code className="text-indigo-400 font-mono">/register</code>, a 1-click button will automatically appear!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Mobile Guide */}
      {activeTab === 'mobile' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              1-Click Signup on Mobile Safari & Mobile Chrome
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              You can also use 1-click sign-up on iPhone, iPad, and Android phones using standard mobile browser bookmarklets:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <h4 className="text-xs font-bold text-white">iOS Safari Setup</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  1. Bookmark any webpage on your iPhone. Name it <strong className="text-white">⚡ OneTap</strong>.<br />
                  2. Copy the Bookmarklet code by clicking the button below.<br />
                  3. Edit the bookmark in Safari, delete the URL, and paste the code.<br />
                  4. On any website signup page on your phone, type "OneTap" into the Safari search bar and tap the bookmark!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <h4 className="text-xs font-bold text-white">Android Chrome Setup</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  1. Bookmark this page in Chrome on Android and name it <strong className="text-white">⚡ OneTap</strong>.<br />
                  2. Edit the bookmark and replace the URL with the copied Bookmarklet code.<br />
                  3. When on any signup page in Chrome, type "OneTap" in the address bar and tap the bookmark to execute 1-click signup!
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => copyToClipboard(bookmarkletCode, 'mobile_code')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {copiedType === 'mobile_code' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied Bookmarklet Code!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Bookmarklet Code for Mobile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
