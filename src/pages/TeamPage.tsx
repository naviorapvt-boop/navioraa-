import React from 'react';
import { useData } from '../context/DataContext';

interface TeamPageProps {
  navigate: (path: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ navigate }) => {
  const { teamMembers } = useData();
  const publishedTeam = teamMembers.filter(m => m.status === 'published');

  return (
    <div className="public-team w-full bg-[#080d1b] min-h-screen text-[#dee2f6]">
      {/* Header */}
      <div className="relative w-full overflow-hidden bg-[#090e1c] py-16 border-b border-[#434655]/20">
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#65e8ff]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col gap-4">
          <p className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">PEOPLE MAKE THE WORK</p>

          <h1 className="font-['Geist'] text-[40px] sm:text-[50px] font-bold text-[#dee2f6] tracking-tight">
            Meet the people<br />behind Navioraa.
          </h1>

          <p className="text-[17px] text-[#a6b1c5] max-w-2xl leading-relaxed">
            The people behind our teaching, products and practical project work.
          </p>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="team-editorial-list">
          {publishedTeam.map((member, index) => (
            <div
              key={member.id}
              className="team-editorial-entry group"
            >
              <div className="team-editorial-image">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    loading="lazy"
                    onError={event => { event.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span className="team-initials" aria-label={`${member.name} portrait not added`}>
                    {member.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
                  </span>
                )}
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>

              <div className="team-editorial-copy">
                <div>
                  <p className="team-profile-role">{member.role}</p>
                  <h2>
                    {member.name}
                  </h2>
                  <p className="team-profile-bio">
                    {member.bio}
                  </p>

                  <div className="team-profile-skills">
                    {member.skills?.map(skill => <span key={skill}>{skill}</span>)}
                  </div>
                </div>

                <div className="team-profile-links">
                  <a
                    href={member.linkedinUrl || 'https://linkedin.com'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn <span aria-hidden="true">↗</span>
                  </a>

                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub <span aria-hidden="true">↗</span>
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
