import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Project } from '../types';

interface ProjectsPageProps {
  navigate: (path: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ navigate }) => {
  const { projects } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDemoProject, setSelectedDemoProject] = useState<Project | null>(null);

  const publishedProjects = projects.filter(p => p.status === 'published');

  const categories = [
    { id: 'all', label: 'All Showcases' },
    { id: 'AI Applications', label: 'AI Applications' },
    { id: 'Cloud & Telemetry', label: 'Cloud & Telemetry' },
    { id: 'Distributed Systems', label: 'Distributed Systems' },
    { id: 'Web Systems', label: 'Web Systems' }
  ];

  const filteredProjects = publishedProjects.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.technologies?.some(t => t.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="public-projects w-full bg-[#080d1b] min-h-screen text-[#dee2f6]">
      {/* Hero Header */}
      <div className="relative w-full overflow-hidden bg-[#090e1c] py-16 border-b border-[#434655]/20">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#658aff]/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col gap-4">
          <p className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">SELECTED WORK / NAVIORAA</p>

          <h1 className="font-['Geist'] text-[40px] sm:text-[50px] font-bold text-[#dee2f6] tracking-tight">
            Useful ideas,<br />made tangible.
          </h1>

          <p className="text-[17px] text-[#a6b1c5] max-w-2xl leading-relaxed">
            Digital projects shaped by practical thinking, thoughtful engineering and the people who use them.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#10182b] p-4 rounded-xl border border-[#434655]/20 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-[#252a39] text-[#65e8ff] border border-[#65e8ff]/40 shadow-sm'
                    : 'text-[#a6b1c5] hover:text-[#dee2f6] hover:bg-[#161b2a]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a6b1c5] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects, stack..."
              className="w-full bg-[#090e1c] text-[#dee2f6] pl-10 pr-4 py-2 rounded-lg text-[14px] border border-[#252a39] focus:outline-none focus:border-[#65e8ff]"
            />
          </div>
        </div>
      </div>

      {/* Projects Showcase Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="project-editorial-list">
          {filteredProjects.map((proj, index) => (
            <div
              key={proj.id}
              className={`project-editorial-entry group ${index % 2 ? 'is-offset' : ''}`}
            >
              <div className="project-editorial-image">
                <img
                  src={proj.imageUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-500"
                  loading="lazy"
                  onError={event => { event.currentTarget.style.display = 'none'; }}
                />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>

              <div className="project-editorial-copy">
                <div>
                  <p className="project-category">{proj.category}</p>
                  <h2>{proj.title}</h2>
                  <p className="project-description">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {proj.technologies?.map(tech => (
                      <span
                        key={tech}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="project-editorial-actions">
                  <button
                    onClick={() => setSelectedDemoProject(proj)}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#65e8ff] hover:text-[#b5c4ff] transition-colors cursor-pointer"
                  >
                    <span>Project details</span>
                    <span aria-hidden="true">↗</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {proj.sourceUrl && (
                      <a
                        href={proj.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="GitHub Repository"
                      >
                        Source ↗
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedDemoProject(proj)}
                    >
                      <span>View project</span>
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Live Demo Modal */}
      {selectedDemoProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090e1c]/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-xl bg-[#10182b] border border-[#65e8ff]/30 p-8 shadow-2xl flex flex-col gap-4">
            <button
              onClick={() => setSelectedDemoProject(null)}
              className="absolute top-4 right-4 text-[#a6b1c5] hover:text-[#dee2f6] p-1 rounded"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#65e8ff] animate-pulse" />
              <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-bold">
                Project preview
              </span>
            </div>

            <h3 className="font-['Geist'] text-[24px] text-[#dee2f6] font-bold">
              {selectedDemoProject.title}
            </h3>

            <div className="bg-[#090e1c] rounded-lg p-4 border border-[#252a39] text-[14px] text-[#a6b1c5] leading-relaxed">
              {selectedDemoProject.description}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedDemoProject.technologies?.map(technology => (
                <span key={technology} className="px-2 py-1 border border-[#252a39] text-[11px] text-[#a6b1c5]">{technology}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-wrap items-center gap-4">
                {selectedDemoProject.demoUrl && <a href={selectedDemoProject.demoUrl} target="_blank" rel="noreferrer" className="text-[13px] text-[#65e8ff]">Open project ↗</a>}
                {selectedDemoProject.sourceUrl && <a href={selectedDemoProject.sourceUrl} target="_blank" rel="noreferrer" className="text-[13px] text-[#65e8ff]">Source ↗</a>}
              </div>
              <button onClick={() => setSelectedDemoProject(null)} className="px-5 py-2 rounded-lg bg-[#252a39] text-[#dee2f6] hover:bg-[#343949] text-[13px] font-semibold cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
