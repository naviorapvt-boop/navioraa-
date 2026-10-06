import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { siteSettings, services, courses, projects } = useData();
  const [terminalCheckAlert, setTerminalCheckAlert] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Published filter
  const publishedServices = services.filter(s => s.status === 'published').slice(0, 6);
  const publishedCourses = courses.filter(c => c.status === 'published').slice(0, 6);
  const publishedProjects = projects.filter(p => p.status === 'published').slice(0, 2);

  const techStack = [
    'Python',
    'JavaScript',
    'React 19',
    'Node.js',
    'AI / PyTorch',
    'Cloud & DevOps',
    'PostgreSQL',
    'Docker & K8s',
    'FastAPI'
  ];

  return (
    <div className="flex flex-col w-full bg-[#080d1b]">
      {/* 1. Hero Section with Glows & Interactive Terminal */}
      <section className="relative w-full overflow-hidden bg-[#090e1c] pt-12 pb-24 border-b border-[#434655]/20">
        {/* Photonic radial ambient glows */}
        <div className="absolute top-10 left-1/4 w-[580px] h-[580px] bg-[#658aff]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[480px] h-[480px] bg-[#65e8ff]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Typography & Hero Text */}
            <div className="lg:col-span-6 flex flex-col items-start space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#252a39]/70 backdrop-blur-md border border-[#65e8ff]/30 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#65e8ff] shadow-[0_0_10px_#65e8ff] animate-ping" />
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#65e8ff] uppercase tracking-widest font-semibold">
                  {siteSettings.heroBadge || 'LEARN. BUILD. INNOVATE.'}
                </span>
              </div>

              <h1 className="font-['Geist'] text-[38px] sm:text-[48px] lg:text-[56px] text-[#dee2f6] tracking-tight leading-[1.08] font-bold">
                Turn Your Ideas Into <br />
                <span className="bg-gradient-to-r from-[#658aff] via-[#2ad9f2] to-[#65e8ff] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(41,217,242,0.35)]">
                  Real-World Technology.
                </span>
              </h1>

              <p className="text-[17px] sm:text-[18px] text-[#a6b1c5] max-w-xl leading-relaxed">
                {siteSettings.heroDescription ||
                  'Learn in-demand IT skills, build practical enterprise-grade projects, and explore innovative cloud & AI technology solutions with Navioraa.'}
              </p>

              {/* Action Cluster */}
              <div className="flex flex-wrap items-center gap-4 pt-2 w-full">
                <button
                  onClick={() => navigate('/courses')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-semibold text-[14px] shadow-[0_0_20px_rgba(41,217,242,0.4)] hover:shadow-[0_0_30px_rgba(41,217,242,0.65)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <span>Explore IT Training</span>
                  <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
                </button>

                <button
                  onClick={() => navigate('/projects')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#252a39]/80 hover:bg-[#2f3444] text-[#dee2f6] font-semibold text-[14px] backdrop-blur-md border border-[#434655]/40 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#65e8ff] text-[19px]">code</span>
                  <span>Explore Our Projects</span>
                </button>

                <a
                  href={`https://wa.me/${siteSettings.whatsappNumber?.replace(/[^0-9]/g, '') || '15550199283'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-lg bg-[#252a39]/40 hover:bg-[#252a39] text-[#a6b1c5] hover:text-[#65e8ff] text-[13px] font-mono transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#25d366]">chat</span>
                  <span>Quick WhatsApp Sync</span>
                </a>
              </div>

              {/* Micro Credential Strip */}
              <div className="pt-4 flex items-center gap-3 text-[#a6b1c5]/80 font-['JetBrains_Mono'] text-[12px]">
                <span className="text-[#65e8ff] font-bold">•</span>
                <span>Practical Learning</span>
                <span className="text-[#65e8ff] font-bold">•</span>
                <span>Real-World Projects</span>
                <span className="text-[#65e8ff] font-bold">•</span>
                <span>Future-Ready Skills</span>
              </div>
            </div>

            {/* Right Column: High-Tech Cyber Terminal & Engine Telemetry */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#658aff]/20 to-[#65e8ff]/30 rounded-xl blur-xl opacity-70" />
              <div className="relative rounded-xl bg-[#090e1c]/90 backdrop-blur-xl border border-[#434655]/40 shadow-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="px-5 py-3.5 bg-[#161b2a] flex items-center justify-between border-b border-[#252a39]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ffb4ab]/80" />
                    <span className="w-3 h-3 rounded-full bg-[#00cee7]/80" />
                    <span className="w-3 h-3 rounded-full bg-[#65e8ff]/80" />
                    <span className="ml-3 font-mono text-[12px] text-[#a6b1c5]">
                      navioraa_runtime_v4.py
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#252a39] font-mono text-[11px] text-[#65e8ff]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#65e8ff] animate-pulse" />
                      <span>0ms Latency</span>
                    </span>
                  </div>
                </div>

                {/* Terminal Code Body */}
                <div className="p-6 font-['JetBrains_Mono'] text-[13px] space-y-3 leading-relaxed">
                  <div className="text-[#a6b1c5]/50"># Initializing Navioraa Enterprise Full-Stack Core</div>
                  <div>
                    <span className="text-[#2ad9f2]">from</span> <span className="text-[#dee2f6]">navioraa.ai</span>{' '}
                    <span className="text-[#2ad9f2]">import</span>{' '}
                    <span className="text-[#b5c4ff] font-semibold">AutonomousAgentPool</span>,{' '}
                    <span className="text-[#b5c4ff] font-semibold">CloudCluster</span>
                  </div>
                  <div>
                    <span className="text-[#2ad9f2]">class</span>{' '}
                    <span className="text-[#65e8ff] font-bold">ProductionAccelerator</span>:
                  </div>
                  <div className="pl-4 text-[#a6b1c5]">
                    <span>def __init__(self, tenancy="global_multicloud"):</span>
                  </div>
                  <div className="pl-8 text-[#dee2f6]">
                    <span>self.mesh = CloudCluster(protocol="gRPC", secure=True)</span>
                    <br />
                    <span>self.agent = AutonomousAgentPool(llm="navioraa-ultra-v1")</span>
                  </div>
                  <div className="pl-4 text-[#a6b1c5]">
                    <span>async def execute_pipeline(self, payload: dict):</span>
                  </div>
                  <div className="pl-8 text-[#65e8ff]">
                    <span>return await self.agent.synthesize_and_deploy(payload)</span>
                  </div>

                  {/* Console Log Trace */}
                  <div className="pt-4 border-t border-[#252a39] flex flex-col gap-1 text-[12px]">
                    <div className="text-[#2ad9f2] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>[STATUS]: Production-Ready Runtime Initialized</span>
                    </div>
                    <div className="text-[#b5c4ff] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      <span>[STORE]: Cloud Firestore v2 Active & Replicating (Multi-Region)</span>
                    </div>
                    <div className="text-[#a6b1c5]/70 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">terminal</span>
                      <span>[ENV]: Docker Swarm + Next.js Edge SSR Pipeline Nominal</span>
                    </div>
                  </div>
                </div>

                {/* Terminal Quick Controls */}
                <div className="px-5 py-3 bg-[#161b2a] flex items-center justify-between text-[11px] font-mono text-[#a6b1c5] border-t border-[#252a39]">
                  <span className="flex items-center gap-1.5 text-[#65e8ff]">
                    <span className="w-2 h-2 rounded-full bg-[#65e8ff]" />
                    <span>SYSTEM HEALTH 100%</span>
                  </span>
                  <button
                    onClick={() => setTerminalCheckAlert(!terminalCheckAlert)}
                    className="hover:text-[#65e8ff] flex items-center gap-1 text-[#dee2f6] transition-colors cursor-pointer"
                  >
                    <span>[RE-RUN HEALTH_CHECK]</span>
                    <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Output Toast */}
              {terminalCheckAlert && (
                <div className="absolute -bottom-6 -right-4 bg-[#252a39] border border-[#65e8ff]/40 px-4 py-2.5 rounded-lg shadow-2xl backdrop-blur-xl flex items-center gap-3 z-20 animate-in fade-in">
                  <span className="material-symbols-outlined text-[#65e8ff] text-[18px]">verified</span>
                  <span className="font-mono text-[12px] text-[#dee2f6]">
                    Execution verified: 0 critical vulnerabilities. Real-time Firestore sync active.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Technology Matrix Bar */}
      <section className="w-full bg-[#161b2a] py-6 border-b border-[#252a39]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-[#a6b1c5] font-semibold text-[13px] font-mono tracking-wider whitespace-nowrap">
            <span className="material-symbols-outlined text-[#65e8ff] text-[20px]">layers</span>
            <span>PRODUCTION TECH STACK</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {techStack.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-[12px] transition-all cursor-pointer border ${
                  selectedTech === tech
                    ? 'bg-[#65e8ff] text-[#090e1c] font-bold border-[#65e8ff]'
                    : 'bg-[#1a1f2e] text-[#dee2f6] hover:text-[#65e8ff] hover:bg-[#252a39] border-[#434655]/30'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Engineered IT Services & Solutions Grid */}
      <section className="w-full py-28 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#65e8ff]" />
                <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">
                  Enterprise Capacities
                </span>
              </div>
              <h2 className="font-['Geist'] text-[32px] sm:text-[40px] text-[#dee2f6] font-bold">
                Engineered IT Services & Solutions
              </h2>
            </div>
            <p className="text-[15px] text-[#a6b1c5] max-w-md leading-relaxed">
              Bridging enterprise-grade software architecture, artificial intelligence implementation, and high-velocity skills training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedServices.map((service, index) => (
              <div
                key={service.id}
                className="group relative rounded-xl bg-[#10182b] p-8 border border-[#434655]/20 hover:border-[#65e8ff]/40 shadow-sm hover:shadow-xl hover:bg-[#161b2a] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#252a39] flex items-center justify-center mb-6 group-hover:bg-[#658aff] transition-colors border border-[#434655]/30">
                    <span className="material-symbols-outlined text-[#65e8ff] group-hover:text-[#090e1c] text-[26px]">
                      {index === 0
                        ? 'terminal'
                        : index === 1
                        ? 'web'
                        : index === 2
                        ? 'devices'
                        : index === 3
                        ? 'neurology'
                        : index === 4
                        ? 'hub'
                        : 'school'}
                    </span>
                  </div>
                  <h3 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold mb-3 group-hover:text-[#65e8ff] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[14px] text-[#a6b1c5] mb-6 leading-relaxed">
                    {service.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.technologies?.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded bg-[#1a1f2e] text-[#c3c5d7] font-mono text-[11px] border border-[#252a39]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#65e8ff] hover:text-[#b5c4ff] transition-colors cursor-pointer text-left"
                >
                  <span>View Architecture Scope</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Flagship Production Training Tracks (Courses) */}
      <section className="w-full bg-[#090e1c] py-28 relative border-y border-[#434655]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#65e8ff]" />
                <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">
                  Engineering Academy
                </span>
              </div>
              <h2 className="font-['Geist'] text-[32px] sm:text-[40px] text-[#dee2f6] font-bold">
                Flagship Production Training Tracks
              </h2>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="inline-flex items-center gap-2 font-mono text-[13px] text-[#65e8ff] hover:text-[#b5c4ff] transition-colors cursor-pointer"
            >
              <span>Explore All Tracks →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-xl bg-[#10182b] p-6 border border-[#434655]/20 hover:border-[#65e8ff]/40 shadow-md hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded bg-[#65e8ff]/10 text-[#65e8ff] font-mono text-[11px] uppercase font-bold border border-[#65e8ff]/20">
                      {course.difficulty || 'Advanced'}
                    </span>
                    <span className="font-mono text-[12px] text-[#a6b1c5] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      {course.duration} ({course.hours || '80h'})
                    </span>
                  </div>

                  <h3 className="font-['Geist'] text-[19px] text-[#dee2f6] font-bold mb-2">
                    {course.title}
                  </h3>
                  <p className="text-[13px] text-[#a6b1c5] mb-4 line-clamp-2">
                    {course.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {course.technologies?.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-[#1a1f2e] text-[#c3c5d7] font-mono text-[11px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Curriculum Preview Milestone snippet */}
                  <div className="p-3 rounded-lg bg-[#090e1c] mb-6 text-[#a6b1c5] font-mono text-[11px] space-y-1 border border-[#252a39]">
                    <div className="text-[#65e8ff] font-semibold">Curriculum Milestone:</div>
                    <div>• {course.curriculum?.[0]?.module || 'Core Foundations & Distributed Patterns'}</div>
                    <div>• {course.curriculum?.[1]?.module || 'High-Concurrency Capstone Deployment'}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#252a39]">
                  <span className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold">
                    {course.price || '$980'}{' '}
                    <span className="text-[12px] text-[#a6b1c5] font-normal">/ Cohort</span>
                  </span>
                  <button
                    onClick={() => navigate('/courses')}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Flagship Engineering Systems (Projects Showcase) */}
      <section className="w-full py-28 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#65e8ff]" />
                <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">
                  Proof of Work
                </span>
              </div>
              <h2 className="font-['Geist'] text-[32px] sm:text-[40px] text-[#dee2f6] font-bold">
                Flagship Engineering Systems
              </h2>
            </div>
            <p className="text-[15px] text-[#a6b1c5] max-w-md">
              Production software engineered by Navioraa architects and senior students, powering live workloads at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {publishedProjects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-xl bg-[#10182b] overflow-hidden border border-[#434655]/20 shadow-lg flex flex-col justify-between group hover:border-[#65e8ff]/40 transition-all"
              >
                <div className="relative h-64 w-full overflow-hidden bg-[#161b2a]">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10182b] via-[#10182b]/40 to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#090e1c]/80 backdrop-blur-md border border-[#434655]/30">
                    <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
                    <span className="font-mono text-[11px] text-[#65e8ff] uppercase font-bold">
                      {proj.badge || 'Production Deployment'}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-['Geist'] text-[22px] text-[#dee2f6] font-bold mb-3">
                      {proj.title}
                    </h3>
                    <p className="text-[14px] text-[#a6b1c5] mb-6 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {proj.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded bg-[#1a1f2e] text-[#65e8ff] font-mono text-[12px] border border-[#252a39]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#252a39]">
                    <button
                      onClick={() => navigate('/projects')}
                      className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#65e8ff] hover:text-[#b5c4ff] transition-colors cursor-pointer"
                    >
                      <span>View Architecture Blueprint</span>
                      <span className="material-symbols-outlined text-[18px]">account_tree</span>
                    </button>
                    <button
                      onClick={() => navigate('/projects')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#252a39] hover:bg-[#2f3444] text-[#dee2f6] text-[13px] font-semibold transition-colors cursor-pointer"
                    >
                      <span>Live Demo</span>
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Tech Teams & Builders Choose Us (4-Column Bento Grid) */}
      <section className="w-full bg-[#090e1c] py-28 relative border-t border-[#434655]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#65e8ff]" />
              <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">
                The Navioraa Edge
              </span>
            </div>
            <h2 className="font-['Geist'] text-[32px] sm:text-[40px] text-[#dee2f6] font-bold mb-4">
              Why Tech Teams & Builders Choose Us
            </h2>
            <p className="text-[15px] text-[#a6b1c5]">
              We reject rote memorization and toy tutorials. Everything at Navioraa is engineered to mirror the intensity and craftsmanship of tier-1 engineering companies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl bg-[#10182b] p-6 border border-[#434655]/20 flex flex-col justify-between hover:bg-[#161b2a] transition-all">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff] mb-4">
                  <span className="material-symbols-outlined text-[24px]">model_training</span>
                </div>
                <h4 className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold mb-2">Practical Learning</h4>
                <p className="text-[13px] text-[#a6b1c5] leading-relaxed">
                  Every concept is coupled with immediate production code execution. No passive slide decks; pure muscle memory.
                </p>
              </div>
              <div className="pt-6 font-mono text-[12px] text-[#65e8ff] font-semibold">100% Code-First</div>
            </div>

            <div className="rounded-xl bg-[#10182b] p-6 border border-[#434655]/20 flex flex-col justify-between hover:bg-[#161b2a] transition-all">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff] mb-4">
                  <span className="material-symbols-outlined text-[24px]">integration_instructions</span>
                </div>
                <h4 className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold mb-2">Hands-on Project Building</h4>
                <p className="text-[13px] text-[#a6b1c5] leading-relaxed">
                  Architect and ship genuine multi-tier cloud software with full test suites, automated documentation, and CI/CD pipelines.
                </p>
              </div>
              <div className="pt-6 font-mono text-[12px] text-[#65e8ff] font-semibold">Real GitHub Repos</div>
            </div>

            <div className="rounded-xl bg-[#10182b] p-6 border border-[#434655]/20 flex flex-col justify-between hover:bg-[#161b2a] transition-all">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff] mb-4">
                  <span className="material-symbols-outlined text-[24px]">terminal</span>
                </div>
                <h4 className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold mb-2">Modern Tech Stack</h4>
                <p className="text-[13px] text-[#a6b1c5] leading-relaxed">
                  Work strictly with today's standard: Docker containers, PyTorch LLMs, Next.js 19, TypeScript, and Kafka event buses.
                </p>
              </div>
              <div className="pt-6 font-mono text-[12px] text-[#65e8ff] font-semibold">Zero Legacy Bloat</div>
            </div>

            <div className="rounded-xl bg-[#10182b] p-6 border border-[#434655]/20 flex flex-col justify-between hover:bg-[#161b2a] transition-all">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff] mb-4">
                  <span className="material-symbols-outlined text-[24px]">psychology</span>
                </div>
                <h4 className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold mb-2">Future-Ready Problem Solving</h4>
                <p className="text-[13px] text-[#a6b1c5] leading-relaxed">
                  Develop systematic problem deconstruction, algorithmic reasoning, and the ability to adapt to next decade's paradigms.
                </p>
              </div>
              <div className="pt-6 font-mono text-[12px] text-[#65e8ff] font-semibold">First-Principles Logic</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Founder & Leadership Spotlight */}
      <section className="w-full py-28 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="rounded-2xl bg-[#10182b] p-8 lg:p-12 border border-[#434655]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#658aff]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-64 h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden shadow-2xl bg-[#161b2a] border border-[#65e8ff]/30">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                    alt="Abhishek Sharma"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090e1c]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#65e8ff] uppercase bg-[#090e1c]/90 px-2.5 py-1 rounded">
                      Lead Systems Architect
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#65e8ff]" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col justify-center space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-['Geist'] text-[24px] text-[#dee2f6] font-bold">
                      Abhishek Sharma
                    </h3>
                    <p className="text-[14px] text-[#65e8ff] font-medium">
                      Founder & Lead Systems Architect • Navioraa Technologies
                    </p>
                  </div>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#252a39] hover:bg-[#2f3444] text-[#dee2f6] text-[13px] font-semibold transition-colors border border-[#434655]/30 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[#65e8ff] text-[18px]">verified</span>
                    <span>Verified LinkedIn</span>
                    <span className="material-symbols-outlined text-[16px] text-[#a6b1c5]">arrow_outward</span>
                  </a>
                </div>

                <blockquote className="text-[17px] text-[#dee2f6]/90 italic border-l-2 border-[#65e8ff] pl-5 py-1 leading-relaxed">
                  “Software engineering is no longer about writing repetitive boilerplate. It is about understanding distributed systems, wielding neural models as extensions of thought, and building reliable architectures that outlive the hype cycles.”
                </blockquote>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-[#090e1c]/70 border border-[#252a39]">
                    <div className="font-['Geist'] text-[22px] text-[#65e8ff] font-bold">12+</div>
                    <div className="font-mono text-[11px] text-[#a6b1c5] uppercase mt-1">Enterprise Systems</div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#090e1c]/70 border border-[#252a39]">
                    <div className="font-['Geist'] text-[22px] text-[#65e8ff] font-bold">3,500+</div>
                    <div className="font-mono text-[11px] text-[#a6b1c5] uppercase mt-1">Engineers Mentored</div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#090e1c]/70 border border-[#252a39]">
                    <div className="font-['Geist'] text-[22px] text-[#65e8ff] font-bold">99.98%</div>
                    <div className="font-mono text-[11px] text-[#a6b1c5] uppercase mt-1">SLA Architecture</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final High-Impact CTA Banner */}
      <section className="w-full bg-[#090e1c] py-24 relative overflow-hidden border-t border-[#434655]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="relative rounded-2xl bg-[#10182b] p-10 lg:p-16 border border-[#434655]/30 shadow-2xl overflow-hidden">
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#658aff]/20 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#65e8ff]/20 rounded-full blur-[90px] pointer-events-none" />

            <div className="max-w-3xl mx-auto text-center flex flex-col items-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#252a39]/80 backdrop-blur-md border border-[#65e8ff]/30">
                <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
                <span className="font-mono text-[11px] text-[#65e8ff] uppercase font-semibold">
                  Ready for Deployment
                </span>
              </div>

              <h2 className="font-['Geist'] text-[32px] sm:text-[40px] lg:text-[44px] text-[#dee2f6] font-bold leading-tight">
                Ready to Learn, Build, and Create Something Amazing?
              </h2>

              <p className="text-[17px] text-[#a6b1c5] max-w-xl">
                Join the next cohort of engineers or partner with our enterprise labs to engineer custom software solutions today.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => navigate('/courses')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[14px] shadow-[0_0_24px_rgba(41,217,242,0.45)] hover:shadow-[0_0_36px_rgba(41,217,242,0.7)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <span>Start Learning</span>
                  <span className="material-symbols-outlined text-[19px]">rocket_launch</span>
                </button>

                <button
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[#252a39] hover:bg-[#2f3444] text-[#dee2f6] font-semibold text-[14px] backdrop-blur-md border border-[#434655]/40 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#65e8ff] text-[19px]">forum</span>
                  <span>Discuss a Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
