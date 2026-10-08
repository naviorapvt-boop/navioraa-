import React from 'react';
import { useData } from '../../context/DataContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { siteSettings } = useData();
  const links = [
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Training', path: '/courses' },
    { label: 'Projects', path: '/projects' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <footer className="site-footer">
      <div className="editorial-wrap">
        <div className="footer-main">
          <div className="footer-intro">
            <p className="section-index">LET'S MAKE SOMETHING MATTER</p>
            <p>Technology, training and digital projects built for what’s next.</p>
            <a className="footer-email" href={`mailto:${siteSettings.contactEmail || 'naviora.pvt@gmail.com'}`}>
              {siteSettings.contactEmail || 'naviora.pvt@gmail.com'} <span>↗</span>
            </a>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            {links.map(link => <button key={link.path} onClick={() => navigate(link.path)}>{link.label}<span>↗</span></button>)}
          </nav>
          <div className="footer-socials">
            <a href={siteSettings.linkedinUrl || 'https://linkedin.com'} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={siteSettings.githubUrl || 'https://github.com'} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={siteSettings.twitterUrl || 'https://x.com'} target="_blank" rel="noreferrer">X ↗</a>
            <a href={`https://wa.me/${siteSettings.whatsappNumber?.replace(/[^0-9]/g, '') || '919890187383'}`} target="_blank" rel="noreferrer">WhatsApp ↗</a>
            <button onClick={() => navigate('/login')}>Admin ↗</button>
          </div>
        </div>
        <div className="footer-wordmark" aria-label="Navioraa">{siteSettings.siteName || 'Navioraa'}<sup>®</sup></div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {siteSettings.siteName || 'Navioraa'}. All rights reserved.</span>
          <div><button onClick={() => navigate('/privacy-policy')}>Privacy</button><button onClick={() => navigate('/terms')}>Terms</button></div>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
};
