import React from 'react';
import { useData } from '../../context/DataContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { siteSettings } = useData();

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#090e1c] text-[#a6b1c5] border-t border-[#434655]/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {/* Brand & Mission column */}
          <div className="col-span-2 flex flex-col justify-between pr-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#252a39] flex items-center justify-center border border-[#65e8ff]/20">
                  <div className="w-3 h-3 rounded-full bg-[#65e8ff] shadow-[0_0_8px_rgba(101,232,255,0.8)]" />
                </div>
                <span className="font-['Geist'] text-[20px] text-[#dee2f6] tracking-tight font-bold">
                  {siteSettings.siteName || 'NAVIORAA'}
                </span>
              </div>
              <p className="text-[14px] text-[#a6b1c5] max-w-sm leading-relaxed">
                Pioneering enterprise cloud architectures, mission-critical IT transformation, and high-velocity engineering academies.
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#161b2a] border border-[#252a39] text-[11px] font-mono text-[#65e8ff] uppercase tracking-wider">
                  Sys Status: Nominal
                </span>
                <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
              </div>
            </div>

            {/* Micro Terminal and Social Icons */}
            <div className="mt-8 flex items-center gap-2">
              <a
                href={siteSettings.githubUrl || 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#161b2a] border border-[#252a39] flex items-center justify-center text-[#a6b1c5] hover:text-[#65e8ff] hover:border-[#65e8ff]/40 transition-colors"
                title="GitHub"
              >
                <span className="material-symbols-outlined text-[18px]">terminal</span>
              </a>
              <a
                href={siteSettings.linkedinUrl || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#161b2a] border border-[#252a39] flex items-center justify-center text-[#a6b1c5] hover:text-[#65e8ff] hover:border-[#65e8ff]/40 transition-colors"
                title="LinkedIn"
              >
                <span className="material-symbols-outlined text-[18px]">hub</span>
              </a>
              <button
                onClick={() => handleNav('/projects')}
                className="w-9 h-9 rounded-lg bg-[#161b2a] border border-[#252a39] flex items-center justify-center text-[#a6b1c5] hover:text-[#65e8ff] hover:border-[#65e8ff]/40 transition-colors cursor-pointer"
                title="Source Code Repos"
              >
                <span className="material-symbols-outlined text-[18px]">code</span>
              </button>
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber?.replace(/[^0-9]/g, '') || '15550199283'}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#161b2a] border border-[#252a39] flex items-center justify-center text-[#a6b1c5] hover:text-[#65e8ff] hover:border-[#65e8ff]/40 transition-colors"
                title="Direct WhatsApp"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </a>
            </div>
          </div>

          {/* Platform column */}
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-semibold text-[#dee2f6] uppercase tracking-wider font-mono">
              Platform
            </span>
            <ul className="flex flex-col gap-2 text-[14px]">
              <li>
                <button onClick={() => handleNav('/projects')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Architecture Suite
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  DevOps Pipelines
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/projects')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Enterprise Cloud
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/resources')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Release Notes
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/admin')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left font-mono text-[13px] text-[#65e8ff]">
                  Console Access →
                </button>
              </li>
            </ul>
          </div>

          {/* Services column */}
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-semibold text-[#dee2f6] uppercase tracking-wider font-mono">
              Services
            </span>
            <ul className="flex flex-col gap-2 text-[14px]">
              <li>
                <button onClick={() => handleNav('/services')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Cloud Migration
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Cyber Security
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  AI & Automation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/services')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Data Platforms
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  IT Consulting
                </button>
              </li>
            </ul>
          </div>

          {/* Training column */}
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-semibold text-[#dee2f6] uppercase tracking-wider font-mono">
              Training
            </span>
            <ul className="flex flex-col gap-2 text-[14px]">
              <li>
                <button onClick={() => handleNav('/courses')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Cloud Engineering
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/courses')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Full-Stack Systems
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/courses')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  SRE Certification
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/courses')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Corporate Cohorts
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/resources')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Learning Paths
                </button>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-semibold text-[#dee2f6] uppercase tracking-wider font-mono">
              Company
            </span>
            <ul className="flex flex-col gap-2 text-[14px]">
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  About Navioraa
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/team')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Leadership
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/resources')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Press & Media
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="hover:text-[#65e8ff] transition-colors cursor-pointer text-left">
                  Contact HQ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#252a39] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8d90a0]">
          <span>
            © 2026 {siteSettings.siteName || 'Navioraa'} Technologies Inc. All rights reserved. Precision Built for Global IT Systems.
          </span>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('/privacy-policy')} className="hover:text-[#65e8ff] transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('/terms')} className="hover:text-[#65e8ff] transition-colors cursor-pointer">
              Terms of Service
            </button>
            <span className="text-[#434655]">•</span>
            <span className="font-mono text-[#65e8ff]">ISO/IEC 27001 Validated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
