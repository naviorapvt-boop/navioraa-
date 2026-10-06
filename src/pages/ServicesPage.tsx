import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface ServicesPageProps {
  navigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const { services, submitInquiry } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);

  // Estimator Form state
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['Custom Software']);
  const [budgetTier, setBudgetTier] = useState<string>('Tier 2 ($15k - $30k)');
  const [timelineTier, setTimelineTier] = useState<string>('Standard (6-8 Weeks)');
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [projectNotes, setProjectNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{ token: string; name: string } | null>(null);

  // Only published services shown on public page
  const publishedServices = services.filter(s => s.status === 'published');

  const filteredServices = publishedServices.filter((service) => {
    const matchesCat = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'custom-software', label: 'Custom Software' },
    { id: 'modern-web', label: 'Modern Web' },
    { id: 'mobile-apps', label: 'Mobile Apps' },
    { id: 'cognitive-ai', label: 'Cognitive AI' },
    { id: 'cloud-devops', label: 'Cloud & DevOps' },
    { id: 'training', label: 'Corporate Training' }
  ];

  const handleConfigureScope = (serviceTitle: string, suggestedBudget: string) => {
    setSelectedDomains(prev => (prev.includes(serviceTitle) ? prev : [...prev, serviceTitle]));
    setBudgetTier(suggestedBudget);
    const element = document.getElementById('estimator-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const handleEstimatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;

    setIsSubmitting(true);
    try {
      const token = await submitInquiry({
        name: clientName,
        email: clientEmail,
        inquiryType: selectedDomains[0] || 'Software Development',
        subject: `Scope Brief: ${selectedDomains.join(', ')}`,
        message: projectNotes || 'Automated consultation brief request.',
        budget: budgetTier,
        timeline: timelineTier,
        services: selectedDomains
      });

      setSubmissionFeedback({ token, name: clientName });
      setClientName('');
      setClientEmail('');
      setProjectNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#080d1b] min-h-screen text-[#dee2f6]">
      {/* Background radial glows */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[720px] h-[340px] bg-[#658aff]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[500px] h-[280px] bg-[#65e8ff]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#252a39] border border-[#65e8ff]/30 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#65e8ff] shadow-[0_0_8px_rgba(101,232,255,0.9)] animate-pulse" />
                <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#65e8ff] font-semibold">
                  PRODUCTION-READY ENGINEERING
                </span>
              </div>

              <h1 className="font-['Geist'] text-[40px] sm:text-[52px] font-bold text-[#dee2f6] tracking-tight leading-tight">
                Enterprise IT &{' '}
                <span className="bg-gradient-to-r from-[#658aff] via-[#2ad9f2] to-[#65e8ff] bg-clip-text text-transparent">
                  Technology Solutions
                </span>
              </h1>

              <p className="text-[17px] text-[#a6b1c5] max-w-3xl leading-relaxed">
                From custom software engineering to intelligent AI solutions and cloud architecture, we build reliable, high-performance technology tailored for modern businesses and ambitious startups.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('estimator-panel');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-semibold text-[14px] shadow-md hover:shadow-xl hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <span>Launch Project Configurator</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>

                <a
                  href="#catalog-grid"
                  className="px-6 py-3.5 rounded-lg bg-[#252a39] text-[#dee2f6] hover:text-[#65e8ff] font-semibold text-[14px] transition-colors flex items-center gap-2 border border-[#434655]/40"
                >
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  <span>Explore Capability Matrix</span>
                </a>
              </div>
            </div>

            {/* Telemetry Pulse Card */}
            <div className="lg:col-span-4 flex flex-col gap-3 bg-[#10182b] p-6 rounded-xl border border-[#434655]/30 shadow-xl relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#a6b1c5] uppercase tracking-wider font-semibold">
                  Telemetry Pulse
                </span>
                <span className="font-mono text-[11px] text-[#65e8ff] font-medium uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65e8ff] animate-pulse" />
                  Live Fleet
                </span>
              </div>

              {/* Sparkline Visual */}
              <div className="w-full h-24 bg-[#090e1c] rounded-lg p-3 flex flex-col justify-between overflow-hidden relative border border-[#252a39]">
                <div className="flex items-center justify-between text-[#a6b1c5] font-mono text-[11px]">
                  <span>TX Throughput</span>
                  <span className="text-[#65e8ff] font-bold">1.48M req/s</span>
                </div>
                <svg className="w-full h-12 text-[#65e8ff]" preserveAspectRatio="none" viewBox="0 0 320 50">
                  <path
                    d="M0 40 Q 25 35, 50 38 T 100 20 T 150 28 T 200 12 T 250 18 T 300 6 L 320 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M0 40 Q 25 35, 50 38 T 100 20 T 150 28 T 200 12 T 250 18 T 300 6 L 320 8 L 320 50 L 0 50 Z"
                    fill="currentColor"
                    opacity="0.12"
                  />
                </svg>
                <div className="flex justify-between font-mono text-[10px] text-[#a6b1c5]">
                  <span>p99 Latency: 4.1ms</span>
                  <span className="text-[#b5c4ff]">Zero Dropped Packets</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[#a6b1c5]">
                <div className="bg-[#161b2a] p-3 rounded-lg flex flex-col border border-[#252a39]">
                  <span className="font-mono text-[10px] uppercase">Global Clusters</span>
                  <span className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold">142</span>
                </div>
                <div className="bg-[#161b2a] p-3 rounded-lg flex flex-col border border-[#252a39]">
                  <span className="font-mono text-[10px] uppercase">Code Velocity</span>
                  <span className="font-['Geist'] text-[20px] text-[#65e8ff] font-bold">4.8x avg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Metrics Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#10182b] p-6 lg:p-8 rounded-xl border border-[#434655]/20 shadow-md">
            <div className="flex flex-col gap-1 pr-4 border-r border-[#252a39]/60">
              <div className="flex items-center gap-1.5 text-[#65e8ff] font-mono text-[11px] uppercase">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Availability Standard</span>
              </div>
              <span className="font-['Geist'] text-[32px] font-bold text-[#dee2f6]">99.98%</span>
              <span className="text-[13px] text-[#a6b1c5]">Continuous SLA reliability tier across clusters</span>
            </div>

            <div className="flex flex-col gap-1 pr-4 border-r border-[#252a39]/60">
              <div className="flex items-center gap-1.5 text-[#65e8ff] font-mono text-[11px] uppercase">
                <span className="material-symbols-outlined text-[16px]">public</span>
                <span>Edge Infrastructure</span>
              </div>
              <span className="font-['Geist'] text-[32px] font-bold text-[#dee2f6]">40+</span>
              <span className="text-[13px] text-[#a6b1c5]">Global distributed edge datacenters active</span>
            </div>

            <div className="flex flex-col gap-1 pr-4 border-r border-[#252a39]/60">
              <div className="flex items-center gap-1.5 text-[#b5c4ff] font-mono text-[11px] uppercase">
                <span className="material-symbols-outlined text-[16px]">format_image_left</span>
                <span>Engineering Tenet</span>
              </div>
              <span className="font-['Geist'] text-[32px] font-bold text-[#dee2f6]">Zero</span>
              <span className="text-[13px] text-[#a6b1c5]">Unbudgeted technical debt architecture</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#65e8ff] font-mono text-[11px] uppercase">
                <span className="material-symbols-outlined text-[16px]">support_agent</span>
                <span>Dedicated Operations</span>
              </div>
              <span className="font-['Geist'] text-[32px] font-bold text-[#dee2f6]">24/7/365</span>
              <span className="text-[13px] text-[#a6b1c5]">Direct L3 engineer on-call bridge access</span>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-8" id="catalog-grid">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#10182b] p-4 rounded-xl border border-[#434655]/20 shadow-sm">
            {/* Quick Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-[13px] transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#252a39] text-[#65e8ff] border border-[#65e8ff]/40 shadow-sm'
                      : 'text-[#a6b1c5] hover:text-[#dee2f6] hover:bg-[#161b2a]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Catalog Text Search */}
            <div className="relative min-w-[280px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a6b1c5] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stack, domain or spec..."
                className="w-full bg-[#090e1c] border border-[#252a39] rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-[#dee2f6] placeholder:text-[#a6b1c5]/50 focus:outline-none focus:ring-1 focus:ring-[#65e8ff] transition-all"
              />
            </div>
          </div>
        </section>

        {/* Services Deep-Dive Catalog (2-Column Desktop Grid) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredServices.map((service) => {
              const isDrawerOpen = openDrawerId === service.id;

              return (
                <div
                  key={service.id}
                  className="flex flex-col bg-[#10182b] rounded-xl p-8 border border-[#434655]/20 hover:border-[#65e8ff]/30 shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#252a39] border border-[#434655]/30 flex items-center justify-center text-[#65e8ff]">
                      <span className="material-symbols-outlined text-[28px]">dns</span>
                    </div>
                    <span className="px-3 py-1 rounded bg-[#252a39] text-[#65e8ff] font-mono text-[11px] uppercase tracking-wider font-semibold border border-[#252a39]">
                      {service.serviceCode || 'Service Core'}
                    </span>
                  </div>

                  <h2 className="font-['Geist'] text-[24px] text-[#dee2f6] font-semibold group-hover:text-[#65e8ff] transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-[15px] text-[#a6b1c5] mt-2 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Tech Specs Mosaic */}
                  <div className="my-6 rounded-lg overflow-hidden bg-[#090e1c] p-4 border border-[#252a39]">
                    <div className="flex items-center justify-between mb-3 text-[#a6b1c5] font-mono text-[11px]">
                      <span className="uppercase">Standard Tech Stack</span>
                      <span className="text-[#b5c4ff]">{service.tierBadge || 'V8 Engine'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded bg-[#161b2a] border border-[#252a39] text-[#dee2f6] font-mono text-[11px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Feature Bullets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-[#a6b1c5] mb-6">
                    {service.features?.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#65e8ff] text-[16px] flex-shrink-0">
                          check_circle
                        </span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Drawer & Scope Controls */}
                  <div className="mt-auto pt-4 border-t border-[#252a39] flex items-center justify-between">
                    <button
                      onClick={() => setOpenDrawerId(isDrawerOpen ? null : service.id)}
                      className="text-[#65e8ff] text-[13px] font-semibold hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">account_tree</span>
                      <span>{isDrawerOpen ? 'Close Blueprint' : 'Production Scope Breakdown'}</span>
                    </button>

                    <button
                      onClick={() => handleConfigureScope(service.title, 'Tier 2 ($15k - $30k)')}
                      className="px-4 py-2 rounded-lg bg-[#252a39] hover:bg-[#2f3444] text-[#dee2f6] hover:text-[#65e8ff] text-[13px] font-semibold transition-colors cursor-pointer border border-[#434655]/30"
                    >
                      Configure Scope
                    </button>
                  </div>

                  {/* Expandable Milestone Drawer */}
                  {isDrawerOpen && (
                    <div className="mt-4 p-4 bg-[#161b2a] rounded-lg border border-[#65e8ff]/20 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#252a39]">
                        <span className="text-[12px] font-mono text-[#65e8ff] uppercase tracking-wider font-bold">
                          Milestone Blueprint
                        </span>
                        <button
                          onClick={() => setOpenDrawerId(null)}
                          className="text-[#a6b1c5] hover:text-[#dee2f6]"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>

                      <div className="space-y-2 text-[13px] text-[#a6b1c5]">
                        {service.milestones && service.milestones.length > 0 ? (
                          service.milestones.map((m, mIdx) => (
                            <div key={mIdx} className="p-2.5 rounded bg-[#090e1c] flex justify-between items-center border border-[#252a39]">
                              <span className="text-[#dee2f6]">{m.title}</span>
                              <span className="text-[#b5c4ff] font-mono text-[11px]">{m.phase}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="p-2.5 rounded bg-[#090e1c] flex justify-between items-center border border-[#252a39]">
                              <span className="text-[#dee2f6]">W1-2: Domain Analysis & Schema Modeling</span>
                              <span className="text-[#b5c4ff] font-mono text-[11px]">Phase I</span>
                            </div>
                            <div className="p-2.5 rounded bg-[#090e1c] flex justify-between items-center border border-[#252a39]">
                              <span className="text-[#dee2f6]">W3-6: High-Concurrency Service Core</span>
                              <span className="text-[#b5c4ff] font-mono text-[11px]">Phase II</span>
                            </div>
                            <div className="p-2.5 rounded bg-[#090e1c] flex justify-between items-center border border-[#252a39]">
                              <span className="text-[#dee2f6]">W7-8: Chaos & Penetration Testing</span>
                              <span className="text-[#b5c4ff] font-mono text-[11px]">Phase III</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Embedded Architecture Showcase Panel */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
          <div className="bg-[#10182b] rounded-xl p-8 border border-[#434655]/20 shadow-lg relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col gap-4">
                <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-widest font-semibold">
                  Architectural Tenet
                </span>
                <h3 className="font-['Geist'] text-[32px] text-[#dee2f6] font-bold">
                  Engineered for Deterministic Reliability
                </h3>
                <p className="text-[15px] text-[#a6b1c5] leading-relaxed">
                  We do not treat infrastructure as an afterthought. Every software module engineered by Navioraa is verified through automated fuzz testing, static code analysis, and synthetic stress simulation up to 5x baseline peak load.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-[#161b2a] p-3 rounded-lg flex flex-col border border-[#252a39]">
                    <span className="font-mono text-[10px] text-[#a6b1c5] uppercase">Mean Time to Fix</span>
                    <span className="font-['Geist'] text-[20px] text-[#65e8ff] font-bold">&lt; 14 mins</span>
                  </div>
                  <div className="bg-[#161b2a] p-3 rounded-lg flex flex-col border border-[#252a39]">
                    <span className="font-mono text-[10px] text-[#a6b1c5] uppercase">Test Coverage</span>
                    <span className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold">&gt; 94.2%</span>
                  </div>
                  <div className="bg-[#161b2a] p-3 rounded-lg flex flex-col border border-[#252a39]">
                    <span className="font-mono text-[10px] text-[#a6b1c5] uppercase">CVE Vulnerabilities</span>
                    <span className="font-['Geist'] text-[20px] text-[#b5c4ff] font-bold">0 critical</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="w-full h-72 rounded-xl overflow-hidden shadow-md bg-[#161b2a] relative border border-[#434655]/30">
                  <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
                    alt="Network Mesh Architecture"
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090e1c] via-[#090e1c]/40 to-transparent p-6 flex flex-col justify-end">
                    <span className="font-mono text-[11px] text-[#65e8ff]">PRIMARY DATAPLANE: US-EAST-1 // EU-CENTRAL-1</span>
                    <span className="font-['Geist'] text-[20px] text-[#dee2f6] font-semibold">
                      Continuous Multi-Region Replication Mesh
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Embedded Interactive Project Scope Estimator & Consultation Inquiry */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24" id="estimator-panel">
          <div className="bg-[#10182b] rounded-xl p-8 md:p-12 border border-[#434655]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#658aff]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#252a39] text-[#65e8ff] font-mono text-[11px] uppercase tracking-wider mb-2 border border-[#65e8ff]/20">
                Direct Pipeline Inquiry
              </div>
              <h2 className="font-['Geist'] text-[32px] sm:text-[38px] font-bold text-[#dee2f6]">
                Project Scope Estimator & Consultation
              </h2>
              <p className="text-[15px] text-[#a6b1c5] mt-1">
                Configure your technical scope below. This configuration streams directly into our engineering lead queue with guaranteed SLA feedback within 4 hours.
              </p>
            </div>

            <form onSubmit={handleEstimatorSubmit} className="space-y-6">
              {/* Step 1: Select Capability Domain */}
              <div className="flex flex-col gap-3">
                <label className="font-semibold text-[13px] text-[#dee2f6] uppercase tracking-wider font-mono">
                  1. Target Technology Domain
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    'Custom Software',
                    'Modern Web Apps',
                    'Mobile Application',
                    'Cognitive AI & RAG',
                    'Cloud & DevOps',
                    'Corporate Upskilling'
                  ].map((domain) => {
                    const isChecked = selectedDomains.includes(domain);
                    return (
                      <label
                        key={domain}
                        onClick={() => handleDomainToggle(domain)}
                        className={`flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-all border ${
                          isChecked
                            ? 'bg-[#1a1f2e] border-[#65e8ff] text-[#65e8ff]'
                            : 'bg-[#161b2a] border-[#252a39] text-[#dee2f6] hover:bg-[#1a1f2e]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#65e8ff] bg-[#090e1c] focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[14px] font-medium">{domain}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Budget & Timeline Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[13px] text-[#dee2f6] uppercase tracking-wider font-mono">
                    2. Target Budget Window
                  </label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    className="w-full bg-[#090e1c] text-[#dee2f6] rounded-lg p-3.5 text-[14px] border border-[#252a39] focus:outline-none focus:border-[#65e8ff]"
                  >
                    <option value="Tier 1 ($5k - $15k)">Tier 1: Scoping POC / Advisory ($5,000 – $15,000)</option>
                    <option value="Tier 2 ($15k - $30k)">Tier 2: Production Module / MVP ($15,000 – $30,000)</option>
                    <option value="Tier 3 ($30k - $60k)">Tier 3: Enterprise Microservices Suite ($30,000 – $60,000)</option>
                    <option value="Tier 4 ($60k+)">Tier 4: Distributed Mission-Critical Overhaul ($60,000+)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[13px] text-[#dee2f6] uppercase tracking-wider font-mono">
                    3. Deployment Timeline Target
                  </label>
                  <select
                    value={timelineTier}
                    onChange={(e) => setTimelineTier(e.target.value)}
                    className="w-full bg-[#090e1c] text-[#dee2f6] rounded-lg p-3.5 text-[14px] border border-[#252a39] focus:outline-none focus:border-[#65e8ff]"
                  >
                    <option value="Rapid Acceleration (2-4 Weeks)">Rapid Acceleration (2 – 4 Weeks)</option>
                    <option value="Standard (6-8 Weeks)">Standard Velocity (6 – 8 Weeks)</option>
                    <option value="Quarterly Roadmap (3-6 Months)">Quarterly Roadmap (3 – 6 Months)</option>
                    <option value="Dedicated Sprint Retainer">Continuous Dedicated Sprint Retainer</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Contact & Specification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[13px] text-[#dee2f6] uppercase tracking-wider font-mono">
                    Full Name / Lead Engineer *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Dr. Alex Vance"
                    className="w-full bg-[#090e1c] text-[#dee2f6] rounded-lg p-3.5 text-[14px] border border-[#252a39] placeholder:text-[#a6b1c5]/40 focus:outline-none focus:border-[#65e8ff]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[13px] text-[#dee2f6] uppercase tracking-wider font-mono">
                    Corporate Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="a.vance@enterprise.com"
                    className="w-full bg-[#090e1c] text-[#dee2f6] rounded-lg p-3.5 text-[14px] border border-[#252a39] placeholder:text-[#a6b1c5]/40 focus:outline-none focus:border-[#65e8ff]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[13px] text-[#dee2f6] uppercase tracking-wider font-mono">
                  System Specifications & High-Level Architecture Goals
                </label>
                <textarea
                  rows={4}
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder="Detail your current tech stack, scale constraints, expected throughput, or compliance dependencies..."
                  className="w-full bg-[#090e1c] text-[#dee2f6] rounded-lg p-3.5 text-[14px] border border-[#252a39] placeholder:text-[#a6b1c5]/40 focus:outline-none focus:border-[#65e8ff]"
                />
              </div>

              {/* Submission Feedback Alert */}
              {submissionFeedback && (
                <div className="p-4 rounded-lg bg-[#161b2a] border border-[#65e8ff]/50 text-[#65e8ff] animate-in fade-in">
                  <div className="flex items-center gap-2 font-semibold text-[15px]">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>Transmission Successful — Token #{submissionFeedback.token}</span>
                  </div>
                  <p className="mt-1 text-[#a6b1c5] text-[13px] leading-relaxed">
                    Thank you, <strong className="text-[#dee2f6]">{submissionFeedback.name}</strong>. Your project scope has been queued into Navioraa Firestore Datastore. A Principal Solutions Architect will follow up via email within 4 hours.
                  </p>
                </div>
              )}

              {/* Submit Trigger */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[#a6b1c5] font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#65e8ff]" />
                  <span>Encrypted Direct Terminal Transport · Firestore Sync</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[14px] shadow-md hover:shadow-xl hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isSubmitting ? 'sync' : 'send'}
                  </span>
                  <span>{isSubmitting ? 'Transmitting Specification...' : 'Dispatch Architecture Brief'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
