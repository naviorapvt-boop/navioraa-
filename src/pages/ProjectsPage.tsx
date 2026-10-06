import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface ProjectsPageProps {
  navigate: (path: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ navigate }) => {
  const { projects } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDemoProject, setSelectedDemoProject] = useState<string | null>(null);

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
    <div className="w-full bg-[#080d1b] min-h-screen text-[#dee2f6]">
      {/* Hero Header */}
      <div className="relative w-full overflow-hidden bg-[#090e1c] py-16 border-b border-[#434655]/20">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#658aff]/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#252a39] border border-[#65e8ff]/30">
            <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
            <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">
              Live Verified Workloads
            </span>
          </div>

          <h1 className="font-['Geist'] text-[40px] sm:text-[50px] font-bold text-[#dee2f6] tracking-tight">
            Flagship Engineering Systems &{' '}
            <span className="bg-gradient-to-r from-[#658aff] via-[#2ad9f2] to-[#65e8ff] bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>

          <p className="text-[17px] text-[#a6b1c5] max-w-2xl leading-relaxed">
            Real production architectures engineered by Navioraa architects and senior cohort fellows. Tested against simulated network partitions, heavy concurrency, and multi-tenant telemetry.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              className="rounded-xl bg-[#10182b] border border-[#434655]/20 hover:border-[#65e8ff]/40 overflow-hidden shadow-lg flex flex-col justify-between group transition-all"
            >
              <div className="relative h-64 w-full bg-[#161b2a] overflow-hidden">
                <img
                  src={proj.imageUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10182b] via-[#10182b]/40 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#090e1c]/80 backdrop-blur-md border border-[#434655]/30">
                  <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
                  <span className="font-mono text-[11px] text-[#65e8ff] uppercase font-bold">
                    {proj.badge || proj.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-['Geist'] text-[24px] text-[#dee2f6] font-bold mb-3 group-hover:text-[#65e8ff] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-[14px] text-[#a6b1c5] mb-6 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {proj.technologies?.map(tech => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded bg-[#161b2a] border border-[#252a39] text-[#65e8ff] font-mono text-[12px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#252a39]">
                  <button
                    onClick={() => setSelectedDemoProject(proj.title)}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#65e8ff] hover:text-[#b5c4ff] transition-colors cursor-pointer"
                  >
                    <span>Architecture Telemetry</span>
                    <span className="material-symbols-outlined text-[18px]">account_tree</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {proj.sourceUrl && (
                      <a
                        href={proj.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-[#252a39] text-[#dee2f6] hover:text-[#65e8ff] transition-colors"
                        title="GitHub Repository"
                      >
                        <span className="material-symbols-outlined text-[18px]">code</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedDemoProject(proj.title)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#252a39] hover:bg-[#343949] text-[#dee2f6] text-[13px] font-semibold transition-colors cursor-pointer border border-[#434655]/30"
                    >
                      <span>Simulate Demo</span>
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
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
                Live Deployment Simulation
              </span>
            </div>

            <h3 className="font-['Geist'] text-[24px] text-[#dee2f6] font-bold">
              {selectedDemoProject}
            </h3>

            <div className="bg-[#090e1c] rounded-lg p-4 border border-[#252a39] font-mono text-[12px] text-[#a6b1c5] space-y-2">
              <div className="text-[#65e8ff]">$ curl -X GET https://cluster-us-east.navioraa.internal/health</div>
              <div className="text-[#dee2f6]">{'{"status": "UP", "uptime": "99.98%", "nodes": 16, "latency_ms": 3.4}'}</div>
              <div className="text-[#65e8ff]">$ kubectl get pods -n production</div>
              <div className="text-[#dee2f6]">
                navioraa-engine-01-prod &nbsp;&nbsp;&nbsp;&nbsp; 1/1 &nbsp;&nbsp; Running &nbsp;&nbsp; 0 &nbsp;&nbsp; 42d<br />
                navioraa-engine-02-prod &nbsp;&nbsp;&nbsp;&nbsp; 1/1 &nbsp;&nbsp; Running &nbsp;&nbsp; 0 &nbsp;&nbsp; 42d<br />
                navioraa-engine-03-prod &nbsp;&nbsp;&nbsp;&nbsp; 1/1 &nbsp;&nbsp; Running &nbsp;&nbsp; 0 &nbsp;&nbsp; 42d
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[13px] text-[#a6b1c5]">
                Production node replication in US-EAST-1 and EU-CENTRAL-1.
              </span>
              <button
                onClick={() => setSelectedDemoProject(null)}
                className="px-5 py-2 rounded-lg bg-[#252a39] text-[#dee2f6] hover:bg-[#343949] text-[13px] font-semibold cursor-pointer"
              >
                Close Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
