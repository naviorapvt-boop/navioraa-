import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { createTeamAdmin, db, grantExistingTeamAdmin, revokeTeamAdminAccess, sendPasswordReset } from '../../firebase';
import { Course, Service, Project, Resource, TeamMember, ContactInquiry } from '../../types';

interface AdminDashboardProps {
  navigate: (path: string) => void;
  subPath?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate, subPath }) => {
  const { user, isAdmin, loading, logout } = useAuth();
  const isPrimaryOwner = user?.email?.toLowerCase() === 'naviora.pvt@gmail.com';
  const {
    siteSettings,
    services,
    courses,
    projects,
    resources,
    teamMembers,
    inquiries,
    auditLogs,
    isSyncing,
    updateSiteSettings,
    addCourse,
    updateCourse,
    deleteCourse,
    toggleCourseStatus,
    addService,
    updateService,
    deleteService,
    toggleServiceStatus,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectStatus,
    addResource,
    updateResource,
    deleteResource,
    toggleResourceStatus,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    toggleTeamMemberStatus,
    updateInquiryStatus,
    deleteInquiry
  } = useData();

  useEffect(() => {
    if (!loading && !isAdmin) navigate('/login');
  }, [loading, isAdmin, navigate]);

  // Active tab selection
  const initialTab =
    subPath === 'homepage'
      ? 'homepage'
      : subPath === 'services'
      ? 'services'
      : subPath === 'courses'
      ? 'courses'
      : subPath === 'projects'
      ? 'projects'
      : subPath === 'resources'
      ? 'resources'
      : subPath === 'team'
      ? 'team'
      : subPath === 'inquiries'
      ? 'inquiries'
      : subPath === 'access' && isPrimaryOwner
      ? 'access'
      : subPath === 'settings'
      ? 'settings'
      : 'courses';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [courseFilter, setCourseFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUsers, setAdminUsers] = useState<{ id: string; uid?: string; email: string; role?: string }[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [existingAdminEmail, setExistingAdminEmail] = useState('');
  const [existingAdminUid, setExistingAdminUid] = useState('');
  const [existingAdminName, setExistingAdminName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [accessFeedback, setAccessFeedback] = useState('');
  const [accessBusy, setAccessBusy] = useState(false);

  // Course Modal state (Create / Edit)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseFormTitle, setCourseFormTitle] = useState('');
  const [courseFormCode, setCourseFormCode] = useState('');
  const [courseFormDuration, setCourseFormDuration] = useState('');
  const [courseFormHours, setCourseFormHours] = useState('');
  const [courseFormPrice, setCourseFormPrice] = useState('$1,200');
  const [courseFormDifficulty, setCourseFormDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Enterprise'>('Intermediate');
  const [courseFormCategory, setCourseFormCategory] = useState('cloud-devops');
  const [courseFormTags, setCourseFormTags] = useState('');
  const [courseFormShortDesc, setCourseFormShortDesc] = useState('');
  const [courseFormFullDesc, setCourseFormFullDesc] = useState('');
  const [courseFormImageUrl, setCourseFormImageUrl] = useState('');
  const [courseFormPublish, setCourseFormPublish] = useState(true);

  // Service Modal state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceFormTitle, setServiceFormTitle] = useState('');
  const [serviceFormCategory, setServiceFormCategory] = useState('custom-software');
  const [serviceFormShortDesc, setServiceFormShortDesc] = useState('');
  const [serviceFormTags, setServiceFormTags] = useState('');
  const [serviceFormPublish, setServiceFormPublish] = useState(true);

  // Project Modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectFormTitle, setProjectFormTitle] = useState('');
  const [projectFormCategory, setProjectFormCategory] = useState('AI Applications');
  const [projectFormDesc, setProjectFormDesc] = useState('');
  const [projectFormTags, setProjectFormTags] = useState('');
  const [projectFormDemoUrl, setProjectFormDemoUrl] = useState('');
  const [projectFormPublish, setProjectFormPublish] = useState(true);

  // Resource Modal state
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [resourceFormTitle, setResourceFormTitle] = useState('');
  const [resourceFormCategory, setResourceFormCategory] = useState('Engineering Notes');
  const [resourceFormDesc, setResourceFormDesc] = useState('');
  const [resourceFormUrl, setResourceFormUrl] = useState('');
  const [resourceFormType, setResourceFormType] = useState('PDF Document');

  // Team Modal state
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamFormName, setTeamFormName] = useState('');
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamFormRole, setTeamFormRole] = useState('');
  const [teamFormBio, setTeamFormBio] = useState('');
  const [teamFormSkills, setTeamFormSkills] = useState('');
  const [teamFormPhoto, setTeamFormPhoto] = useState('');
  const [teamFormLinkedin, setTeamFormLinkedin] = useState('');

  // Settings state
  const [settingsName, setSettingsName] = useState(siteSettings.siteName || 'NAVIORAA');
  const [settingsTagline, setSettingsTagline] = useState(siteSettings.tagline || 'Learn. Build. Create. Grow.');
  const [settingsEmail, setSettingsEmail] = useState(siteSettings.contactEmail || 'naviora.pvt@gmail.com');
  const [settingsPhone, setSettingsPhone] = useState(siteSettings.contactPhone || '+91 98901 87383');
  const [settingsWhatsapp, setSettingsWhatsapp] = useState(siteSettings.whatsappNumber || '+919890187383');
  const [settingsHeroTitle, setSettingsHeroTitle] = useState(siteSettings.heroHeadline || 'Turn Your Ideas Into Real-World Technology.');
  const [settingsHeroDesc, setSettingsHeroDesc] = useState(siteSettings.heroDescription || 'Learn in-demand IT skills, build practical enterprise-grade projects...');

  useEffect(() => {
    setSettingsEmail(siteSettings.contactEmail || 'naviora.pvt@gmail.com');
    setSettingsPhone(siteSettings.contactPhone || '+91 98901 87383');
    setSettingsWhatsapp(siteSettings.whatsappNumber || '+919890187383');
  }, [siteSettings.contactEmail, siteSettings.contactPhone, siteSettings.whatsappNumber]);

  // Metrics calculations
  const publishedServicesCount = services.filter(s => s.status === 'published').length;
  const draftServicesCount = services.filter(s => s.status === 'draft').length;
  const publishedCoursesCount = courses.filter(c => c.status === 'published').length;
  const draftCoursesCount = courses.filter(c => c.status === 'draft').length;
  const publishedProjectsCount = projects.filter(p => p.status === 'published').length;
  const unresolvedInquiries = inquiries.filter(i => i.status !== 'Resolved');
  const inquiryStatusCounts = {
    new: inquiries.filter(inquiry => inquiry.status === 'New').length,
    inProgress: inquiries.filter(inquiry => inquiry.status === 'In Progress').length,
    resolved: inquiries.filter(inquiry => inquiry.status === 'Resolved').length
  };
  const inquiryTypeCounts = inquiries.reduce<Record<string, number>>((counts, inquiry) => {
    const type = inquiry.inquiryType || 'General Inquiry';
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});
  const inquiryTypesByVolume = Object.entries(inquiryTypeCounts).sort((left, right) => right[1] - left[1]);
  const recentInquiryCount = inquiries.filter(inquiry =>
    Date.now() - new Date(inquiry.createdAt).getTime() <= 30 * 24 * 60 * 60 * 1000
  ).length;

  useEffect(() => {
    if (!isAdmin || !isPrimaryOwner) return;
    return onSnapshot(collection(db, 'admins'), snapshot => {
      const uniqueAdmins = new Map<string, { id: string; uid?: string; email: string; role?: string }>();
      uniqueAdmins.set('naviora.pvt@gmail.com', {
        id: 'owner',
        email: 'naviora.pvt@gmail.com',
        role: 'Owner'
      });
      snapshot.docs.forEach(adminDoc => {
        const data = adminDoc.data();
        if (typeof data.email === 'string' && data.email.includes('@')) {
          uniqueAdmins.set(data.email.toLowerCase(), {
            id: adminDoc.id,
            uid: typeof data.uid === 'string' ? data.uid : adminDoc.id,
            email: data.email,
            role: typeof data.role === 'string' ? data.role : 'admin'
          });
        }
      });
      setAdminUsers([...uniqueAdmins.values()].sort((left, right) => left.email.localeCompare(right.email)));
    }, () => setAccessFeedback('Could not load administrator access details.'));
  }, [isAdmin, isPrimaryOwner]);

  if (loading || !isAdmin) {
    return <div className="min-h-screen bg-[#0e1321]" aria-live="polite" />;
  }

  const handleCreateTeamAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAccessBusy(true);
    setAccessFeedback('');
    try {
      await createTeamAdmin(newAdminEmail.trim(), newAdminPassword, newAdminName.trim());
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminPassword('');
      setAccessFeedback('Team account created. Firebase has sent an email verification link. The member can access the admin panel after verifying their email.');
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : '';
      setAccessFeedback(code.endsWith('/already-exists')
        ? 'An account with that email already exists.'
        : code.endsWith('/email-already-in-use')
          ? 'An account with that email already exists.'
        : code.endsWith('/permission-denied')
          ? 'Only the primary Google admin can create team accounts.'
          : 'Could not create the account. Check the email and use a password of at least 10 characters.');
    } finally {
      setAccessBusy(false);
    }
  };

  const handleGrantExistingTeamAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAccessBusy(true);
    setAccessFeedback('');
    try {
      await grantExistingTeamAdmin(existingAdminEmail, existingAdminUid, existingAdminName);
      setExistingAdminEmail('');
      setExistingAdminUid('');
      setExistingAdminName('');
      setAccessFeedback('Existing account granted team admin access. The member can now sign in with their existing verified email and password.');
    } catch (error) {
      setAccessFeedback(error instanceof Error
        ? error.message
        : 'Could not grant access. Confirm the email and UID in Firebase Authentication.');
    } finally {
      setAccessBusy(false);
    }
  };

  const handleSendPasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setAccessBusy(true);
    setAccessFeedback('');
    try {
      await sendPasswordReset(resetEmail.trim());
      setAccessFeedback(`Password reset email sent to ${resetEmail.trim()}.`);
      setResetEmail('');
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : '';
      setAccessFeedback(code.endsWith('/failed-precondition')
        ? 'This account uses Google sign-in and has no Firebase password to reset.'
        : 'Could not send a reset email. Confirm the account and mail settings.');
    } finally {
      setAccessBusy(false);
    }
  };

  const handleRevokeTeamAdmin = async (admin: { email: string; uid?: string }) => {
    if (!confirm(`Revoke admin portal access for ${admin.email}? They will no longer be able to access inquiries or admin tools.`)) return;
    setAccessBusy(true);
    setAccessFeedback('');
    try {
      await revokeTeamAdminAccess(admin.email, admin.uid);
      setAccessFeedback(`Portal access revoked for ${admin.email}. The Firebase Authentication account itself remains and can be deleted separately in Firebase Console.`);
    } catch {
      setAccessFeedback('Could not revoke access. Confirm that you are signed in as the primary owner.');
    } finally {
      setAccessBusy(false);
    }
  };

  const handleExportInquiries = () => {
    const columns: (keyof ContactInquiry)[] = [
      'id', 'createdAt', 'name', 'email', 'phone', 'inquiryType', 'subject',
      'message', 'budget', 'timeline', 'services', 'status', 'adminNotes'
    ];
    const escapeCsv = (value: unknown) => {
      const text = Array.isArray(value) ? value.join('; ') : value == null ? '' : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };
    const csv = [
      columns.join(','),
      ...inquiries.map(inquiry => columns.map(column => escapeCsv(inquiry[column])).join(','))
    ].join('\r\n');
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `navioraa-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Filtered courses
  const filteredCourses = courses.filter(c => {
    const matchesFilter = courseFilter === 'all' || c.status === courseFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      c.title.toLowerCase().includes(query) ||
      (c.code && c.code.toLowerCase().includes(query)) ||
      c.technologies?.some(t => t.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  // Course Modal handlers
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseFormTitle('');
    setCourseFormCode(`CRS-${Math.floor(100 + Math.random() * 900)}`);
    setCourseFormDuration('8 Weeks (60h)');
    setCourseFormHours('60h');
    setCourseFormPrice('$1,200');
    setCourseFormDifficulty('Intermediate');
    setCourseFormCategory('cloud-devops');
    setCourseFormTags('Docker, Kubernetes, Cloud');
    setCourseFormShortDesc('Modular enterprise training with production capstone projects.');
    setCourseFormFullDesc('Complete syllabus with hands-on architectural design.');
    setCourseFormImageUrl('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80');
    setCourseFormPublish(true);
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseFormTitle(course.title);
    setCourseFormCode(course.code || 'CRS-091');
    setCourseFormDuration(course.duration);
    setCourseFormHours(course.hours || '60h');
    setCourseFormPrice(course.price || '$1,200');
    setCourseFormDifficulty(course.difficulty || 'Intermediate');
    setCourseFormCategory(course.category || 'cloud-devops');
    setCourseFormTags(course.technologies ? course.technologies.join(', ') : '');
    setCourseFormShortDesc(course.shortDescription);
    setCourseFormFullDesc(course.description || course.shortDescription);
    setCourseFormImageUrl(course.imageUrl || '');
    setCourseFormPublish(course.status === 'published');
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = courseFormTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingCourse) {
      await updateCourse(editingCourse.id, {
        title: courseFormTitle,
        code: courseFormCode,
        duration: courseFormDuration,
        hours: courseFormHours,
        price: courseFormPrice,
        difficulty: courseFormDifficulty,
        category: courseFormCategory,
        technologies: tagArray,
        shortDescription: courseFormShortDesc,
        description: courseFormFullDesc,
        imageUrl: courseFormImageUrl,
        status: courseFormPublish ? 'published' : 'draft'
      });
    } else {
      await addCourse({
        title: courseFormTitle,
        code: courseFormCode,
        slug: courseFormTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        duration: courseFormDuration,
        hours: courseFormHours,
        seats: '24 Seats',
        rating: '4.95',
        price: courseFormPrice,
        difficulty: courseFormDifficulty,
        category: courseFormCategory,
        technologies: tagArray,
        shortDescription: courseFormShortDesc,
        description: courseFormFullDesc,
        curriculum: [
          { module: 'Module 1-3: Core Foundations & Runtime', topics: 'Syntax, memory management, and typing models.' },
          { module: 'Module 4-8: Microservice Architecture', topics: 'APIs, persistence, caching, and unit testing.' },
          { module: 'Module 9-12: Production CI/CD Deployment', topics: 'Containers, cloud deployment, and live capstone.' }
        ],
        imageUrl: courseFormImageUrl,
        featured: true,
        status: courseFormPublish ? 'published' : 'draft',
        sortOrder: courses.length + 1
      });
    }

    setIsCourseModalOpen(false);
  };

  const handleCloneCourse = async (course: Course) => {
    await addCourse({
      ...course,
      code: `${course.code}-COPY`,
      title: `${course.title} (Clone)`,
      slug: `${course.slug}-clone`,
      status: 'draft',
      sortOrder: courses.length + 1
    });
  };

  // Image Upload handler (supports file upload with base64 data URL)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings({
      siteName: settingsName,
      tagline: settingsTagline,
      contactEmail: settingsEmail,
      contactPhone: settingsPhone,
      whatsappNumber: settingsWhatsapp,
      heroHeadline: settingsHeroTitle,
      heroDescription: settingsHeroDesc
    });
    alert('Settings saved.');
  };

  return (
    <div
      className="min-h-screen bg-[#0e1321] text-[#dee2f6] flex flex-col antialiased"
      onMouseMove={event => {
        if (event.clientX <= 12) setSidebarOpen(true);
      }}
    >
      <div
        className="fixed left-0 top-0 bottom-0 w-3 z-40"
        onMouseEnter={() => setSidebarOpen(true)}
        aria-hidden="true"
      />
      <aside
        onMouseLeave={() => setSidebarOpen(false)}
        className={`fixed left-0 top-0 h-full w-[min(18rem,88vw)] bg-[#090e1c] z-50 flex flex-col pt-6 pb-6 border-r border-[#434655]/20 shadow-2xl transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#252a39] flex items-center justify-center border border-[#65e8ff]/30">
            <div className="w-3 h-3 rounded-full bg-[#65e8ff] shadow-[0_0_8px_rgba(101,232,255,0.8)]" />
          </div>
          <div className="flex flex-col">
            <span className="font-['Geist'] text-[18px] text-[#dee2f6] tracking-tight font-bold">
              {siteSettings.siteName || 'NAVIORAA'}
            </span>
            <span className="font-mono text-[10px] text-[#65e8ff] tracking-wider uppercase font-semibold">
              Admin Panel
            </span>
          </div>
        </div>

        <div className="px-4 mb-2">
          <span className="font-mono text-[11px] text-[#a6b1c5] uppercase tracking-wider px-2">
            Core Modules
          </span>
        </div>

        {/* Sidebar Nav */}
        <nav onClick={() => setSidebarOpen(false)} className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'courses' ? 'bg-[#252a39] text-[#65e8ff]' : 'text-[#c3c5d7] hover:bg-[#161b2a] hover:text-[#dee2f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">school</span>
            <span>Academy LMS</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'services' ? 'bg-[#252a39] text-[#65e8ff]' : 'text-[#c3c5d7] hover:bg-[#161b2a] hover:text-[#dee2f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">cloud_done</span>
            <span>Cloud Clusters</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'projects' ? 'bg-[#252a39] text-[#65e8ff]' : 'text-[#c3c5d7] hover:bg-[#161b2a] hover:text-[#dee2f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            <span>Showcase Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'resources' ? 'bg-[#252a39] text-[#65e8ff]' : 'text-[#c3c5d7] hover:bg-[#161b2a] hover:text-[#dee2f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            <span>Learning Docs</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'team' ? 'bg-[#252a39] text-[#65e8ff]' : 'text-[#c3c5d7] hover:bg-[#161b2a] hover:text-[#dee2f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span>Team & Faculty</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'inquiries' ? 'bg-[#252a39] text-[#65e8ff]' : 'text-[#c3c5d7] hover:bg-[#161b2a] hover:text-[#dee2f6]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">mark_chat_unread</span>
              <span>Inquiries Queue</span>
            </div>
            {unresolvedInquiries.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#93000a] text-[#ffdad6] font-mono text-[10px] font-bold">
                {unresolvedInquiries.length}
              </span>
            )}
          </button>

          {isPrimaryOwner && (
            <button
              onClick={() => setActiveTab('access')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] font-semibold transition-colors cursor-pointer ${
                activeTab === 'access' ? 'bg-[#252a39] text-[#65e8ff]' : 'text-[#c3c5d7] hover:bg-[#161b2a] hover:text-[#dee2f6]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
              <span>Admin Access</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('homepage')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'homepage' ? 'bg-[#252a39] text-[#65e8ff]' : 'text-[#c3c5d7] hover:bg-[#161b2a] hover:text-[#dee2f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard_customize</span>
            <span>Homepage CMS</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#252a39] text-[#65e8ff]' : 'text-[#c3c5d7] hover:bg-[#161b2a] hover:text-[#dee2f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <span>Site Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[14px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'audit' ? 'bg-[#252a39] text-[#65e8ff]' : 'text-[#c3c5d7] hover:bg-[#161b2a] hover:text-[#dee2f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">policy</span>
            <span>Security Vault</span>
          </button>
        </nav>

      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#0e1321]/95 backdrop-blur-xl border-b border-[#252a39] flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(open => !open)}
              className="relative z-[60] mr-2 p-2 rounded-lg text-[#dee2f6] hover:bg-[#252a39] hover:text-[#65e8ff] transition-colors"
              aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'}
              title="Admin menu"
            >
              <span className="material-symbols-outlined text-[22px]">{sidebarOpen ? 'close' : 'menu'}</span>
            </button>
            <span className="font-mono text-[13px] text-[#65e8ff] font-semibold">Navioraa Admin</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden sm:flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#a6b1c5] text-[18px]">search</span>
              <input
                type="text"
                placeholder="Query systems, services, logs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-[#161b2a] text-[#dee2f6] text-[13px] pl-10 pr-4 py-1.5 rounded-lg border border-[#252a39] focus:outline-none focus:border-[#65e8ff] w-64 placeholder:text-[#8d90a0]"
              />
            </div>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-[#a6b1c5] hover:text-[#65e8ff] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              <span>Public Site</span>
            </button>

            <div className="hidden sm:flex w-8 h-8 rounded-full bg-[#658aff] items-center justify-center text-[#00164e] font-bold text-xs">
              {user?.email?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="p-6 lg:p-10 flex flex-col gap-6 w-full">
          {/* Top Command & Status Bar */}
          <section className="w-full bg-[#161b2a]/70 backdrop-blur-xl rounded-xl p-4 border border-[#252a39] shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#a6b1c5] uppercase tracking-widest">
                  Administrator workspace
                </span>
                <span className="text-[#434655] font-mono text-[11px]">/</span>
                <span className="text-[13px] font-semibold text-[#65e8ff] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#65e8ff] shadow-[0_0_8px_rgba(101,232,255,0.9)] animate-pulse" />
                  Content management
                </span>
              </div>

              <div className="pt-1 text-[12px] text-[#a6b1c5]">
                {isSyncing ? 'Saving changes…' : `${inquiries.length} inquiries received`}
              </div>
            </div>

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-[#1a1f2e] px-3.5 py-1.5 rounded-lg border border-[#252a39]">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-[#252a39] flex items-center justify-center text-[#65e8ff] font-bold text-xs border border-[#65e8ff]/30">
                    {user?.email ? user.email.substring(0, 2).toUpperCase() : 'AM'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#65e8ff] rounded-full ring-2 ring-[#1a1f2e]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#dee2f6]">
                      {user?.displayName || 'Navioraa Admin'}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-[#658aff]/20 text-[#658aff] font-mono text-[9px] uppercase font-bold">
                      Super Admin
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#a6b1c5]">
                    {user?.email || 'alex.mercer@navioraa.internal'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#252a39] hover:bg-[#93000a] text-[#dee2f6] hover:text-[#ffdad6] transition-all text-[13px] font-semibold cursor-pointer border border-[#434655]/30 group"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:rotate-45 transition-transform">
                  logout
                </span>
                <span>Logout</span>
              </button>
            </div>
          </section>

          {/* Metric KPI Statistics Row (4 Cards) */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Services KPI */}
            <div className="bg-[#161b2a]/90 backdrop-blur-md rounded-xl p-4 border border-[#252a39] shadow-lg flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-[#a6b1c5] uppercase tracking-wider">Modular Fleet</span>
                  <span className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold mt-1">Active Services</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#2f3444] flex items-center justify-center text-[#65e8ff]">
                  <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-['Geist'] text-[32px] font-bold leading-none text-[#dee2f6]">{publishedServicesCount}</span>
                  <span className="text-[13px] font-medium text-[#65e8ff]">Published</span>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#2f3444] text-[#bec6e0]">{draftServicesCount} Drafts</span>
              </div>
              <div className="w-full bg-[#2f3444] h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-[#658aff] to-[#65e8ff] h-full rounded-full" style={{ width: `${(publishedServicesCount / Math.max(services.length, 1)) * 100}%` }} />
              </div>
            </div>

            {/* Training Courses KPI */}
            <div className="bg-[#161b2a]/90 backdrop-blur-md rounded-xl p-4 border border-[#252a39] shadow-lg flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-[#a6b1c5] uppercase tracking-wider">Academy LMS</span>
                  <span className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold mt-1">Training Courses</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#2f3444] flex items-center justify-center text-[#b5c4ff]">
                  <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-['Geist'] text-[32px] font-bold leading-none text-[#dee2f6]">{publishedCoursesCount}</span>
                  <span className="text-[13px] font-medium text-[#b5c4ff]">Published</span>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#2f3444] text-[#bec6e0]">{draftCoursesCount} Drafts</span>
              </div>
              <div className="w-full bg-[#2f3444] h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-[#658aff] to-[#65e8ff] h-full rounded-full" style={{ width: `${(publishedCoursesCount / Math.max(courses.length, 1)) * 100}%` }} />
              </div>
            </div>

            {/* Portfolio Projects KPI */}
            <div className="bg-[#161b2a]/90 backdrop-blur-md rounded-xl p-4 border border-[#252a39] shadow-lg flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-[#a6b1c5] uppercase tracking-wider">Client Work</span>
                  <span className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold mt-1">Portfolio Projects</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#2f3444] flex items-center justify-center text-[#65e8ff]">
                  <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-['Geist'] text-[32px] font-bold leading-none text-[#dee2f6]">{publishedProjectsCount}</span>
                  <span className="text-[13px] font-medium text-[#65e8ff]">Live Showcases</span>
                </div>
                <div className="flex items-center text-[#65e8ff] gap-0.5 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  <span>100% Active</span>
                </div>
              </div>
              <div className="w-full bg-[#2f3444] h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#65e8ff] h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Client Inquiries KPI */}
            <div className="bg-[#161b2a]/90 backdrop-blur-md rounded-xl p-4 border border-[#252a39] shadow-lg flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] text-[#a6b1c5] uppercase tracking-wider">Inbound Queue</span>
                  <span className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold mt-1">Client Inquiries</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#2f3444] flex items-center justify-center text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-[22px]">forward_to_inbox</span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-['Geist'] text-[32px] font-bold leading-none text-[#dee2f6]">{unresolvedInquiries.length}</span>
                  <span className="text-[13px] font-medium text-[#ffb4ab]">New Unresolved</span>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] animate-pulse">Needs Review</span>
              </div>
              <div className="w-full bg-[#2f3444] h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-[#93000a] to-[#658aff] h-full rounded-full" style={{ width: `${Math.min(unresolvedInquiries.length * 15, 100)}%` }} />
              </div>
            </div>
          </section>

          <section className="w-full bg-[#161b2a]/90 rounded-xl p-5 sm:p-6 border border-[#252a39] shadow-lg">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <h2 className="font-['Geist'] text-[20px] font-bold text-[#dee2f6]">Inquiry report</h2>
                <p className="text-[13px] text-[#a6b1c5]">Submission volume, follow-up status, and client interest by category.</p>
              </div>
              <span className="font-mono text-[12px] text-[#a6b1c5]">{recentInquiryCount} received in the last 30 days</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'All inquiries', value: inquiries.length, color: 'text-[#dee2f6]' },
                { label: 'New', value: inquiryStatusCounts.new, color: 'text-[#ffb4ab]' },
                { label: 'In progress', value: inquiryStatusCounts.inProgress, color: 'text-[#f6c177]' },
                { label: 'Resolved', value: inquiryStatusCounts.resolved, color: 'text-[#65e8ff]' }
              ].map(metric => (
                <div key={metric.label} className="border-l-2 border-[#434655] pl-3 py-1">
                  <div className={`font-['Geist'] text-[25px] font-bold ${metric.color}`}>{metric.value}</div>
                  <div className="text-[12px] text-[#a6b1c5]">{metric.label}</div>
                </div>
              ))}
            </div>
            {inquiryTypesByVolume.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {inquiryTypesByVolume.slice(0, 6).map(([type, count]) => (
                  <div key={type}>
                    <div className="flex items-center justify-between gap-3 text-[12px] mb-1.5">
                      <span className="text-[#dee2f6] truncate">{type}</span>
                      <span className="text-[#a6b1c5] tabular-nums">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#090e1c] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#65e8ff] transition-[width] duration-500"
                        style={{ width: `${Math.max(8, (count / inquiryTypesByVolume[0][1]) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-[13px] text-[#a6b1c5]">Inquiry trends will appear after the first submission.</p>
            )}
          </section>

          {/* Interactive Navigation Tabs */}
          <section className="w-full flex items-center overflow-x-auto gap-2 pb-2">
            {[
              { id: 'courses', label: 'Courses Inventory', count: courses.length, icon: 'school' },
              { id: 'services', label: 'IT Services', count: services.length, icon: 'settings_ethernet' },
              { id: 'projects', label: 'Showcase Projects', count: projects.length, icon: 'view_quilt' },
              { id: 'resources', label: 'Learning Docs', count: resources.length, icon: 'menu_book' },
              { id: 'team', label: 'Team Faculty', count: teamMembers.length, icon: 'badge' },
              { id: 'inquiries', label: 'Recent Inquiries', count: unresolvedInquiries.length, icon: 'mark_chat_unread', alert: unresolvedInquiries.length > 0 },
              ...(isPrimaryOwner ? [{ id: 'access', label: 'Admin Access', count: adminUsers.length, icon: 'manage_accounts' }] : []),
              { id: 'homepage', label: 'Homepage CMS', icon: 'dashboard_customize' },
              { id: 'settings', label: 'Site Settings', icon: 'tune' },
              { id: 'audit', label: 'Security Audit Logs', count: auditLogs.length, icon: 'policy' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-[13px] font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-[#252a39] text-[#65e8ff] border-[#65e8ff]/40 shadow-sm'
                    : 'text-[#c3c5d7] hover:text-[#dee2f6] hover:bg-[#161b2a] border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                    tab.alert ? 'bg-[#93000a] text-[#ffdad6] font-bold' : 'bg-[#090e1c] text-[#a6b1c5]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </section>

          {/* Main Content Workspace Split: 8 cols Left, 4 cols Right */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* LEFT / MAIN WORKSPACE (8 cols) */}
            <section className="xl:col-span-8 flex flex-col gap-6">
              {/* === COURSES TAB === */}
              {activeTab === 'courses' && (
                <div className="bg-[#161b2a]/90 backdrop-blur-xl rounded-xl p-6 border border-[#252a39] shadow-xl flex flex-col">
                  {/* Header & Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-['Geist'] text-[24px] text-[#dee2f6] font-bold tracking-tight">
                          Courses Catalog & Curricula
                        </h2>
                        <span className="px-2 py-0.5 rounded bg-[#252a39] text-[#65e8ff] font-mono text-[11px] border border-[#65e8ff]/20">
                          LIVE SYNC ON
                        </span>
                      </div>
                      <p className="text-[13px] text-[#a6b1c5] mt-1">
                        Manage modular cohort courses, instructional materials, and real-time storefront enrollment toggles.
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddCourse}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-[0_0_16px_rgba(41,217,242,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>+ New Course</span>
                    </button>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#090e1c]/80 rounded-lg mb-4 border border-[#252a39]">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <span className="material-symbols-outlined text-[#8d90a0] text-[18px]">filter_alt</span>
                      <div className="relative w-full max-w-xs">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Filter title, ID or tech stack..."
                          className="w-full bg-[#161b2a] text-[#dee2f6] text-[13px] pl-8 pr-3 py-1.5 rounded-lg border border-[#252a39] placeholder:text-[#8d90a0] focus:outline-none focus:border-[#65e8ff]"
                        />
                        <span className="material-symbols-outlined absolute left-2 top-2 text-[#8d90a0] text-[16px]">search</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-[#161b2a] p-1 rounded-lg border border-[#252a39]">
                      <button
                        onClick={() => setCourseFilter('all')}
                        className={`px-3 py-1 rounded text-[12px] font-semibold transition-colors cursor-pointer ${
                          courseFilter === 'all' ? 'bg-[#65e8ff] text-[#090e1c] font-bold' : 'text-[#a6b1c5] hover:text-[#dee2f6]'
                        }`}
                      >
                        All ({courses.length})
                      </button>
                      <button
                        onClick={() => setCourseFilter('published')}
                        className={`px-3 py-1 rounded text-[12px] font-semibold transition-colors cursor-pointer ${
                          courseFilter === 'published' ? 'bg-[#65e8ff] text-[#090e1c] font-bold' : 'text-[#a6b1c5] hover:text-[#dee2f6]'
                        }`}
                      >
                        Published ({publishedCoursesCount})
                      </button>
                      <button
                        onClick={() => setCourseFilter('draft')}
                        className={`px-3 py-1 rounded text-[12px] font-semibold transition-colors cursor-pointer ${
                          courseFilter === 'draft' ? 'bg-[#65e8ff] text-[#090e1c] font-bold' : 'text-[#a6b1c5] hover:text-[#dee2f6]'
                        }`}
                      >
                        Draft ({draftCoursesCount})
                      </button>
                    </div>
                  </div>

                  {/* Courses Management Table */}
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#090e1c]/50 text-[#a6b1c5] font-mono text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4 rounded-l-lg">ID / Course</th>
                          <th className="py-3 px-3">Duration</th>
                          <th className="py-3 px-3">Tech Matrix</th>
                          <th className="py-3 px-3">Visibility</th>
                          <th className="py-3 px-3 text-right rounded-r-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#252a39]/60 text-[13px]">
                        {filteredCourses.map((course) => {
                          const isPublished = course.status === 'published';

                          return (
                            <tr
                              key={course.id}
                              className={`hover:bg-[#1a1f2e]/40 transition-colors group ${
                                !isPublished ? 'opacity-85' : ''
                              }`}
                            >
                              {/* ID / Course */}
                              <td className="py-3 px-4">
                                <div className="flex items-start gap-3">
                                  <img
                                    src={course.imageUrl}
                                    alt={course.title}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-md border border-[#252a39]"
                                  />
                                  <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono text-[11px] text-[#65e8ff]">{course.code || 'CRS-09'}</span>
                                      <span className="w-1 h-1 rounded-full bg-[#434655]" />
                                      <span className="font-mono text-[10px] text-[#bec6e0] uppercase">{course.difficulty}</span>
                                    </div>
                                    <span className="font-['Geist'] text-[15px] text-[#dee2f6] font-semibold truncate group-hover:text-[#65e8ff] transition-colors max-w-[280px]">
                                      {course.title}
                                    </span>
                                    <span className="text-[#a6b1c5] text-[12px] truncate max-w-[280px]">
                                      {course.shortDescription}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Duration */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="flex items-center gap-1 text-[#dee2f6]">
                                  <span className="material-symbols-outlined text-[16px] text-[#b5c4ff]">schedule</span>
                                  <span className="font-mono text-[12px]">{course.duration} ({course.hours || '60h'})</span>
                                </div>
                              </td>

                              {/* Tech Matrix */}
                              <td className="py-3 px-3">
                                <div className="flex flex-wrap gap-1 max-w-[190px]">
                                  {course.technologies?.slice(0, 3).map((t) => (
                                    <span
                                      key={t}
                                      className="px-2 py-0.5 rounded bg-[#090e1c] border border-[#252a39] text-[#65e8ff] font-mono text-[10px]"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </td>

                              {/* Status Toggle */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleCourseStatus(course.id)}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                      isPublished ? 'bg-[#00cee7]' : 'bg-[#2f3444]'
                                    }`}
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#090e1c] shadow ring-0 transition duration-200 ease-in-out ${
                                        isPublished ? 'translate-x-4' : 'translate-x-0.5'
                                      }`}
                                    />
                                  </button>
                                  <span
                                    className={`font-mono text-[11px] font-medium ${
                                      isPublished ? 'text-[#65e8ff]' : 'text-[#a6b1c5]'
                                    }`}
                                  >
                                    {isPublished ? 'Published' : 'Draft (Hidden)'}
                                  </span>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleOpenEditCourse(course)}
                                    className="p-1.5 rounded-lg text-[#a6b1c5] hover:text-[#65e8ff] hover:bg-[#252a39] transition-colors cursor-pointer"
                                    title="Edit Course Content"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                  </button>
                                  <button
                                    onClick={() => handleCloneCourse(course)}
                                    className="p-1.5 rounded-lg text-[#a6b1c5] hover:text-[#b5c4ff] hover:bg-[#252a39] transition-colors cursor-pointer"
                                    title="Clone Module"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Archive / Delete course "${course.title}"?`)) {
                                        deleteCourse(course.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-[#a6b1c5] hover:text-[#ffb4ab] hover:bg-[#93000a]/30 transition-colors cursor-pointer"
                                    title="Archive Course"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-3 border-t border-[#252a39] text-[#a6b1c5] font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <span>Showing <strong className="text-[#dee2f6]">{filteredCourses.length} of {courses.length}</strong> course modules</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#65e8ff]" />
                      <span>Collection: <span className="text-[#65e8ff]">/courses</span></span>
                    </div>
                  </div>
                </div>
              )}

              {/* === SERVICES TAB === */}
              {activeTab === 'services' && (
                <div className="bg-[#161b2a]/90 backdrop-blur-xl rounded-xl p-6 border border-[#252a39] shadow-xl flex flex-col">
                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <h2 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6]">IT Enterprise Services</h2>
                      <p className="text-[13px] text-[#a6b1c5]">Edit service capabilities, tech stacks, and publication toggles.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingService(null);
                        setServiceFormTitle('');
                        setServiceFormCategory('custom-software');
                        setServiceFormShortDesc('');
                        setServiceFormTags('Python, Go, Docker');
                        setServiceFormPublish(true);
                        setIsServiceModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-sm cursor-pointer"
                    >
                      + New Service
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map(svc => (
                      <div key={svc.id} className="p-4 rounded-xl bg-[#090e1c] border border-[#252a39] flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[10px] text-[#65e8ff] uppercase">{svc.category}</span>
                            <button
                              onClick={() => toggleServiceStatus(svc.id)}
                              className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold cursor-pointer ${
                                svc.status === 'published' ? 'bg-[#00cee7]/20 text-[#00cee7]' : 'bg-[#2f3444] text-[#a6b1c5]'
                              }`}
                            >
                              {svc.status === 'published' ? 'Published' : 'Draft'}
                            </button>
                          </div>
                          <h4 className="font-['Geist'] text-[16px] font-bold text-[#dee2f6]">{svc.title}</h4>
                          <p className="text-[12px] text-[#a6b1c5] mt-1 line-clamp-2">{svc.shortDescription}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#252a39]">
                          <span className="text-[11px] font-mono text-[#8d90a0]">{svc.technologies?.slice(0, 3).join(', ')}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingService(svc);
                                setServiceFormTitle(svc.title);
                                setServiceFormCategory(svc.category);
                                setServiceFormShortDesc(svc.shortDescription);
                                setServiceFormTags(svc.technologies?.join(', ') || '');
                                setServiceFormPublish(svc.status === 'published');
                                setIsServiceModalOpen(true);
                              }}
                              className="p-1 rounded text-[#a6b1c5] hover:text-[#65e8ff]"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete service "${svc.title}"?`)) deleteService(svc.id);
                              }}
                              className="p-1 rounded text-[#a6b1c5] hover:text-[#ffb4ab]"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === PROJECTS TAB === */}
              {activeTab === 'projects' && (
                <div className="bg-[#161b2a]/90 backdrop-blur-xl rounded-xl p-6 border border-[#252a39] shadow-xl flex flex-col">
                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <h2 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6]">Portfolio Projects</h2>
                      <p className="text-[13px] text-[#a6b1c5]">Manage showcased client and research systems.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        setProjectFormTitle('');
                        setProjectFormCategory('AI Applications');
                        setProjectFormDesc('');
                        setProjectFormTags('PyTorch, Kubernetes, FastAPI');
                        setProjectFormDemoUrl('');
                        setProjectFormPublish(true);
                        setIsProjectModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-sm cursor-pointer"
                    >
                      + New Project
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(proj => (
                      <div key={proj.id} className="p-4 rounded-xl bg-[#090e1c] border border-[#252a39] flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[10px] text-[#65e8ff]">{proj.category}</span>
                            <button
                              onClick={() => toggleProjectStatus(proj.id)}
                              className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold cursor-pointer ${
                                proj.status === 'published' ? 'bg-[#00cee7]/20 text-[#00cee7]' : 'bg-[#2f3444] text-[#a6b1c5]'
                              }`}
                            >
                              {proj.status === 'published' ? 'Published' : 'Draft'}
                            </button>
                          </div>
                          <h4 className="font-['Geist'] text-[16px] font-bold text-[#dee2f6]">{proj.title}</h4>
                          <p className="text-[12px] text-[#a6b1c5] mt-1 line-clamp-2">{proj.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#252a39]">
                          <span className="text-[11px] font-mono text-[#8d90a0]">{proj.technologies?.slice(0, 3).join(', ')}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingProject(proj);
                                setProjectFormTitle(proj.title);
                                setProjectFormCategory(proj.category);
                                setProjectFormDesc(proj.description);
                                setProjectFormTags(proj.technologies?.join(', ') || '');
                                setProjectFormDemoUrl(proj.demoUrl || '');
                                setProjectFormPublish(proj.status === 'published');
                                setIsProjectModalOpen(true);
                              }}
                              className="p-1 rounded text-[#a6b1c5] hover:text-[#65e8ff]"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete project "${proj.title}"?`)) deleteProject(proj.id);
                              }}
                              className="p-1 rounded text-[#a6b1c5] hover:text-[#ffb4ab]"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === RESOURCES TAB === */}
              {activeTab === 'resources' && (
                <div className="bg-[#161b2a]/90 backdrop-blur-xl rounded-xl p-6 border border-[#252a39] shadow-xl flex flex-col">
                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <h2 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6]">Learning Docs & Notes</h2>
                      <p className="text-[13px] text-[#a6b1c5]">Upload and manage PDFs, whitepapers, and guides.</p>
                    </div>
                    <button
                      onClick={() => {
                        setResourceFormTitle('');
                        setResourceFormCategory('Engineering Notes');
                        setResourceFormDesc('');
                        setResourceFormUrl('https://docs.navioraa.internal/notes/architecture-guide.pdf');
                        setResourceFormType('PDF Document');
                        setIsResourceModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-sm cursor-pointer"
                    >
                      + Upload Resource
                    </button>
                  </div>

                  <div className="space-y-3">
                    {resources.map(res => (
                      <div key={res.id} className="p-3.5 rounded-lg bg-[#090e1c] border border-[#252a39] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#65e8ff]">description</span>
                          <div>
                            <h4 className="text-[14px] font-bold text-[#dee2f6]">{res.title}</h4>
                            <span className="text-[11px] font-mono text-[#a6b1c5]">{res.category} • {res.fileType}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleResourceStatus(res.id)}
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold cursor-pointer ${
                              res.status === 'published' ? 'bg-[#00cee7]/20 text-[#00cee7]' : 'bg-[#2f3444] text-[#a6b1c5]'
                            }`}
                          >
                            {res.status === 'published' ? 'Published' : 'Draft'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete resource "${res.title}"?`)) deleteResource(res.id);
                            }}
                            className="text-[#a6b1c5] hover:text-[#ffb4ab]"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === TEAM TAB === */}
              {activeTab === 'team' && (
                <div className="bg-[#161b2a]/90 backdrop-blur-xl rounded-xl p-6 border border-[#252a39] shadow-xl flex flex-col">
                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <h2 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6]">Team & Faculty</h2>
                      <p className="text-[13px] text-[#a6b1c5]">Manage founder and lead instructor profiles.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTeamMember(null);
                        setTeamFormName('');
                        setTeamFormRole('Senior Systems Architect');
                        setTeamFormBio('');
                        setTeamFormSkills('Distributed Systems, Go, Kubernetes');
                        setTeamFormPhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80');
                        setTeamFormLinkedin('https://linkedin.com');
                        setIsTeamModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-sm cursor-pointer"
                    >
                      + Add Member
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamMembers.map(m => (
                      <div key={m.id} className="p-4 rounded-xl bg-[#090e1c] border border-[#252a39] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={m.photoUrl} alt={m.name} className="w-12 h-12 rounded-full object-cover border border-[#252a39]" />
                          <div>
                            <h4 className="text-[15px] font-bold text-[#dee2f6]">{m.name}</h4>
                            <span className="text-[12px] text-[#65e8ff]">{m.role}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTeamMember(m);
                              setTeamFormName(m.name);
                              setTeamFormRole(m.role);
                              setTeamFormBio(m.bio);
                              setTeamFormSkills(m.skills?.join(', ') || '');
                              setTeamFormPhoto(m.photoUrl || '');
                              setTeamFormLinkedin(m.linkedinUrl || '');
                              setIsTeamModalOpen(true);
                            }}
                            className="p-1 rounded text-[#a6b1c5] hover:text-[#65e8ff]"
                            aria-label={`Edit ${m.name}`}
                            title="Edit profile"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            onClick={() => toggleTeamMemberStatus(m.id)}
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold cursor-pointer ${
                              m.status === 'published' ? 'bg-[#00cee7]/20 text-[#00cee7]' : 'bg-[#2f3444] text-[#a6b1c5]'
                            }`}
                          >
                            {m.status === 'published' ? 'Published' : 'Draft'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete team member "${m.name}"?`)) deleteTeamMember(m.id);
                            }}
                            className="p-1 rounded text-[#a6b1c5] hover:text-[#ffb4ab]"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === INQUIRIES TAB (Full View) === */}
              {activeTab === 'inquiries' && (
                <div className="bg-[#161b2a]/90 backdrop-blur-xl rounded-xl p-6 border border-[#252a39] shadow-xl flex flex-col">
                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <h2 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6]">Client Inquiries Queue</h2>
                      <p className="text-[13px] text-[#a6b1c5]">Review and resolve RFPs, training applications, and consultations.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportInquiries}
                      disabled={!inquiries.length}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#434655] text-[#dee2f6] text-[12px] font-semibold hover:bg-[#252a39] disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Export all inquiries as an Excel-compatible CSV"
                    >
                      <span className="material-symbols-outlined text-[17px]">download</span>
                      <span>Export spreadsheet</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {inquiries.map(inq => (
                      <div key={inq.id} className="p-5 rounded-xl bg-[#090e1c] border border-[#252a39] flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-[16px] font-bold text-[#dee2f6]">{inq.name}</h4>
                              <span className="px-2 py-0.5 rounded bg-[#658aff]/20 text-[#658aff] font-mono text-[10px] uppercase font-bold">
                                {inq.inquiryType}
                              </span>
                            </div>
                            <span className="text-[12px] font-mono text-[#a6b1c5]">{inq.email} • {inq.phone || 'No phone'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={inq.status}
                              onChange={e => updateInquiryStatus(inq.id, e.target.value as any)}
                              className="px-2.5 py-1 rounded bg-[#161b2a] border border-[#252a39] text-[12px] font-mono text-[#dee2f6] focus:outline-none"
                            >
                              <option value="New">New</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                            <button
                              onClick={() => {
                                if (confirm('Delete inquiry record?')) deleteInquiry(inq.id);
                              }}
                              className="p-1 rounded text-[#a6b1c5] hover:text-[#ffb4ab]"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-[14px] text-[#dee2f6]/90 bg-[#161b2a] p-3 rounded-lg border border-[#252a39]">
                          "{inq.message}"
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#a6b1c5] font-mono">
                          <span>Budget: {inq.budget || 'N/A'} • Timeline: {inq.timeline || 'N/A'}</span>
                          <div className="flex items-center gap-3">
                            <a
                              href={`https://wa.me/${inq.phone?.replace(/[^0-9]/g, '') || ''}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#25d366] hover:underline flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">chat</span>
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`mailto:${inq.email}?subject=Navioraa%20Consultation`}
                              className="text-[#65e8ff] hover:underline flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">mail</span>
                              <span>Email Reply</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'access' && isPrimaryOwner && (
                <div className="bg-[#161b2a]/90 rounded-xl p-5 sm:p-6 border border-[#252a39] shadow-xl flex flex-col gap-7">
                  <div>
                    <h2 className="font-['Geist'] text-[22px] font-bold text-[#dee2f6]">Team admin access</h2>
                    <p className="text-[13px] text-[#a6b1c5] mt-1">Create an email and password account for a team member. The password is sent directly to Firebase Authentication and is never stored in Firestore.</p>
                  </div>

                  {accessFeedback && (
                    <div role="status" className="p-3 rounded-lg border border-[#434655] bg-[#090e1c] text-[13px] text-[#dee2f6]">
                      {accessFeedback}
                    </div>
                  )}

                  {isPrimaryOwner ? <form onSubmit={handleCreateTeamAdmin} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="text-[12px] text-[#a6b1c5]">
                      Team member name
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={newAdminName}
                        onChange={event => setNewAdminName(event.target.value)}
                        placeholder="Team member"
                        className="mt-1 w-full min-w-0 px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#434655] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      />
                    </label>
                    <label className="text-[12px] text-[#a6b1c5]">
                      Username / email
                      <input
                        type="email"
                        required
                        autoComplete="off"
                        value={newAdminEmail}
                        onChange={event => setNewAdminEmail(event.target.value)}
                        placeholder="team.member@example.com"
                        className="mt-1 w-full min-w-0 px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#434655] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      />
                    </label>
                    <label className="text-[12px] text-[#a6b1c5]">
                      Temporary password (10+ characters)
                      <input
                        type="password"
                        required
                        minLength={10}
                        maxLength={128}
                        autoComplete="new-password"
                        value={newAdminPassword}
                        onChange={event => setNewAdminPassword(event.target.value)}
                        placeholder="Set an initial password"
                        className="mt-1 w-full min-w-0 px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#434655] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={accessBusy}
                      className="self-end px-4 py-2.5 rounded-lg bg-[#65e8ff] text-[#090e1c] font-semibold text-[13px] disabled:opacity-50"
                    >
                      {accessBusy ? 'Creating account…' : 'Create team login'}
                    </button>
                  </form> : (
                    <p className="text-[13px] text-[#a6b1c5]">Only the primary owner can create team login accounts.</p>
                  )}

                  <div className="border-t border-[#252a39] pt-5">
                    <h3 className="text-[15px] font-semibold text-[#dee2f6]">Grant an existing Firebase account</h3>
                    <p className="text-[12px] text-[#a6b1c5] mt-1 mb-4">Use this if the team member already exists under Firebase Authentication → Users. Copy the exact UID from that user’s details. Their email must be verified before they can access the admin panel.</p>
                    <form onSubmit={handleGrantExistingTeamAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="text-[12px] text-[#a6b1c5]">
                        Account email
                        <input
                          type="email"
                          required
                          value={existingAdminEmail}
                          onChange={event => setExistingAdminEmail(event.target.value)}
                          placeholder="sashi@gmail.com"
                          className="mt-1 w-full min-w-0 px-3 py-2.5 rounded-lg bg-[#090e1c] border border-[#434655] text-[#dee2f6] text-[13px] focus:outline-none focus:border-[#65e8ff]"
                        />
                      </label>
                      <label className="text-[12px] text-[#a6b1c5]">
                        Firebase Auth UID
                        <input
                          type="text"
                          required
                          value={existingAdminUid}
                          onChange={event => setExistingAdminUid(event.target.value)}
                          placeholder="Copy from Authentication users"
                          className="mt-1 w-full min-w-0 px-3 py-2.5 rounded-lg bg-[#090e1c] border border-[#434655] text-[#dee2f6] text-[13px] focus:outline-none focus:border-[#65e8ff]"
                        />
                      </label>
                      <label className="text-[12px] text-[#a6b1c5]">
                        Display name
                        <input
                          type="text"
                          maxLength={100}
                          value={existingAdminName}
                          onChange={event => setExistingAdminName(event.target.value)}
                          placeholder="Team member"
                          className="mt-1 w-full min-w-0 px-3 py-2.5 rounded-lg bg-[#090e1c] border border-[#434655] text-[#dee2f6] text-[13px] focus:outline-none focus:border-[#65e8ff]"
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={accessBusy}
                        className="sm:col-span-3 justify-self-start px-4 py-2.5 rounded-lg border border-[#434655] text-[#dee2f6] text-[12px] font-semibold hover:bg-[#252a39] disabled:opacity-50"
                      >
                        {accessBusy ? 'Granting access…' : 'Grant team admin access'}
                      </button>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-[15px] font-semibold text-[#dee2f6] mb-3">Current administrators</h3>
                    {adminUsers.length ? (
                      <ul className="divide-y divide-[#252a39] border-y border-[#252a39]">
                        {adminUsers.map(admin => (
                          <li key={admin.email} className="py-3 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[13px] text-[#dee2f6] break-all">{admin.email}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] uppercase tracking-wide text-[#a6b1c5]">{admin.role || 'Admin'}</span>
                              {admin.role !== 'Owner' && (
                                <button
                                  type="button"
                                  onClick={() => handleRevokeTeamAdmin(admin)}
                                  disabled={!isPrimaryOwner || accessBusy}
                                  className="text-[11px] font-semibold text-[#ffb4ab] hover:text-white disabled:opacity-40"
                                  title="Revoke admin portal access"
                                >
                                  Revoke access
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[13px] text-[#a6b1c5]">No administrator records found.</p>
                    )}
                  </div>

                  <div className="border-t border-[#252a39] pt-6">
                    <h3 className="text-[15px] font-semibold text-[#dee2f6]">Send a password reset</h3>
                    <p className="text-[12px] text-[#a6b1c5] mt-1 mb-4">
                      Sends a secure reset link to an account using email and password. Google account passwords must be changed through Google.
                    </p>
                    <form onSubmit={handleSendPasswordReset} className="flex flex-col sm:flex-row gap-3">
                      <label className="sr-only" htmlFor="reset-account-email">Account email</label>
                      <input
                        id="reset-account-email"
                        type="email"
                        required
                        value={resetEmail}
                        onChange={event => setResetEmail(event.target.value)}
                        placeholder="account@example.com"
                        className="min-w-0 flex-1 px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#434655] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      />
                      <button
                        type="submit"
                        disabled={accessBusy}
                        className="px-4 py-2.5 rounded-lg border border-[#434655] text-[#dee2f6] text-[13px] hover:bg-[#252a39] disabled:opacity-50"
                      >
                        Send reset email
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* === HOMEPAGE CMS TAB === */}
              {activeTab === 'homepage' && (
                <div className="bg-[#161b2a]/90 backdrop-blur-xl rounded-xl p-6 border border-[#252a39] shadow-xl flex flex-col">
                  <h2 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6] mb-2">Homepage Content CMS</h2>
                  <p className="text-[13px] text-[#a6b1c5] mb-6">Modify hero headlines and callouts without touching source code.</p>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Hero Headline</label>
                      <input
                        type="text"
                        value={settingsHeroTitle}
                        onChange={e => setSettingsHeroTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Hero Description</label>
                      <textarea
                        rows={3}
                        value={settingsHeroDesc}
                        onChange={e => setSettingsHeroDesc(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px] focus:outline-none focus:border-[#65e8ff]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] cursor-pointer shadow-md"
                    >
                      Publish to Homepage
                    </button>
                  </form>
                </div>
              )}

              {/* === SITE SETTINGS TAB === */}
              {activeTab === 'settings' && (
                <div className="bg-[#161b2a]/90 backdrop-blur-xl rounded-xl p-6 border border-[#252a39] shadow-xl flex flex-col">
                  <h2 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6] mb-2">Global Site Settings</h2>
                  <p className="text-[13px] text-[#a6b1c5] mb-6">Update corporate contact info, WhatsApp number, and brand name.</p>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Brand Name</label>
                        <input
                          type="text"
                          value={settingsName}
                          onChange={e => setSettingsName(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Tagline</label>
                        <input
                          type="text"
                          value={settingsTagline}
                          onChange={e => setSettingsTagline(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Contact Email</label>
                        <input
                          type="email"
                          value={settingsEmail}
                          onChange={e => setSettingsEmail(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[11px] text-[#dee2f6] uppercase">Phone</label>
                        <input
                          type="text"
                          value={settingsPhone}
                          onChange={e => setSettingsPhone(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[11px] text-[#dee2f6] uppercase">WhatsApp Number</label>
                        <input
                          type="text"
                          value={settingsWhatsapp}
                          onChange={e => setSettingsWhatsapp(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-[#090e1c] border border-[#252a39] text-[#dee2f6] text-[14px]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] cursor-pointer shadow-md"
                    >
                      Save Settings
                    </button>
                  </form>
                </div>
              )}

              {/* === SECURITY AUDIT LOGS TAB === */}
              {activeTab === 'audit' && (
                <div className="bg-[#161b2a]/90 backdrop-blur-xl rounded-xl p-6 border border-[#252a39] shadow-xl flex flex-col">
                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <h2 className="font-['Geist'] text-[24px] font-bold text-[#dee2f6]">Security Audit Logs</h2>
                      <p className="text-[13px] text-[#a6b1c5]">Immutable event stream of all administrative writes.</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#65e8ff]">STREAM: SHA-384 ENCRYPTED</span>
                  </div>

                  <div className="space-y-2">
                    {auditLogs.length === 0 ? (
                      <p className="text-[13px] text-[#a6b1c5] p-4 text-center">No recent audit logs registered.</p>
                    ) : (
                      auditLogs.map(log => (
                        <div key={log.id} className="p-3 rounded bg-[#090e1c] border border-[#252a39] flex items-center justify-between text-[12px] font-mono">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded bg-[#252a39] text-[#65e8ff]">{log.action}</span>
                            <span className="text-[#dee2f6]">{log.details}</span>
                          </div>
                          <div className="text-[#8d90a0]">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* RIGHT / FEED: Real-time 'Recent Inquiries' Inbox Stream (4 cols) */}
            <aside className="xl:col-span-4 flex flex-col gap-6">
              <div className="bg-[#161b2a]/90 backdrop-blur-xl rounded-xl p-5 border border-[#252a39] shadow-xl flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-ping" />
                    <h3 className="font-['Geist'] text-[18px] text-[#dee2f6] font-bold">Inquiries Stream</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#93000a] text-[#ffdad6] font-mono text-[10px] font-bold">
                    {unresolvedInquiries.length} UNRESOLVED
                  </span>
                </div>
                <p className="text-[12px] text-[#a6b1c5] mb-4 leading-relaxed">
                  Live sync incoming telemetry from public RFPs, consultation schedules, and Academy applications.
                </p>

                {/* Inquiries List */}
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[720px] pr-1">
                  {inquiries.slice(0, 6).map((inq) => {
                    const isResolved = inq.status === 'Resolved';

                    return (
                      <article
                        key={inq.id}
                        className={`bg-[#1a1f2e] p-4 rounded-xl border border-[#252a39] hover:border-[#65e8ff]/30 transition-all flex flex-col gap-2 relative ${
                          isResolved ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isResolved ? 'bg-[#a6b1c5]' : 'bg-[#65e8ff]'}`} />
                            <span className="text-[14px] text-[#dee2f6] font-bold">{inq.name}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#658aff]/10 text-[#658aff] font-mono text-[10px] uppercase font-bold">
                            {inq.inquiryType}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[#a6b1c5] font-mono text-[11px]">
                          <span className="material-symbols-outlined text-[14px]">apartment</span>
                          <span>{inq.email}</span>
                        </div>

                        <p className="text-[13px] text-[#dee2f6]/90 line-clamp-2 mt-0.5">
                          "{inq.message}"
                        </p>

                        {/* Quick Actions */}
                        <div className="flex items-center justify-between gap-1 pt-2 mt-1 border-t border-[#252a39]/60">
                          <a
                            href={`https://wa.me/${inq.phone?.replace(/[^0-9]/g, '') || '919890187383'}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded bg-[#252a39] hover:bg-[#25d366]/20 hover:text-[#25d366] text-[#a6b1c5] text-[11px] font-semibold transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`mailto:${inq.email}?subject=Navioraa%20Consultation`}
                            className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded bg-[#252a39] hover:bg-[#65e8ff]/20 hover:text-[#65e8ff] text-[#a6b1c5] text-[11px] font-semibold transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">mail</span>
                            <span>Email Reply</span>
                          </a>

                          <button
                            onClick={() => updateInquiryStatus(inq.id, isResolved ? 'New' : 'Resolved')}
                            className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                              isResolved
                                ? 'bg-[#252a39] text-[#a6b1c5] hover:text-[#dee2f6]'
                                : 'bg-[#252a39] hover:bg-[#65e8ff] hover:text-[#090e1c] text-[#a6b1c5]'
                            }`}
                            title={isResolved ? 'Mark as New' : 'Mark as Resolved'}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {isResolved ? 'undo' : 'done_all'}
                            </span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="w-full mt-4 py-2.5 rounded-lg bg-[#252a39] hover:bg-[#343949] text-[#dee2f6] text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#434655]/30"
                >
                  <span>View All {inquiries.length} Client Inquiries</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </aside>
          </div>

          {/* Security & Audit Footer */}
          <footer className="mt-8 p-4 rounded-xl bg-[#090e1c] border border-[#252a39] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#a6b1c5]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#161b2a] flex items-center justify-center text-[#b5c4ff]">
                <span className="material-symbols-outlined text-[18px]">policy</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#dee2f6]">Role-Based Access Control Active</span>
                <span className="text-[12px] text-[#a6b1c5]">
                  Administrator actions are recorded. Inquiry details are visible to administrators only.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono text-[11px]">
              <span>{adminUsers.length} administrators</span>
            </div>
          </footer>
        </main>
      </div>

      {/* MODAL: Create / Edit Course */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090e1c]/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#161b2a] border border-[#65e8ff]/30 rounded-xl p-6 lg:p-8 w-full max-w-xl shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252a39]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#252a39] text-[#65e8ff] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">
                    {editingCourse ? 'edit_note' : 'add_box'}
                  </span>
                </span>
                <div>
                  <h3 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold">
                    {editingCourse ? 'Edit Course Curricula' : 'Register New Academy Course'}
                  </h3>
                  <p className="font-mono text-[11px] text-[#a6b1c5]">
                    Course details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="text-[#a6b1c5] hover:text-[#dee2f6] p-1 rounded"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-mono text-[#dee2f6] uppercase">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseFormTitle}
                  onChange={e => setCourseFormTitle(e.target.value)}
                  placeholder="e.g. Distributed Cloud Native Architectures"
                  className="bg-[#090e1c] text-[#dee2f6] text-[14px] px-3 py-2 rounded-lg border border-[#252a39] focus:outline-none focus:border-[#65e8ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-mono text-[#dee2f6] uppercase">Course Code ID</label>
                  <input
                    type="text"
                    required
                    value={courseFormCode}
                    onChange={e => setCourseFormCode(e.target.value)}
                    className="bg-[#090e1c] font-mono text-[13px] text-[#65e8ff] px-3 py-2 rounded-lg border border-[#252a39] focus:outline-none focus:border-[#65e8ff]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-mono text-[#dee2f6] uppercase">Duration Estimate</label>
                  <input
                    type="text"
                    required
                    value={courseFormDuration}
                    onChange={e => setCourseFormDuration(e.target.value)}
                    placeholder="e.g. 12 Weeks (84h)"
                    className="bg-[#090e1c] text-[#dee2f6] text-[14px] px-3 py-2 rounded-lg border border-[#252a39] focus:outline-none focus:border-[#65e8ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-mono text-[#dee2f6] uppercase">Difficulty Tier</label>
                  <select
                    value={courseFormDifficulty}
                    onChange={e => setCourseFormDifficulty(e.target.value as any)}
                    className="bg-[#090e1c] text-[#dee2f6] text-[14px] px-3 py-2 rounded-lg border border-[#252a39]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-mono text-[#dee2f6] uppercase">Tuition Fee</label>
                  <input
                    type="text"
                    value={courseFormPrice}
                    onChange={e => setCourseFormPrice(e.target.value)}
                    placeholder="e.g. $1,450"
                    className="bg-[#090e1c] text-[#dee2f6] text-[14px] px-3 py-2 rounded-lg border border-[#252a39]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-mono text-[#dee2f6] uppercase">Technology Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={courseFormTags}
                  onChange={e => setCourseFormTags(e.target.value)}
                  placeholder="e.g. K8s, Terraform, Istio, Go, Docker"
                  className="bg-[#090e1c] text-[#dee2f6] text-[14px] px-3 py-2 rounded-lg border border-[#252a39] focus:outline-none focus:border-[#65e8ff]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-mono text-[#dee2f6] uppercase">Short Overview Description *</label>
                <textarea
                  rows={2}
                  required
                  value={courseFormShortDesc}
                  onChange={e => setCourseFormShortDesc(e.target.value)}
                  placeholder="Summary displayed on catalog cards..."
                  className="bg-[#090e1c] text-[#dee2f6] text-[13px] px-3 py-2 rounded-lg border border-[#252a39] focus:outline-none focus:border-[#65e8ff]"
                />
              </div>

              {/* Image Input / Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-mono text-[#dee2f6] uppercase">Course Image URL / Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={courseFormImageUrl}
                    onChange={e => setCourseFormImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#090e1c] text-[#dee2f6] text-[13px] px-3 py-2 rounded-lg border border-[#252a39]"
                  />
                  <label className="px-3 py-2 rounded-lg bg-[#252a39] hover:bg-[#343949] text-xs font-mono text-[#dee2f6] cursor-pointer flex items-center gap-1 border border-[#434655]/40">
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleImageFileChange(e, setCourseFormImageUrl)}
                    />
                  </label>
                </div>
                {courseFormImageUrl && (
                  <img
                    src={courseFormImageUrl}
                    alt="Preview"
                    className="h-16 w-32 object-cover rounded-lg border border-[#252a39] mt-1"
                  />
                )}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#090e1c] border border-[#252a39]">
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#dee2f6]">Publish Status</span>
                  <span className="font-mono text-[11px] text-[#a6b1c5]">
                    {courseFormPublish ? 'Live to public showcase immediately' : 'Keep as internal draft'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={courseFormPublish}
                  onChange={e => setCourseFormPublish(e.target.checked)}
                  className="w-5 h-5 rounded text-[#65e8ff] bg-[#161b2a] cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#252a39] text-[#dee2f6] text-[13px] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold text-[13px] shadow-[0_0_12px_rgba(41,217,242,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090e1c]/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#161b2a] border border-[#65e8ff]/30 rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold mb-4">
              {editingService ? 'Edit IT Service' : 'Add IT Enterprise Service'}
            </h3>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const tags = serviceFormTags.split(',').map(t => t.trim()).filter(Boolean);
                if (editingService) {
                  await updateService(editingService.id, {
                    title: serviceFormTitle,
                    category: serviceFormCategory,
                    shortDescription: serviceFormShortDesc,
                    technologies: tags,
                    status: serviceFormPublish ? 'published' : 'draft'
                  });
                } else {
                  await addService({
                    title: serviceFormTitle,
                    slug: serviceFormTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    category: serviceFormCategory,
                    shortDescription: serviceFormShortDesc,
                    features: ['Production High Concurrency', 'Zero-Downtime Rollouts', '100% SLA'],
                    technologies: tags,
                    featured: true,
                    status: serviceFormPublish ? 'published' : 'draft',
                    sortOrder: services.length + 1
                  });
                }
                setIsServiceModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Service Title</label>
                <input
                  type="text"
                  required
                  value={serviceFormTitle}
                  onChange={e => setServiceFormTitle(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Category</label>
                <select
                  value={serviceFormCategory}
                  onChange={e => setServiceFormCategory(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                >
                  <option value="custom-software">Custom Software</option>
                  <option value="modern-web">Modern Web</option>
                  <option value="mobile-apps">Mobile Apps</option>
                  <option value="cognitive-ai">Cognitive AI</option>
                  <option value="cloud-devops">Cloud & DevOps</option>
                  <option value="training">Corporate Training</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={serviceFormShortDesc}
                  onChange={e => setServiceFormShortDesc(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={serviceFormTags}
                  onChange={e => setServiceFormTags(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-[#090e1c] rounded-lg border border-[#252a39]">
                <span className="text-[13px]">Publish immediately</span>
                <input
                  type="checkbox"
                  checked={serviceFormPublish}
                  onChange={e => setServiceFormPublish(e.target.checked)}
                  className="w-4 h-4 rounded text-[#65e8ff]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 bg-[#252a39] rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold rounded-lg text-sm"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090e1c]/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#161b2a] border border-[#65e8ff]/30 rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold mb-4">
              {editingProject ? 'Edit Showcase Project' : 'Add Showcase Project'}
            </h3>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const tags = projectFormTags.split(',').map(t => t.trim()).filter(Boolean);
                if (editingProject) {
                  await updateProject(editingProject.id, {
                    title: projectFormTitle,
                    category: projectFormCategory,
                    description: projectFormDesc,
                    technologies: tags,
                    demoUrl: projectFormDemoUrl,
                    status: projectFormPublish ? 'published' : 'draft'
                  });
                } else {
                  await addProject({
                    title: projectFormTitle,
                    slug: projectFormTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    category: projectFormCategory,
                    description: projectFormDesc,
                    technologies: tags,
                    demoUrl: projectFormDemoUrl,
                    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
                    featured: true,
                    status: projectFormPublish ? 'published' : 'draft',
                    sortOrder: projects.length + 1
                  });
                }
                setIsProjectModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectFormTitle}
                  onChange={e => setProjectFormTitle(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Category</label>
                <input
                  type="text"
                  required
                  value={projectFormCategory}
                  onChange={e => setProjectFormCategory(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Description</label>
                <textarea
                  rows={2}
                  required
                  value={projectFormDesc}
                  onChange={e => setProjectFormDesc(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={projectFormTags}
                  onChange={e => setProjectFormTags(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Demo URL</label>
                <input
                  type="text"
                  value={projectFormDemoUrl}
                  onChange={e => setProjectFormDemoUrl(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-[#090e1c] rounded-lg border border-[#252a39]">
                <span className="text-[13px]">Publish immediately</span>
                <input
                  type="checkbox"
                  checked={projectFormPublish}
                  onChange={e => setProjectFormPublish(e.target.checked)}
                  className="w-4 h-4 rounded text-[#65e8ff]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 bg-[#252a39] rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold rounded-lg text-sm"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Resource Modal */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090e1c]/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#161b2a] border border-[#65e8ff]/30 rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold mb-4">
              Add Learning Resource
            </h3>
            <form
              onSubmit={async e => {
                e.preventDefault();
                await addResource({
                  title: resourceFormTitle,
                  category: resourceFormCategory,
                  description: resourceFormDesc,
                  fileType: resourceFormType,
                  fileUrl: resourceFormUrl,
                  downloadCount: 0,
                  featured: true,
                  status: 'published'
                });
                setIsResourceModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Document Title</label>
                <input
                  type="text"
                  required
                  value={resourceFormTitle}
                  onChange={e => setResourceFormTitle(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Category</label>
                <input
                  type="text"
                  required
                  value={resourceFormCategory}
                  onChange={e => setResourceFormCategory(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">File / Document URL</label>
                <input
                  type="text"
                  required
                  value={resourceFormUrl}
                  onChange={e => setResourceFormUrl(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Description</label>
                <textarea
                  rows={2}
                  required
                  value={resourceFormDesc}
                  onChange={e => setResourceFormDesc(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 bg-[#252a39] rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold rounded-lg text-sm"
                >
                  Upload Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Team Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090e1c]/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#161b2a] border border-[#65e8ff]/30 rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="font-['Geist'] text-[20px] text-[#dee2f6] font-bold mb-4">
              {editingTeamMember ? 'Edit Team Member' : 'Add Team Member'}
            </h3>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const profile = {
                  name: teamFormName,
                  role: teamFormRole,
                  bio: teamFormBio,
                  skills: teamFormSkills.split(',').map(s => s.trim()).filter(Boolean),
                  photoUrl: teamFormPhoto,
                  linkedinUrl: teamFormLinkedin,
                  status: editingTeamMember?.status || 'published' as const
                };
                if (editingTeamMember) {
                  await updateTeamMember(editingTeamMember.id, profile);
                } else {
                  await addTeamMember({ ...profile, sortOrder: teamMembers.length + 1 });
                }
                setIsTeamModalOpen(false);
                setEditingTeamMember(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Full Name</label>
                <input
                  type="text"
                  required
                  value={teamFormName}
                  onChange={e => setTeamFormName(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Role / Title</label>
                <input
                  type="text"
                  required
                  value={teamFormRole}
                  onChange={e => setTeamFormRole(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Biography</label>
                <textarea
                  rows={2}
                  required
                  value={teamFormBio}
                  onChange={e => setTeamFormBio(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">Photo URL</label>
                <input
                  type="text"
                  value={teamFormPhoto}
                  onChange={e => setTeamFormPhoto(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div>
                <label className="text-[12px] font-mono text-[#dee2f6]">LinkedIn URL</label>
                <input
                  type="url"
                  value={teamFormLinkedin}
                  onChange={e => setTeamFormLinkedin(e.target.value)}
                  className="w-full bg-[#090e1c] text-[#dee2f6] px-3 py-2 rounded-lg border border-[#252a39]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsTeamModalOpen(false); setEditingTeamMember(null); }}
                  className="px-4 py-2 bg-[#252a39] rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#658aff] to-[#2ad9f2] text-[#090e1c] font-bold rounded-lg text-sm"
                >
                  {editingTeamMember ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
