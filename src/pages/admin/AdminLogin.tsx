import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  navigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate }) => {
  const {
    isAdmin,
    loginWithGoogle,
    loginWithPassword,
    authError,
    clearAuthError
  } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'owner' | 'team'>('owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // If already logged in as admin, redirect to /admin
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

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

  const handleTeamLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAuthError();
    setIsSubmitting(true);
    try {
      await loginWithPassword(email, password);
      navigate('/admin');
    } catch {
      // Auth context provides a safe, user-facing error.
    } finally {
      setIsSubmitting(false);
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
            Navioraa Admin
          </h2>
          <p className="text-[13px] text-[#a6b1c5] font-mono mt-1">
            Owner and team access
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="p-3.5 rounded-lg bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] text-[13px] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock_clock</span>
            <span>{authError}</span>
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-[#090e1c] p-1">
          <button
            type="button"
            onClick={() => { setLoginMethod('owner'); clearAuthError(); }}
            className={`py-2 rounded-md text-[12px] font-semibold transition-colors ${loginMethod === 'owner' ? 'bg-[#252a39] text-[#dee2f6]' : 'text-[#a6b1c5]'}`}
          >
            Owner Google
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('team'); clearAuthError(); }}
            className={`py-2 rounded-md text-[12px] font-semibold transition-colors ${loginMethod === 'team' ? 'bg-[#252a39] text-[#dee2f6]' : 'text-[#a6b1c5]'}`}
          >
            Team account
          </button>
        </div>

        {loginMethod === 'owner' ? (
          <>
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-[#161b2a] hover:bg-[#252a39] border border-[#434655]/40 text-[#dee2f6] text-[14px] font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-50"
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
              <span>{isSubmitting ? 'Checking access...' : 'Continue with Google'}</span>
            </button>
            <p className="mt-4 text-center text-[12px] text-[#a6b1c5]">
              Continue with <strong className="text-[#dee2f6]">naviora.pvt@gmail.com</strong> only.
            </p>
          </>
        ) : (
          <form onSubmit={handleTeamLogin} className="space-y-3">
            <label className="block text-[12px] text-[#a6b1c5]">
              Username / email
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#434655]/40 bg-[#090e1c] px-3 py-2.5 text-[14px] text-[#dee2f6] outline-none focus:border-[#65e8ff]"
                placeholder="team.member@example.com"
              />
            </label>
            <label className="block text-[12px] text-[#a6b1c5]">
              Password
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#434655]/40 bg-[#090e1c] px-3 py-2.5 text-[14px] text-[#dee2f6] outline-none focus:border-[#65e8ff]"
                placeholder="Your assigned password"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#65e8ff] px-4 py-3 text-[14px] font-semibold text-[#090e1c] transition-colors hover:bg-[#9af0ff] disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in to admin panel'}
            </button>
            <p className="text-center text-[11px] text-[#a6b1c5]">Team access is created by the primary admin.</p>
          </form>
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
