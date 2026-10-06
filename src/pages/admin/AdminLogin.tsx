import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  navigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate }) => {
  const {
    user,
    isAdmin,
    loginWithGoogle,
    loginWithEmail,
    demoAdminLogin,
    resetPassword,
    authError,
    clearAuthError
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // If already logged in as admin, redirect to /admin
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setIsSubmitting(true);
    try {
      await loginWithEmail(email, password);
      navigate('/admin');
    } catch {
      // Handled in auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearAuthError();
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch {
      // Handled in auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAdmin = async () => {
    clearAuthError();
    setIsSubmitting(true);
    try {
      await demoAdminLogin();
      navigate('/admin');
    } catch {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#080d1b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background photon glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#658aff]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#65e8ff]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#10182b] border border-[#434655]/40 rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#252a39] flex items-center justify-center border border-[#65e8ff]/40 shadow-[0_0_16px_rgba(101,232,255,0.3)] mb-4">
            <span className="material-symbols-outlined text-[#65e8ff] text-[28px]">terminal</span>
          </div>
          <h2 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6]">
            Navioraa Operations OS
          </h2>
          <p className="text-[13px] text-[#a6b1c5] font-mono mt-1">
            SECURE ACCESS :: NODE CLUSTER #01
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="p-3.5 rounded-lg bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] text-[13px] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock_clock</span>
            <span>{authError}</span>
          </div>
        )}

        {resetSent ? (
          <div className="p-6 rounded-xl bg-[#161b2a] border border-[#65e8ff]/30 text-center flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[#65e8ff] text-[36px]">mark_email_read</span>
            <h4 className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold">Reset Link Transmitted</h4>
            <p className="text-[13px] text-[#a6b1c5]">
              Check your inbox for password reset instructions.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setShowForgot(false);
              }}
              className="mt-2 text-xs font-mono text-[#65e8ff] hover:underline"
            >
              Return to Login
            </button>
          </div>
        ) : showForgot ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Admin Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex.mercer@navioraa.internal"
                className="w-full px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] cursor-pointer"
            >
              Send Password Reset
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="text-xs text-[#a6b1c5] hover:text-[#dee2f6] font-mono cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Quick One-Click Super Admin Access for AI Studio */}
            <div className="mb-6 p-4 rounded-xl bg-[#161b2a] border border-[#65e8ff]/30 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-[#65e8ff] uppercase font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-ping" />
                  Instant Super Admin
                </span>
                <span className="text-[10px] font-mono text-[#a6b1c5]">Pre-Authenticated Session</span>
              </div>
              <p className="text-[12px] text-[#a6b1c5] mb-3 leading-relaxed">
                Log into Navioraa Operations OS directly as Super Admin (Alex Mercer / naviora.pvt@gmail.com) with full Firestore write privileges.
              </p>
              <button
                onClick={handleDemoAdmin}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-[0_0_14px_rgba(101,232,255,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Enter Operations OS Console</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-[#252a39]" />
              <span className="flex-shrink mx-4 font-mono text-[11px] text-[#8d90a0] uppercase">
                Or Authenticate Via
              </span>
              <div className="flex-grow border-t border-[#252a39]" />
            </div>

            {/* Google Authentication Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full mb-4 py-2.5 px-4 rounded-lg bg-[#161b2a] hover:bg-[#252a39] border border-[#434655]/40 text-[#dee2f6] text-[13px] font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Standard Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex.mercer@navioraa.internal"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] font-mono text-[#65e8ff] hover:underline"
                  >
                    Forgot Key?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a6b1c5] hover:text-[#dee2f6]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg bg-[#252a39] hover:bg-[#343949] text-[#dee2f6] font-semibold text-[13px] transition-colors cursor-pointer border border-[#434655]/40"
              >
                {isSubmitting ? 'Verifying Credentials...' : 'Authenticate'}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 pt-4 border-t border-[#252a39] text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-mono text-[#a6b1c5] hover:text-[#65e8ff] flex items-center justify-center gap-1.5 mx-auto"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
