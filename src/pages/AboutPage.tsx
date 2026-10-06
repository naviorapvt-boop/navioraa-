import React from 'react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="w-full bg-[#080d1b] min-h-screen text-[#dee2f6]">
      {/* Hero */}
      <div className="relative w-full overflow-hidden bg-[#090e1c] py-20 border-b border-[#434655]/20">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#658aff]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#252a39] border border-[#65e8ff]/30">
            <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
            <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">
              Organization Blueprint
            </span>
          </div>

          <h1 className="font-['Geist'] text-[40px] sm:text-[54px] font-bold text-[#dee2f6] tracking-tight leading-tight">
            About <span className="bg-gradient-to-r from-[#658aff] via-[#2ad9f2] to-[#65e8ff] bg-clip-text text-transparent">Navioraa</span>
          </h1>

          <p className="text-[18px] text-[#a6b1c5] max-w-3xl leading-relaxed">
            Navioraa is a premier technology company and engineering academy delivering modern software solutions, cloud architectures, and intensive practical training for students, aspiring engineers, and growing enterprises.
          </p>
        </div>
      </div>

      {/* Mission & Vision Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-xl bg-[#10182b] border border-[#434655]/20 shadow-lg flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff]">
              <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
            </div>
            <h3 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6]">Our Mission</h3>
            <p className="text-[15px] text-[#a6b1c5] leading-relaxed">
              To replace passive tutorial loops with real-world engineering craftsmanship. We empower individuals and teams to build, ship, and operate distributed systems, AI solutions, and fault-tolerant cloud software with unwavering conviction.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-[#10182b] border border-[#434655]/20 shadow-lg flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#252a39] flex items-center justify-center text-[#b5c4ff]">
              <span className="material-symbols-outlined text-[28px]">visibility</span>
            </div>
            <h3 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6]">Our Vision</h3>
            <p className="text-[15px] text-[#a6b1c5] leading-relaxed">
              To be the global benchmark for high-velocity software academies and enterprise engineering consulting—where learning and real-world execution are indistinguishable.
            </p>
          </div>
        </div>

        {/* Practical Learning Philosophy */}
        <div className="p-8 lg:p-12 rounded-2xl bg-[#10182b] border border-[#434655]/30 shadow-2xl mb-16">
          <div className="max-w-3xl">
            <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-widest font-bold">
              Pedagogical Foundation
            </span>
            <h2 className="font-['Geist'] text-[32px] sm:text-[38px] font-bold text-[#dee2f6] mt-2 mb-4">
              The Practical Learning Philosophy
            </h2>
            <p className="text-[16px] text-[#a6b1c5] leading-relaxed mb-6">
              Navioraa was created with a clear mandate: software engineering cannot be taught with passive slide decks or toy code snippets. Engineers grow only when confronted with real build errors, concurrency bottlenecks, network latency, and deployment pipelines.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-[#161b2a] border border-[#252a39]">
                <h4 className="font-['Geist'] text-[18px] text-[#65e8ff] font-bold mb-1">Code-First Rigor</h4>
                <p className="text-[13px] text-[#a6b1c5]">Every lecture is accompanied by terminal execution and pull request audits.</p>
              </div>
              <div className="p-4 rounded-lg bg-[#161b2a] border border-[#252a39]">
                <h4 className="font-['Geist'] text-[18px] text-[#b5c4ff] font-bold mb-1">Real Systems</h4>
                <p className="text-[13px] text-[#a6b1c5]">Students architect multi-tenant, zero-downtime microservices on cloud clusters.</p>
              </div>
              <div className="p-4 rounded-lg bg-[#161b2a] border border-[#252a39]">
                <h4 className="font-['Geist'] text-[18px] text-[#65e8ff] font-bold mb-1">Zero Legacy Bloat</h4>
                <p className="text-[13px] text-[#a6b1c5]">We focus strictly on production technologies in demand right now.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Focus & Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#10182b] border border-[#434655]/20 flex flex-col gap-3">
            <span className="font-mono text-[11px] text-[#65e8ff] uppercase font-bold">Domain 01</span>
            <h4 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold">Advanced Programming & AI</h4>
            <p className="text-[14px] text-[#a6b1c5] leading-relaxed">
              Python 3.12, Java 21 Virtual Threads, Go Microservices, PyTorch, LangChain, and fine-tuned LLM inference architectures.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#10182b] border border-[#434655]/20 flex flex-col gap-3">
            <span className="font-mono text-[11px] text-[#65e8ff] uppercase font-bold">Domain 02</span>
            <h4 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold">Cloud & DevOps Topology</h4>
            <p className="text-[14px] text-[#a6b1c5] leading-relaxed">
              Multi-region Kubernetes clusters, HashiCorp Vault secrets, Terraform declarative IaC, and zero-loss Kafka pipelines.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#10182b] border border-[#434655]/20 flex flex-col gap-3">
            <span className="font-mono text-[11px] text-[#65e8ff] uppercase font-bold">Domain 03</span>
            <h4 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold">Client Systems & Solutions</h4>
            <p className="text-[14px] text-[#a6b1c5] leading-relaxed">
              Custom web, mobile, and enterprise platforms engineered with rigid performance SLAs and full test verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
