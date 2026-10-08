import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { siteSettings, submitInquiry } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('IT Training');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('Tier 2 ($15k - $30k)');
  const [timeline, setTimeline] = useState('Standard (6-8 Weeks)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inquiryTypes = [
    'IT Training',
    'Internship',
    'Software Development',
    'Website Development',
    'AI Solutions',
    'Business Project',
    'General Inquiry'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Input Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please provide a valid corporate or academic email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        inquiryType,
        subject: subject.trim() || `Inquiry: ${inquiryType}`,
        message: message.trim(),
        budget,
        timeline,
        services: [inquiryType]
      });

      setSuccessToken(token);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch {
      setErrorMsg('We could not submit your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#080d1b] min-h-screen text-[#dee2f6]">
      <div className="relative w-full overflow-hidden bg-[#090e1c] py-16 border-b border-[#434655]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#252a39] border border-[#65e8ff]/30">
            <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
            <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-semibold">
              START A CONVERSATION
            </span>
          </div>

          <h1 className="font-['Geist'] text-[40px] sm:text-[50px] font-bold text-[#dee2f6] tracking-tight">
            Let’s talk.
          </h1>

          <p className="text-[17px] text-[#a6b1c5] max-w-2xl leading-relaxed">
            Have an idea, project or learning goal? Tell us where you want to go.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Details Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="p-8 rounded-xl bg-[#10182b] border border-[#434655]/20 flex flex-col gap-6 shadow-md">
              <h3 className="font-['Geist'] text-[22px] font-bold text-[#dee2f6]">Contact Navioraa</h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff] flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div>
                  <div className="font-mono text-[11px] text-[#a6b1c5] uppercase">Email</div>
                  <a href={`mailto:${siteSettings.contactEmail || 'naviora.pvt@gmail.com'}`} className="text-[#dee2f6] hover:text-[#65e8ff] font-medium text-[15px] transition-colors">
                    {siteSettings.contactEmail || 'naviora.pvt@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#252a39] flex items-center justify-center text-[#25d366] flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </div>
                <div>
                  <div className="font-mono text-[11px] text-[#a6b1c5] uppercase">WhatsApp</div>
                  <a
                    href={`https://wa.me/${siteSettings.whatsappNumber?.replace(/[^0-9]/g, '') || '919890187383'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#dee2f6] hover:text-[#25d366] font-medium text-[15px] transition-colors"
                  >
                    {siteSettings.contactPhone || '+91 98901 87383'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff] flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div>
                  <div className="font-mono text-[11px] text-[#a6b1c5] uppercase">Location</div>
                  <p className="text-[#dee2f6] text-[14px] leading-relaxed">
                    {siteSettings.address || 'Navioraa Cloud & Engineering Labs, Global Innovation Center'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#161b2a] border border-[#252a39] font-mono text-[12px] text-[#a6b1c5]">
                <div className="flex items-center gap-2 text-[#65e8ff] font-bold mb-1">
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>We’d love to hear from you</span>
                </div>
                Share a little about your goals and our team will be in touch.
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-xl bg-[#10182b] border border-[#434655]/30 shadow-2xl relative overflow-hidden">
              <div className="mb-6">
                <h3 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6]">
                  Send a message
                </h3>
                <p className="text-[14px] text-[#a6b1c5] mt-1">
                  Tell us a little about what you have in mind.
                </p>
              </div>

              {successToken ? (
                <div className="p-8 rounded-xl bg-[#161b2a] border border-[#65e8ff]/50 text-center flex flex-col items-center gap-4 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-[#65e8ff]/20 text-[#65e8ff] flex items-center justify-center border border-[#65e8ff]/30">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>
                  <h4 className="font-['Geist'] text-[22px] text-[#dee2f6] font-bold">
                    Inquiry received
                  </h4>
                  <p className="text-[14px] text-[#a6b1c5] max-w-md">
                    Thank you! Your inquiry token is <strong className="text-[#65e8ff] font-mono">#{successToken}</strong>. Our triage lead will review and respond with architecture feedback.
                  </p>
                  <button
                    onClick={() => setSuccessToken(null)}
                    className="mt-2 px-6 py-2.5 rounded-lg bg-[#252a39] text-[#dee2f6] hover:bg-[#343949] text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3.5 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-[13px] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Alex Vance"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="alex@enterprise.io"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98901 87383"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Inquiry Category *</label>
                      <select
                        value={inquiryType}
                        onChange={e => setInquiryType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      >
                        {inquiryTypes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Target Budget</label>
                      <select
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      >
                        <option value="Tier 1 ($5k - $15k)">Tier 1: POC / Advisory ($5k - $15k)</option>
                        <option value="Tier 2 ($15k - $30k)">Tier 2: Production Module ($15k - $30k)</option>
                        <option value="Tier 3 ($30k - $60k)">Tier 3: Enterprise Platform ($30k - $60k)</option>
                        <option value="Tier 4 ($60k+)">Tier 4: Hyperscale Suite ($60k+)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Deployment Horizon</label>
                      <select
                        value={timeline}
                        onChange={e => setTimeline(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      >
                        <option value="Urgent (2-4 Weeks)">Rapid Acceleration (2-4 Weeks)</option>
                        <option value="Standard (6-8 Weeks)">Standard Velocity (6-8 Weeks)</option>
                        <option value="Quarterly (3-6 Months)">Quarterly Roadmap (3-6 Months)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="e.g. Dedicated Inference Engine Architecture Walkthrough"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] text-[#dee2f6] uppercase">System Specifications / Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Detail your goals, scale constraints, stack preferences, or student cohort inquiries..."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[14px] shadow-[0_0_16px_rgba(101,232,255,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isSubmitting ? 'sync' : 'send'}
                    </span>
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
