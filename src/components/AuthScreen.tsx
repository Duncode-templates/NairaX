import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Moon,
  Sun,
  User,
  X,
} from 'lucide-react';
import { TikTokBrandIcon, XBrandIcon } from './PlatformIcons';
import { TopGreenGradient } from './TopGreenGradient';

export type AuthMode = 'login' | 'register' | 'forgot';

export interface AuthUserPayload {
  fullName: string;
  email: string;
  phone: string;
  handle: string;
  referralCode?: string;
}

interface StoredAccount {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  handle: string;
  referralCode: string;
}

const ACCOUNTS_STORAGE_KEY = 'nairax_accounts_v1';

function readStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredAccount(account: StoredAccount) {
  try {
    const existing = readStoredAccounts().filter(
      (item) => item.email.toLowerCase() !== account.email.toLowerCase()
    );
    localStorage.setItem(
      ACCOUNTS_STORAGE_KEY,
      JSON.stringify([account, ...existing])
    );
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

function buildHandle(fullName: string): string {
  const slug = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 14);
  return `@${slug || 'member'}.nx`;
}

function buildReferralCode(fullName: string): string {
  const letters = fullName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 5);
  return `NX${letters || 'USER'}8`;
}

function FacebookMonoIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8.2h2.75l.41-3.2H13.5V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14c-.29-.04-1.3-.14-2.48-.14-2.45 0-4.13 1.5-4.13 4.25v2.35H7.4v3.2h2.78V21h3.32z" />
    </svg>
  );
}

function GoogleColorIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.72-.06-1.41-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.37z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.42l-3.23-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A9.99 9.99 0 0 0 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.92A5.99 5.99 0 0 1 6.1 12c0-.67.12-1.31.31-1.92V7.5H3.07A9.99 9.99 0 0 0 2 12c0 1.61.39 3.14 1.07 4.5l3.34-2.58z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.95 2.97 14.7 2 12 2A9.99 9.99 0 0 0 3.07 7.5l3.34 2.58c.79-2.36 2.99-4.12 5.59-4.12z"
      />
    </svg>
  );
}

interface AuthScreenProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notice?: string;
  onDismissNotice?: () => void;
  onAuthSuccess: (user: AuthUserPayload, mode: 'login' | 'register') => void;
}

export function AuthScreen({
  darkMode,
  onToggleDarkMode,
  notice,
  onDismissNotice,
  onAuthSuccess,
}: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Registration form state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Inline validation & legal modal
  const [errorMsg, setErrorMsg] = useState('');
  const [legalSheet, setLegalSheet] = useState<null | 'terms' | 'privacy'>(null);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setErrorMsg('');
    setForgotSent(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (loginPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const storedAccounts = readStoredAccounts();
    const matched = storedAccounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail.toLowerCase()
    );

    if (matched) {
      if (matched.password !== loginPassword) {
        setErrorMsg('Incorrect password for this account. Please try again.');
        return;
      }
      setErrorMsg('');
      onAuthSuccess(
        {
          fullName: matched.fullName,
          email: matched.email,
          phone: matched.phone,
          handle: matched.handle,
          referralCode: matched.referralCode,
        },
        'login'
      );
      return;
    }

    const derivedName = cleanEmail
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    setErrorMsg('');
    onAuthSuccess(
      {
        fullName: derivedName || 'Elena Vance',
        email: cleanEmail,
        phone: '+234 803 412 8890',
        handle: buildHandle(derivedName || 'Elena Vance'),
        referralCode: buildReferralCode(derivedName || 'Elena Vance'),
      },
      'login'
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanEmail = regEmail.trim();

    if (cleanName.length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const newAccount: StoredAccount = {
      fullName: cleanName,
      email: cleanEmail,
      phone: '+234 803 412 8890',
      password: regPassword,
      handle: buildHandle(cleanName),
      referralCode: buildReferralCode(cleanName),
    };

    saveStoredAccount(newAccount);
    setErrorMsg('');
    onAuthSuccess(
      {
        fullName: newAccount.fullName,
        email: newAccount.email,
        phone: newAccount.phone,
        handle: newAccount.handle,
        referralCode: newAccount.referralCode,
      },
      'register'
    );
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = forgotEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setForgotSent(true);
  };

  const handleQuickAuth = (providerName: string) => {
    setErrorMsg('');
    onAuthSuccess(
      {
        fullName: 'Elena Vance',
        email: `${providerName.toLowerCase()}@nairax.app`,
        phone: '+234 803 412 8890',
        handle: '@elena.nx',
        referralCode: 'NXELENA8',
      },
      'login'
    );
  };

  return (
    <div className="min-h-screen relative overflow-x-clip flex flex-col justify-between text-slate-900 dark:text-slate-100 bg-[#F7FCF9] dark:bg-slate-950">
      <TopGreenGradient />

      {/* Top Bar: Circular Back Button & Theme Toggle */}
      <header className="relative z-10 w-full max-w-md mx-auto px-5 pt-5 pb-2 flex items-center justify-between">
        {mode !== 'login' ? (
          <button
            type="button"
            onClick={() => switchMode('login')}
            aria-label="Back to Log In"
            className="w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.06)] flex items-center justify-center text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-[18px] h-[18px]" aria-hidden="true" />
          </button>
        ) : (
          <div className="h-10 flex items-center">
            <span className="font-logo text-lg tracking-[-0.03em] text-slate-900 dark:text-white leading-none select-none">
              <span className="font-semibold">Naira</span>
              <span className="font-extrabold text-[#1D956E]">X</span>
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-10 h-10 rounded-full bg-white/95 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.06)] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {darkMode ? (
            <Sun className="w-[17px] h-[17px]" aria-hidden="true" />
          ) : (
            <Moon className="w-[17px] h-[17px]" aria-hidden="true" />
          )}
        </button>
      </header>

      {/* Main Centered Form Content */}
      <main className="relative z-10 flex-1 w-full max-w-md mx-auto px-6 pt-4 pb-6 flex flex-col justify-center">
        {notice && (
          <div className="mb-5 px-4 py-2.5 rounded-full bg-white/85 dark:bg-slate-900/85 border border-[#1D956E]/30 text-[#1D956E] dark:text-[#34C194] text-xs font-semibold flex items-center justify-between gap-2 shadow-sm">
            <span className="truncate">{notice}</span>
            {onDismissNotice && (
              <button
                type="button"
                onClick={onDismissNotice}
                aria-label="Dismiss notice"
                className="p-0.5 hover:opacity-75 cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {mode === 'login' && (
            <motion.div
              key="view-login"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="text-center space-y-2 mb-7">
                <h1 className="text-[1.75rem] font-display font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                  Welcome Back
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[290px] mx-auto">
                  Sign in with your email to access your NairaX wallet, tasks, and instant payouts.
                </p>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="mb-4 px-4 py-2.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs font-medium text-rose-600 dark:text-rose-400 text-center"
                >
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div className="flex items-center gap-3 h-[52px] px-4 rounded-full bg-white/95 dark:bg-slate-900/90 border border-slate-200/75 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] focus-within:border-[#2EE068] dark:focus-within:border-[#2EE068] transition-colors">
                  <Mail
                    className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400 shrink-0"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    aria-label="Email Address"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Email Address"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 h-[52px] px-4 rounded-full bg-white/95 dark:bg-slate-900/90 border border-slate-200/75 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] focus-within:border-[#2EE068] dark:focus-within:border-[#2EE068] transition-colors">
                  <Lock
                    className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400 shrink-0"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    aria-label="Password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Password"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer shrink-0 p-1"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" aria-hidden="true" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="flex justify-end pr-1 pt-0.5">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-xs font-medium text-rose-500 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    Forgot Password
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-[52px] rounded-full bg-[#2EE068] hover:bg-[#25CE5C] text-slate-950 text-sm font-semibold shadow-[0_10px_24px_rgba(46,224,104,0.28)] active:scale-[0.985] transition-all cursor-pointer"
                  >
                    Log In
                  </button>
                </div>
              </form>

              <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-semibold text-slate-900 dark:text-slate-100 hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </p>

              {/* Divider + 4 Circular Auth Options */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200/80 dark:bg-slate-800" />
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  or
                </span>
                <div className="flex-1 h-px bg-slate-200/80 dark:bg-slate-800" />
              </div>

              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleQuickAuth('google')}
                  aria-label="Continue with Google"
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.06)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <GoogleColorIcon className="w-[19px] h-[19px]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAuth('facebook')}
                  aria-label="Continue with Facebook"
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.06)] flex items-center justify-center text-[#1877F2] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <FacebookMonoIcon className="w-[19px] h-[19px]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAuth('tiktok')}
                  aria-label="Continue with TikTok"
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.06)] flex items-center justify-center text-slate-900 dark:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <TikTokBrandIcon className="w-[19px] h-[19px]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAuth('x')}
                  aria-label="Continue with X"
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.06)] flex items-center justify-center text-slate-900 dark:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <XBrandIcon className="w-[16px] h-[16px]" />
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'register' && (
            <motion.div
              key="view-register"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="text-center space-y-2 mb-7">
                <h1 className="text-[1.75rem] font-display font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                  Create Account
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[290px] mx-auto">
                  Sign up with your email to save tasks, manage your wallet, and withdraw payouts anytime.
                </p>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="mb-4 px-4 py-2.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs font-medium text-rose-600 dark:text-rose-400 text-center"
                >
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="flex items-center gap-3 h-[52px] px-4 rounded-full bg-white/95 dark:bg-slate-900/90 border border-slate-200/75 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] focus-within:border-[#2EE068] dark:focus-within:border-[#2EE068] transition-colors">
                  <User
                    className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400 shrink-0"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="reg-fullname"
                    type="text"
                    autoComplete="name"
                    maxLength={30}
                    aria-label="Full Name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Full Name"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 h-[52px] px-4 rounded-full bg-white/95 dark:bg-slate-900/90 border border-slate-200/75 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] focus-within:border-[#2EE068] dark:focus-within:border-[#2EE068] transition-colors">
                  <Mail
                    className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400 shrink-0"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    aria-label="Email Address"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Email Address"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 h-[52px] px-4 rounded-full bg-white/95 dark:bg-slate-900/90 border border-slate-200/75 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] focus-within:border-[#2EE068] dark:focus-within:border-[#2EE068] transition-colors">
                  <Lock
                    className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400 shrink-0"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    aria-label="Password"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Password"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((v) => !v)}
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer shrink-0 p-1"
                  >
                    {showRegPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" aria-hidden="true" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-[52px] rounded-full bg-[#2EE068] hover:bg-[#25CE5C] text-slate-950 text-sm font-semibold shadow-[0_10px_24px_rgba(46,224,104,0.28)] active:scale-[0.985] transition-all cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              </form>

              <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-slate-900 dark:text-slate-100 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>

              {/* Divider + 4 Circular Auth Options */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200/80 dark:bg-slate-800" />
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  or
                </span>
                <div className="flex-1 h-px bg-slate-200/80 dark:bg-slate-800" />
              </div>

              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleQuickAuth('google')}
                  aria-label="Sign up with Google"
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.06)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <GoogleColorIcon className="w-[19px] h-[19px]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAuth('facebook')}
                  aria-label="Sign up with Facebook"
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.06)] flex items-center justify-center text-[#1877F2] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <FacebookMonoIcon className="w-[19px] h-[19px]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAuth('tiktok')}
                  aria-label="Sign up with TikTok"
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.06)] flex items-center justify-center text-slate-900 dark:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <TikTokBrandIcon className="w-[19px] h-[19px]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAuth('x')}
                  aria-label="Sign up with X"
                  className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/75 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.06)] flex items-center justify-center text-slate-900 dark:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <XBrandIcon className="w-[16px] h-[16px]" />
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'forgot' && (
            <motion.div
              key="view-forgot"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="text-center space-y-2 mb-7">
                <h1 className="text-[1.75rem] font-display font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                  Reset Password
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[290px] mx-auto">
                  Enter the email address linked to your NairaX account and we&apos;ll send a reset code.
                </p>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="mb-4 px-4 py-2.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs font-medium text-rose-600 dark:text-rose-400 text-center"
                >
                  {errorMsg}
                </div>
              )}

              {forgotSent ? (
                <div className="space-y-4 text-center">
                  <div className="px-5 py-4 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-[#2EE068]/40 text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                    Reset instructions have been sent to{' '}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {forgotEmail}
                    </span>
                    .
                  </div>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="w-full h-[52px] rounded-full bg-[#2EE068] hover:bg-[#25CE5C] text-slate-950 text-sm font-semibold shadow-[0_10px_24px_rgba(46,224,104,0.28)] active:scale-[0.985] transition-all cursor-pointer"
                  >
                    Back to Log In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                  <div className="flex items-center gap-3 h-[52px] px-4 rounded-full bg-white/95 dark:bg-slate-900/90 border border-slate-200/75 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] focus-within:border-[#2EE068] dark:focus-within:border-[#2EE068] transition-colors">
                    <Mail
                      className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      aria-label="Email Address"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="Email Address"
                      className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-[52px] rounded-full bg-[#2EE068] hover:bg-[#25CE5C] text-slate-950 text-sm font-semibold shadow-[0_10px_24px_rgba(46,224,104,0.28)] active:scale-[0.985] transition-all cursor-pointer"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Legal Footer (cleared above floating production pill) */}
      <footer className="relative z-10 w-full max-w-md mx-auto px-6 pb-20 pt-2 text-center">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          By continuing to use NairaX, you agree to our{' '}
          <br />
          <button
            type="button"
            onClick={() => setLegalSheet('terms')}
            className="font-semibold text-slate-800 dark:text-slate-200 hover:underline cursor-pointer"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={() => setLegalSheet('privacy')}
            className="font-semibold text-slate-800 dark:text-slate-200 hover:underline cursor-pointer"
          >
            Privacy Policy
          </button>
        </p>
      </footer>

      {/* Terms / Privacy Bottom Sheet */}
      {legalSheet && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[1px] flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={legalSheet === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
          onClick={() => setLegalSheet(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 pb-7 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-semibold text-slate-900 dark:text-slate-100">
                {legalSheet === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </h2>
              <button
                type="button"
                onClick={() => setLegalSheet(null)}
                aria-label="Close"
                className="min-h-[40px] min-w-[40px] -mr-2 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {legalSheet === 'terms'
                ? 'All tasks posted and completed on NairaX must provide authentic engagement and valid verification proof. Fraudulent submissions are rejected automatically.'
                : 'NairaX encrypts your account credentials, payout bank details, and verification records. Your personal data is never sold to third parties.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
