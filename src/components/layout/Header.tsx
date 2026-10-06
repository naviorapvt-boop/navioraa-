import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { user, isAdmin, logout } = useAuth();
  const { siteSettings } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Courses', path: '/courses' },
    { label: 'Projects', path: '/projects' },
    { label: 'Resources', path: '/resources' },
    { label: 'Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e1321]/85 backdrop-blur-xl border-b border-[#434655]/20 shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#252a39] flex items-center justify-center relative overflow-hidden border border-[#65e8ff]/30 shadow-[0_0_12px_rgba(101,232,255,0.2)]">
              <div className="w-3.5 h-3.5 rounded-full bg-[#65e8ff] shadow-[0_0_12px_rgba(101,232,255,0.9)] animate-pulse" />
              <div className="absolute inset-0 bg-[#658aff]/20 blur-sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Geist'] text-[20px] leading-[24px] tracking-tight font-bold text-[#dee2f6] group-hover:text-[#65e8ff] transition-colors">
                {siteSettings.siteName || 'NAVIORAA'}
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] tracking-widest text-[#a6b1c5] uppercase">
                {siteSettings.tagline || 'Learn · Build · Grow'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3 py-1.5 rounded-lg text-[14px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#252a39] text-[#65e8ff] shadow-sm font-semibold'
                      : 'text-[#c3c5d7] hover:text-[#dee2f6] hover:bg-[#1a1f2e]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Admin Portal Button */}
          {isAdmin ? (
            <button
              onClick={() => handleNavClick('/admin')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-mono transition-all cursor-pointer border ${
                currentPath.startsWith('/admin')
                  ? 'bg-[#252a39] text-[#65e8ff] border-[#65e8ff]/40 shadow-[0_0_10px_rgba(101,232,255,0.2)]'
                  : 'text-[#c3c5d7] hover:text-[#65e8ff] hover:bg-[#1a1f2e] border-[#434655]/40'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] text-[#65e8ff]">terminal</span>
              <span>Ops Console</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#65e8ff] animate-ping ml-1" />
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('/login')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-mono text-[#c3c5d7] hover:text-[#65e8ff] hover:bg-[#1a1f2e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">lock</span>
              <span>Admin Portal</span>
            </button>
          )}

          {/* Explore Courses CTA */}
          <button
            onClick={() => handleNavClick('/courses')}
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#00cee7] text-[#090e1c] text-[13px] sm:text-[14px] font-semibold tracking-wide shadow-[0_0_16px_rgba(41,217,242,0.35)] hover:shadow-[0_0_24px_rgba(41,217,242,0.6)] hover:brightness-105 transition-all cursor-pointer active:scale-95"
          >
            <span>Explore Courses</span>
            <span className="material-symbols-outlined text-[16px] font-bold">arrow_forward</span>
          </button>

          {/* User Profile / Login status pill */}
          {user ? (
            <div className="relative group">
              <button
                onClick={() => handleNavClick('/admin')}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#658aff] to-[#65e8ff] p-[1.5px] cursor-pointer flex items-center justify-center shadow-sm"
                title={`${user.email} (${isAdmin ? 'Admin' : 'User'})`}
              >
                <div className="w-full h-full rounded-full bg-[#161b2a] flex items-center justify-center text-[#65e8ff] font-bold text-xs">
                  {user.email ? user.email.substring(0, 2).toUpperCase() : 'AD'}
                </div>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-[#161b2a] border border-[#434655]/40 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <div className="px-3 py-1 border-b border-[#252a39] mb-1">
                  <p className="text-[11px] text-[#a6b1c5] truncate">{user.email}</p>
                  <p className="text-[10px] text-[#65e8ff] font-mono uppercase">{isAdmin ? 'Super Admin' : 'Authenticated'}</p>
                </div>
                <button
                  onClick={() => handleNavClick('/admin')}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#dee2f6] hover:bg-[#252a39] flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">dashboard</span>
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#ffb4ab] hover:bg-[#93000a]/20 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('/login')}
              className="w-8 h-8 rounded-full bg-[#1a1f2e] border border-[#434655]/30 flex items-center justify-center text-[#b5c4ff] hover:text-[#65e8ff] hover:border-[#65e8ff]/50 transition-colors cursor-pointer"
              title="Admin Login"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-[#1a1f2e] text-[#dee2f6] hover:text-[#65e8ff] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#090e1c]/95 border-b border-[#434655]/30 backdrop-blur-2xl px-6 py-5 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPath === link.path
                  ? 'bg-[#252a39] text-[#65e8ff] font-bold'
                  : 'text-[#c3c5d7] hover:text-[#dee2f6] hover:bg-[#161b2a]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#252a39] flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[#65e8ff] font-mono flex items-center gap-2 bg-[#161b2a] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span>Operations OS / Admin</span>
            </button>
            <button
              onClick={() => handleNavClick('/courses')}
              className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#00cee7] text-[#090e1c] font-bold text-sm shadow-md cursor-pointer"
            >
              Explore Courses
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
