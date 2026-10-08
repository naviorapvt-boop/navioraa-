import React from 'react';

interface LegalPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPage: React.FC<LegalPageProps> = () => {
  return (
    <div className="w-full bg-[#080d1b] min-h-screen text-[#dee2f6] py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h1 className="font-['Geist'] text-[36px] font-bold text-[#dee2f6] mb-4">
          Privacy Policy
        </h1>
        <p className="text-[14px] font-mono text-[#65e8ff] mb-8">
          Last Updated: October 2026 • Navioraa Security Governance
        </p>

        <div className="space-y-8 text-[15px] text-[#a6b1c5] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-['Geist'] text-[20px] font-semibold text-[#dee2f6]">1. Data Collection & Processing</h2>
            <p>
              Navioraa collects information you submit through course applications, project consultations, and contact forms. We use it to respond to your request and provide the services you asked about, and apply appropriate safeguards to protect it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-['Geist'] text-[20px] font-semibold text-[#dee2f6]">2. Zero-Trust Access Protocol</h2>
            <p>
              Contact inquiries and application details are available only to authorized Navioraa administrators who need them to follow up.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-['Geist'] text-[20px] font-semibold text-[#dee2f6]">3. No Sale of User Data</h2>
            <p>
              Navioraa does not sell, rent, or monetize candidate or enterprise contact data. Telemetry is utilized solely for providing technical consultation, cohort admittance, and service delivery.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<LegalPageProps> = () => {
  return (
    <div className="w-full bg-[#080d1b] min-h-screen text-[#dee2f6] py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h1 className="font-['Geist'] text-[36px] font-bold text-[#dee2f6] mb-4">
          Terms of Service
        </h1>
        <p className="text-[14px] font-mono text-[#65e8ff] mb-8">
          Last Updated: October 2026 • Navioraa Operations
        </p>

        <div className="space-y-8 text-[15px] text-[#a6b1c5] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-['Geist'] text-[20px] font-semibold text-[#dee2f6]">1. Academy Cohort Code of Conduct</h2>
            <p>
              Students enrolling in Navioraa training tracks agree to engage actively in peer code reviews, adhere to honest academic development, and respect disposable cloud sandbox rate limits.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-['Geist'] text-[20px] font-semibold text-[#dee2f6]">2. Intellectual Property</h2>
            <p>
              All code authored by students during capstone projects remains their proprietary property. Frameworks, curriculum guides, and infrastructure templates provided by Navioraa remain protected under copyright.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
