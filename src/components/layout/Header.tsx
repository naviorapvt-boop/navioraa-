import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { user, isAdmin, logout } = useAuth();
  const { siteSettings } = useData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Training', path: '/courses' },
    { label: 'Projects', path: '/projects' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact', path: '/contact' }
  ];

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 24);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('keydown', closeOnEscape);
    updateScrollState();
    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  const handleNavClick = (path: string) => {
    setMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
        <div className="site-header-inner">
          <button className="wordmark" onClick={() => handleNavClick('/')} aria-label="Navioraa home">
            <span>{siteSettings.siteName || 'Navioraa'}</span><sup>®</sup>
          </button>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navLinks.map(link => (
              <button key={link.path} className={currentPath === link.path ? 'active' : ''} onClick={() => handleNavClick(link.path)}>
                {link.label}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            {user && isAdmin && <button className="admin-shortcut" onClick={() => handleNavClick('/admin')}>Admin</button>}
            {user && isAdmin && <button className="admin-signout" onClick={() => logout()} aria-label="Sign out of admin" title="Sign out">↗</button>}
            {!user && <button className="admin-shortcut" onClick={() => handleNavClick('/login')}>Admin</button>}
            <button className="header-cta" onClick={() => handleNavClick('/contact')}>Start a project <span aria-hidden="true">↗</span></button>
            <button className="menu-toggle" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <p className="section-index">NAVIGATE / NAVIORAA</p>
          <nav aria-label="Mobile navigation">
            {navLinks.map((link, index) => (
              <button key={link.path} onClick={() => handleNavClick(link.path)} tabIndex={menuOpen ? 0 : -1}>
                <span>{String(index + 1).padStart(2, '0')}</span>{link.label}<i aria-hidden="true">↗</i>
              </button>
            ))}
          </nav>
          <div className="mobile-menu-footer">
            <a tabIndex={menuOpen ? 0 : -1} href={`mailto:${siteSettings.contactEmail || 'naviora.pvt@gmail.com'}`}>{siteSettings.contactEmail || 'naviora.pvt@gmail.com'}</a>
            <span>Technology · Training · Digital innovation</span>
          </div>
        </div>
      </div>
    </>
  );
};
