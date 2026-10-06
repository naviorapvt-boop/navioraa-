import React from 'react';
import { useData } from '../context/DataContext';

interface TeamPageProps {
  navigate: (path: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ navigate }) => {
  const { teamMembers } = useData();
  const publishedTeam = teamMembers.filter(m => m.status === 'published');

  return (
    <div className="w-full bg-[#080d1b] min-h-screen text-[#dee2f6]">
      {/* Header */}
      <div className="relative w-full overflow-hidden bg-[#090e1c] py-16 border-b border-[#434655]/20">
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#65e8ff]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#252a39] border border-[#65e8ff]/30">
            <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
            <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">
              Leadership & Faculty
            </span>
          </div>

          <h1 className="font-['Geist'] text-[40px] sm:text-[50px] font-bold text-[#dee2f6] tracking-tight">
            Meet the Engineers Behind{' '}
            <span className="bg-gradient-to-r from-[#658aff] via-[#2ad9f2] to-[#65e8ff] bg-clip-text text-transparent">
              Navioraa
            </span>
          </h1>

          <p className="text-[17px] text-[#a6b1c5] max-w-2xl leading-relaxed">
            Our leads bring years of production battle-testing from hyperscale distributed platforms, top technology ventures, and modern AI labs.
          </p>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedTeam.map(member => (
            <div
              key={member.id}
              className="rounded-xl bg-[#10182b] border border-[#434655]/20 hover:border-[#65e8ff]/40 shadow-lg overflow-hidden flex flex-col justify-between group transition-all"
            >
              <div className="relative h-64 w-full bg-[#161b2a] overflow-hidden">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10182b] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#65e8ff] bg-[#090e1c]/80 px-2.5 py-1 rounded backdrop-blur-md border border-[#252a39]">
                    {member.role}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#65e8ff]" />
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-['Geist'] text-[22px] text-[#dee2f6] font-bold mb-2">
                    {member.name}
                  </h3>
                  <p className="text-[14px] text-[#a6b1c5] leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {member.skills?.map(skill => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded bg-[#161b2a] border border-[#252a39] font-mono text-[11px] text-[#dee2f6]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#252a39] flex items-center justify-between">
                  <a
                    href={member.linkedinUrl || 'https://linkedin.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#65e8ff] hover:text-[#b5c4ff] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>LinkedIn Profile</span>
                  </a>

                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-[#252a39] text-[#dee2f6] hover:text-[#65e8ff] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">code</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
