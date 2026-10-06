import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Course } from '../types';

interface CoursesPageProps {
  navigate: (path: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ navigate }) => {
  const { courses, submitInquiry } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLevel, setActiveLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openCurriculumId, setOpenCurriculumId] = useState<string | null>(null);

  // Modal State
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [applicantExp, setApplicantExp] = useState<string>('1-3');
  const [studyPace, setStudyPace] = useState<string>('part-time');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState<boolean>(false);

  // Public courses: only published records
  const publishedCourses = courses.filter((c) => c.status === 'published');

  const filteredCourses = publishedCourses.filter((course) => {
    const matchesCat = activeCategory === 'all' || course.category === activeCategory;
    const matchesLevel =
      activeLevel === 'all' || course.difficulty.toLowerCase() === activeLevel.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      course.title.toLowerCase().includes(query) ||
      course.shortDescription.toLowerCase().includes(query) ||
      course.technologies?.some((t) => t.toLowerCase().includes(query));
    return matchesCat && matchesLevel && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'ai-ml', label: 'AI & Machine Learning' },
    { id: 'full-stack', label: 'Full-Stack Web Dev' },
    { id: 'cloud-devops', label: 'Cloud & DevOps' },
    { id: 'python-data', label: 'Python & Data Engineering' }
  ];

  const levels = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ];

  const handleOpenEnrollModal = (course: Course) => {
    setSelectedCourseForModal(course);
    setEnrollmentSuccess(false);
  };

  const handleCloseEnrollModal = () => {
    setSelectedCourseForModal(null);
    setEnrollmentSuccess(false);
    setApplicantName('');
    setApplicantEmail('');
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForModal || !applicantName || !applicantEmail) return;

    setIsSubmitting(true);
    try {
      await submitInquiry({
        name: applicantName,
        email: applicantEmail,
        inquiryType: 'IT Training',
        subject: `Cohort Application: ${selectedCourseForModal.title}`,
        message: `Candidate application for ${selectedCourseForModal.title} (${selectedCourseForModal.code || 'COHORT'}). Experience: ${applicantExp} years. Study pace: ${studyPace}.`,
        services: [selectedCourseForModal.title]
      });
      setEnrollmentSuccess(true);
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#080d1b] min-h-screen text-[#dee2f6]">
      {/* Top Banner & Header */}
      <div className="relative w-full overflow-hidden bg-[#090e1c] py-16 border-b border-[#434655]/20">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#658aff]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[#65e8ff]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col gap-8">
          {/* Engine Status Top Line */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252a39] font-mono text-[11px] text-[#65e8ff] uppercase tracking-widest border border-[#65e8ff]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#65e8ff] animate-pulse" />
                Catalog Engine v3.4 // Live
              </span>
              <span className="text-[#8d90a0] font-mono text-[12px]">:: SECURE_ENDPOINT</span>
            </div>

            <div className="flex items-center gap-6 text-[#a6b1c5] font-mono text-[12px]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#65e8ff]">memory</span>
                Kernel Latency: 0.12ms
              </span>
              <span className="hidden sm:inline text-[#434655]">•</span>
              <span className="hidden sm:flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#b5c4ff]">verified_user</span>
                ISO/IEC 27001
              </span>
            </div>
          </div>

          {/* Title & Admissions Pill */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 flex flex-col gap-3">
              <h1 className="font-['Geist'] text-[40px] sm:text-[52px] text-[#dee2f6] font-bold tracking-tight leading-tight">
                Industry-Ready{' '}
                <span className="bg-gradient-to-r from-[#658aff] via-[#2ad9f2] to-[#b5c4ff] bg-clip-text text-transparent">
                  IT Training
                </span>{' '}
                Programs
              </h1>
              <p className="text-[17px] text-[#a6b1c5] max-w-2xl leading-relaxed">
                Master in-demand technologies through hands-on code labs, real-world capstone projects, and 1-on-1 guided mentorship. Production-ready skills validated against modern software architectures.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-end">
              <div className="p-4 rounded-xl bg-[#10182b] border border-[#434655]/30 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff] border border-[#434655]/30">
                    <span className="material-symbols-outlined text-[28px]">terminal</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold">Fall Cohort</span>
                    <span className="font-mono text-[11px] text-[#a6b1c5] uppercase">
                      Admissions Closing in 48h
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#00cee7]/20 border border-[#00cee7]/40 text-[#00cee7] font-mono text-[11px] uppercase font-bold">
                  92% Filled
                </span>
              </div>
            </div>
          </div>

          {/* 4 Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-[#10182b] border border-[#252a39] flex flex-col gap-1 shadow-sm">
              <span className="font-mono text-[11px] text-[#65e8ff] uppercase font-bold">Certified Tracks</span>
              <span className="font-['Geist'] text-[30px] font-bold text-[#dee2f6]">{publishedCourses.length} Total</span>
              <span className="text-[13px] text-[#a6b1c5]">Validated enterprise syllabi</span>
            </div>
            <div className="p-4 rounded-xl bg-[#10182b] border border-[#252a39] flex flex-col gap-1 shadow-sm">
              <span className="font-mono text-[11px] text-[#b5c4ff] uppercase font-bold">Project Ratio</span>
              <span className="font-['Geist'] text-[30px] font-bold text-[#dee2f6]">100%</span>
              <span className="text-[13px] text-[#a6b1c5]">Production repo deliverables</span>
            </div>
            <div className="p-4 rounded-xl bg-[#10182b] border border-[#252a39] flex flex-col gap-1 shadow-sm">
              <span className="font-mono text-[11px] text-[#65e8ff] uppercase font-bold">Mentorship SLA</span>
              <span className="font-['Geist'] text-[30px] font-bold text-[#dee2f6]">1-on-1</span>
              <span className="text-[13px] text-[#a6b1c5]">Live code reviews & office hours</span>
            </div>
            <div className="p-4 rounded-xl bg-[#10182b] border border-[#252a39] flex flex-col gap-1 shadow-sm">
              <span className="font-mono text-[11px] text-[#b5c4ff] uppercase font-bold">Firestore Latency</span>
              <span className="font-['Geist'] text-[30px] font-bold text-[#dee2f6]">0ms</span>
              <span className="text-[13px] text-[#a6b1c5]">Cached index query edge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Filter & Search Command Bar */}
      <div className="sticky top-20 z-40 w-full bg-[#090e1c]/90 backdrop-blur-xl border-b border-[#252a39] shadow-md py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a6b1c5] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search track, tech, stack..."
                className="w-full pl-10 pr-4 py-2 bg-[#161b2a] text-[#dee2f6] text-[14px] rounded-lg border border-[#252a39] focus:outline-none focus:border-[#65e8ff] placeholder:text-[#8d90a0]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a6b1c5] hover:text-[#dee2f6]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#65e8ff] text-[#090e1c] font-bold shadow-[0_0_12px_rgba(101,232,255,0.4)]'
                      : 'bg-[#161b2a] text-[#a6b1c5] hover:text-[#dee2f6] hover:bg-[#252a39]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-1 bg-[#161b2a] p-1 rounded-lg border border-[#252a39] w-full lg:w-auto justify-between lg:justify-start">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setActiveLevel(lvl.id)}
                  className={`px-3 py-1 rounded text-[11px] font-mono uppercase font-bold transition-colors cursor-pointer ${
                    activeLevel === lvl.id
                      ? 'bg-[#343949] text-[#dee2f6]'
                      : 'text-[#a6b1c5] hover:text-[#dee2f6]'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Course Catalog Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="font-['Geist'] text-[24px] text-[#dee2f6] font-semibold">Curated Cohorts</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#252a39] text-[#65e8ff] font-mono text-[12px] border border-[#65e8ff]/20">
              {filteredCourses.length} Active Tracks
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#a6b1c5] font-mono text-[12px]">
            <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
            <span>Realtime Interactive Drawer Enabled</span>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-[#10182b] rounded-xl text-center border border-[#252a39]">
            <div className="w-16 h-16 rounded-full bg-[#252a39] flex items-center justify-center text-[#65e8ff] mb-4">
              <span className="material-symbols-outlined text-[32px]">filter_alt_off</span>
            </div>
            <h3 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold">No Matching Cohorts Found</h3>
            <p className="text-[14px] text-[#a6b1c5] max-w-md mt-1">
              We couldn't find any courses matching your search and filter criteria. Try resetting filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveLevel('all');
                setSearchQuery('');
              }}
              className="mt-6 px-6 py-2.5 rounded-lg bg-[#252a39] text-[#dee2f6] hover:bg-[#658aff] hover:text-[#090e1c] font-semibold text-[13px] transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const isCurriculumOpen = openCurriculumId === course.id;

              return (
                <div
                  key={course.id}
                  className="flex flex-col rounded-xl bg-[#10182b] border border-[#434655]/20 shadow-lg overflow-hidden group hover:border-[#65e8ff]/40 transition-all duration-300"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative h-48 w-full bg-[#161b2a] overflow-hidden">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10182b] via-[#10182b]/40 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090e1c]/80 backdrop-blur-md border border-[#434655]/30">
                      <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
                      <span className="font-mono text-[10px] text-[#65e8ff] uppercase font-bold">
                        {course.duration} • {course.hours || '80 Hrs'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#658aff] text-[#00164e] font-mono text-[10px] uppercase font-bold">
                      {course.difficulty}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#a6b1c5] font-mono text-[11px]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#65e8ff]">group</span>
                        {course.seats || '24 Seats'} Cohort
                      </span>
                      <span className="flex items-center gap-1 text-[#b5c4ff]">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        {course.rating || '4.95'} Rating
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#65e8ff]">{course.code || 'CRS-09'}</span>
                        <span className="w-1 h-1 rounded-full bg-[#434655]" />
                        <span className="text-[12px] text-[#a6b1c5] uppercase font-mono">{course.category}</span>
                      </div>
                      <h3 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold group-hover:text-[#65e8ff] transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-[13px] text-[#a6b1c5] line-clamp-2 leading-relaxed">
                        {course.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {course.technologies?.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-[#161b2a] border border-[#252a39] font-mono text-[11px] text-[#dee2f6]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <div className="flex items-center justify-between text-[#a6b1c5] text-[13px]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-[#65e8ff]">code_blocks</span>
                          {course.curriculum?.length || 4} Live Capstones
                        </span>
                        <span className="text-[#dee2f6] font-['Geist'] text-[18px] font-bold">
                          {course.price || '$1,200'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setOpenCurriculumId(isCurriculumOpen ? null : course.id)}
                          className="w-full py-2 px-3 rounded-lg bg-[#252a39] hover:bg-[#343949] text-[#dee2f6] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#434655]/30"
                        >
                          <span className="material-symbols-outlined text-[16px]">menu_book</span>
                          <span>Curriculum</span>
                        </button>

                        <button
                          onClick={() => handleOpenEnrollModal(course)}
                          className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] text-[13px] font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(101,232,255,0.3)] hover:shadow-[0_0_20px_rgba(101,232,255,0.6)] active:scale-95 transition-all cursor-pointer"
                        >
                          <span>Enroll</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Curriculum Drawer */}
                  {isCurriculumOpen && (
                    <div className="bg-[#161b2a] border-t border-[#65e8ff]/20 p-6 flex flex-col gap-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-[#252a39]">
                        <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-wider font-bold">
                          Curriculum Breakdown
                        </span>
                        <button
                          onClick={() => setOpenCurriculumId(null)}
                          className="text-[#a6b1c5] hover:text-[#dee2f6]"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>

                      <div className="space-y-2.5 text-[13px] text-[#a6b1c5]">
                        {course.curriculum && course.curriculum.length > 0 ? (
                          course.curriculum.map((cModule, mIdx) => (
                            <div key={mIdx} className="p-3 rounded bg-[#090e1c] border border-[#252a39] flex flex-col gap-1">
                              <span className="font-bold text-[#dee2f6]">{cModule.module}</span>
                              <span className="text-[12px]">{cModule.topics}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 rounded bg-[#090e1c] border border-[#252a39] flex flex-col gap-1">
                            <span className="font-bold text-[#dee2f6]">Core Modules & Hands-on Labs</span>
                            <span className="text-[12px]">Complete syllabus provisioned in cohort repo.</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[#a6b1c5] font-mono text-[11px]">
                        <span>Next Cohort: {course.cohortStartDate || 'Oct 14, 2026'}</span>
                        <span className="text-[#65e8ff]">{course.schedule || 'Live Interactive'}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navioraa Training Methodology */}
      <div className="w-full bg-[#10182b] py-24 my-16 border-y border-[#434655]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col gap-3 mb-16">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#65e8ff]" />
              <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-widest font-bold">
                Engineering Standard
              </span>
            </div>
            <h2 className="font-['Geist'] text-[32px] sm:text-[40px] text-[#dee2f6] font-bold tracking-tight">
              The Navioraa Training Methodology
            </h2>
            <p className="text-[16px] text-[#a6b1c5] max-w-2xl">
              We reject passive tutorial loops. Every student operates as an active contributor inside modern engineering teams with rigid pull request standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#161b2a] border border-[#252a39] flex flex-col gap-4 shadow-sm group hover:border-[#65e8ff]/30 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff]">
                <span className="material-symbols-outlined text-[26px]">record_voice_over</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold">Live 1-on-1 Mentorship</h4>
                <p className="text-[13px] text-[#a6b1c5] leading-relaxed">
                  Weekly private code audits from Principal Engineers. Unblock architecture questions instantly.
                </p>
              </div>
              <div className="mt-auto pt-2 font-mono text-[11px] text-[#65e8ff] uppercase font-bold">
                45 Min Weekly Sessions
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#161b2a] border border-[#252a39] flex flex-col gap-4 shadow-sm group hover:border-[#65e8ff]/30 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#252a39] flex items-center justify-center text-[#b5c4ff]">
                <span className="material-symbols-outlined text-[26px]">terminal</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold">Verified Capstones</h4>
                <p className="text-[13px] text-[#a6b1c5] leading-relaxed">
                  No generic clone apps. Build multi-tenant, zero-downtime, fault-tolerant platforms deployed onto live cloud infrastructure.
                </p>
              </div>
              <div className="mt-auto pt-2 font-mono text-[11px] text-[#b5c4ff] uppercase font-bold">
                Industry Rigor SLA
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#161b2a] border border-[#252a39] flex flex-col gap-4 shadow-sm group hover:border-[#65e8ff]/30 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#252a39] flex items-center justify-center text-[#65e8ff]">
                <span className="material-symbols-outlined text-[26px]">schema</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold">Production Git Portfolio</h4>
                <p className="text-[13px] text-[#a6b1c5] leading-relaxed">
                  Graduate with verifiable commits, semantic release notes, automated unit tests, and CI/CD pipelines visible on your public GitHub.
                </p>
              </div>
              <div className="mt-auto pt-2 font-mono text-[11px] text-[#65e8ff] uppercase font-bold">
                Audited Commits
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#161b2a] border border-[#252a39] flex flex-col gap-4 shadow-sm group hover:border-[#65e8ff]/30 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#252a39] flex items-center justify-center text-[#b5c4ff]">
                <span className="material-symbols-outlined text-[26px]">psychology</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold">Interview Prep Drills</h4>
                <p className="text-[13px] text-[#a6b1c5] leading-relaxed">
                  Mock algorithmic coding challenges, distributed system design whiteboarding, and technical communication coaching.
                </p>
              </div>
              <div className="mt-auto pt-2 font-mono text-[11px] text-[#b5c4ff] uppercase font-bold">
                94.2% Placement Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Upskilling CTA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full">
        <div className="p-10 lg:p-14 rounded-2xl bg-[#10182b] border border-[#434655]/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#65e8ff]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-3 max-w-xl z-10">
            <span className="font-mono text-[11px] text-[#65e8ff] uppercase tracking-widest font-bold">
              Corporate & Enterprise Teams
            </span>
            <h3 className="font-['Geist'] text-[30px] sm:text-[36px] text-[#dee2f6] font-bold">
              Upskill Your Entire Engineering Department
            </h3>
            <p className="text-[15px] text-[#a6b1c5] leading-relaxed">
              We architect customized corporate cohorts tailored specifically to your company's proprietary tech stack, CI/CD pipeline, and security governance standards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full lg:w-auto">
            <button
              onClick={() => {
                navigate('/contact');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[14px] shadow-[0_0_16px_rgba(101,232,255,0.4)] hover:shadow-[0_0_24px_rgba(101,232,255,0.7)] transition-all cursor-pointer"
            >
              Request Enterprise Demo
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#252a39] hover:bg-[#343949] text-[#dee2f6] font-semibold text-[14px] transition-colors cursor-pointer border border-[#434655]/30"
            >
              Talk to Program Director
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Enrollment / Admissions Modal */}
      {selectedCourseForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090e1c]/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-xl bg-[#10182b] border border-[#65e8ff]/30 p-8 shadow-2xl flex flex-col gap-4">
            <button
              onClick={handleCloseEnrollModal}
              className="absolute top-4 right-4 text-[#a6b1c5] hover:text-[#dee2f6] p-1 rounded"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {!enrollmentSuccess ? (
              <>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#65e8ff] animate-pulse" />
                    <span className="font-mono text-[11px] text-[#65e8ff] uppercase font-bold">
                      Admissions Form
                    </span>
                  </div>
                  <h3 className="font-['Geist'] text-[24px] text-[#dee2f6] font-bold">
                    Register: {selectedCourseForModal.title}
                  </h3>
                  <p className="text-[13px] text-[#a6b1c5]">
                    Reserve your place in the upcoming cohort. Our technical admissions director will review your profile within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleEnrollSubmit} className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Alex Vance"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161b2a] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Professional Email *</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="alex.vance@company.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#161b2a] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Years Experience</label>
                      <select
                        value={applicantExp}
                        onChange={(e) => setApplicantExp(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#161b2a] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      >
                        <option value="0-1">0 - 1 Years</option>
                        <option value="1-3">1 - 3 Years</option>
                        <option value="3-5">3 - 5 Years</option>
                        <option value="5+">5+ Years</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Study Pace</label>
                      <select
                        value={studyPace}
                        onChange={(e) => setStudyPace(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#161b2a] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      >
                        <option value="part-time">Part-Time (Evenings)</option>
                        <option value="intensive">Full-Time Intensive</option>
                        <option value="corporate">Corporate Sponsored</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="termsConduct"
                      required
                      className="w-4 h-4 rounded bg-[#161b2a] border-[#252a39] text-[#65e8ff] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="termsConduct" className="text-[12px] text-[#a6b1c5] cursor-pointer">
                      I agree to the cohort code of conduct and attendance SLA.
                    </label>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCloseEnrollModal}
                      className="px-4 py-2.5 rounded-lg bg-[#252a39] text-[#a6b1c5] hover:text-[#dee2f6] text-[13px] font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-[0_0_16px_rgba(101,232,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#65e8ff]/20 text-[#65e8ff] flex items-center justify-center border border-[#65e8ff]/40">
                  <span className="material-symbols-outlined text-[32px]">check_circle</span>
                </div>
                <h4 className="font-['Geist'] text-[22px] text-[#dee2f6] font-bold">
                  Registration Transmitted
                </h4>
                <p className="text-[14px] text-[#a6b1c5] leading-relaxed">
                  Your application for <strong className="text-[#dee2f6]">{selectedCourseForModal.title}</strong> has been stored in Firestore. Our admissions staff has dispatched confirmation credentials to your inbox.
                </p>
                <button
                  onClick={handleCloseEnrollModal}
                  className="mt-4 px-6 py-2 rounded-lg bg-[#252a39] hover:bg-[#343949] text-[#dee2f6] font-semibold text-[13px] transition-colors cursor-pointer"
                >
                  Dismiss Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
