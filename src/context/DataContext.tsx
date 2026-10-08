import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from './AuthContext';
import {
  SiteSettings,
  Service,
  Course,
  Project,
  Resource,
  TeamMember,
  ContactInquiry,
  AdminAuditLog,
  InquiryStatus
} from '../types';
import {
  initialSiteSettings,
  initialServices,
  initialCourses,
  initialProjects,
  initialResources,
  initialTeamMembers,
} from '../data/seedData';

interface DataContextType {
  siteSettings: SiteSettings;
  services: Service[];
  courses: Course[];
  projects: Project[];
  resources: Resource[];
  teamMembers: TeamMember[];
  inquiries: ContactInquiry[];
  auditLogs: AdminAuditLog[];
  isLoaded: boolean;
  isSyncing: boolean;

  // Mutations
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  
  // Courses
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  toggleCourseStatus: (id: string) => Promise<void>;

  // Services
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateService: (id: string, data: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<void>;

  // Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleProjectStatus: (id: string) => Promise<void>;

  // Resources
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateResource: (id: string, data: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  toggleResourceStatus: (id: string) => Promise<void>;

  // Team
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTeamMember: (id: string, data: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  toggleTeamMemberStatus: (id: string) => Promise<void>;

  // Inquiries
  submitInquiry: (data: {
    name: string;
    email: string;
    phone?: string;
    inquiryType: string;
    subject?: string;
    message: string;
    budget?: string;
    timeline?: string;
    services?: string[];
  }) => Promise<string>;
  updateInquiryStatus: (id: string, status: InquiryStatus, adminNotes?: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  // Audit
  logAuditAction: (action: string, contentType: string, recordId?: string, details?: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function normalizeCompanyContact(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    contactEmail: settings.contactEmail === 'contact@navioraa.com'
      ? 'naviora.pvt@gmail.com'
      : settings.contactEmail,
    contactPhone: settings.contactPhone === '+1 (555) 019-9283'
      ? '+91 98901 87383'
      : settings.contactPhone,
    whatsappNumber: ['+15550199283', '15550199283'].includes(settings.whatsappNumber)
      ? '+919890187383'
      : settings.whatsappNumber
  };
}

function normalizeTeamMember(member: TeamMember): TeamMember {
  const seededProfile = initialTeamMembers.find(profile => profile.id === member.id);
  const legacyFounder = member.id === 'team-abhishek' && member.name === 'Abhishek Sharma';
  const legacyCoFounder = member.id === 'team-alex' && member.name === 'Alex Mercer';
  return seededProfile && (legacyFounder || legacyCoFounder)
    ? { ...member, ...seededProfile }
    : member;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Helper to log audit actions
  const logAuditAction = async (action: string, contentType: string, recordId?: string, details?: string) => {
    try {
      const logId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const logData: AdminAuditLog = {
        id: logId,
        adminEmail: user?.email || 'alex.mercer@navioraa.internal',
        action,
        contentType,
        recordId: recordId || 'unknown',
        details: details || `Performed ${action} on ${contentType}`,
        timestamp: new Date().toISOString()
      };
      await setDoc(doc(db, 'adminAuditLogs', logId), logData);
    } catch (e) {
      console.warn('Audit log write error:', e);
    }
  };

  // Seed collections in Firestore if empty
  const seedIfEmpty = async () => {
    try {
      // 1. Site Settings
      const settingsSnap = await getDocs(collection(db, 'siteSettings'));
      if (settingsSnap.empty) {
        await setDoc(doc(db, 'siteSettings', 'global'), initialSiteSettings, { merge: true });
      } else {
        const globalSettings = settingsSnap.docs.find(setting => setting.id === 'global');
        const storedSettings = globalSettings?.data();
        if (storedSettings) {
          const migration: Partial<SiteSettings> = {};
          if (storedSettings.contactEmail === 'contact@navioraa.com') {
            migration.contactEmail = 'naviora.pvt@gmail.com';
          }
          if (storedSettings.contactPhone === '+1 (555) 019-9283') {
            migration.contactPhone = '+91 98901 87383';
          }
          if (['+15550199283', '15550199283'].includes(storedSettings.whatsappNumber)) {
            migration.whatsappNumber = '+919890187383';
          }
          if (Object.keys(migration).length) {
            await setDoc(doc(db, 'siteSettings', 'global'), migration, { merge: true });
          }
        }
      }

      // 2. Services
      const servicesSnap = await getDocs(collection(db, 'services'));
      if (servicesSnap.empty) {
        for (const s of initialServices) {
          await setDoc(doc(db, 'services', s.id), s, { merge: true });
        }
      }

      // 3. Courses
      const coursesSnap = await getDocs(collection(db, 'courses'));
      if (coursesSnap.empty) {
        for (const c of initialCourses) {
          await setDoc(doc(db, 'courses', c.id), c, { merge: true });
        }
      }

      // 4. Projects
      const projectsSnap = await getDocs(collection(db, 'projects'));
      if (projectsSnap.empty) {
        for (const p of initialProjects) {
          await setDoc(doc(db, 'projects', p.id), p, { merge: true });
        }
      }

      // 5. Resources
      const resourcesSnap = await getDocs(collection(db, 'resources'));
      if (resourcesSnap.empty) {
        for (const r of initialResources) {
          await setDoc(doc(db, 'resources', r.id), r, { merge: true });
        }
      }

      // 6. Team Members
      const teamSnap = await getDocs(collection(db, 'teamMembers'));
      if (teamSnap.empty) {
        for (const t of initialTeamMembers) {
          await setDoc(doc(db, 'teamMembers', t.id), t, { merge: true });
        }
      } else {
        const legacyProfiles = [
          {
            id: 'team-abhishek',
            oldName: 'Abhishek Sharma',
            profile: {
              name: 'Shubham Mahadik',
              role: 'Founder',
              bio: 'Founder of Navioraa, focused on practical technology training and digital project work.',
              skills: [],
              photoUrl: 'https://drive.google.com/file/d/1iBasxtTJC6gONr3qLuKmhpz9lw-9LpQi/view?usp=sharing',
              linkedinUrl: 'https://www.linkedin.com/in/shubham-mahadik-927770276/'
            }
          },
          {
            id: 'team-alex',
            oldName: 'Alex Mercer',
            profile: {
              name: 'Sakshi Bekellu',
              role: 'Co-founder',
              bio: 'Co-founder at Navioraa, supporting practical learning and digital project work.',
              skills: [],
              photoUrl: 'https://drive.google.com/file/d/1q5gf_nydN29Nk5pckzVqVSBYCrFGhykZ/view?usp=sharing',
              linkedinUrl: '',
              githubUrl: ''
            }
          }
        ];
        for (const legacyProfile of legacyProfiles) {
          const storedProfile = teamSnap.docs.find(member => member.id === legacyProfile.id);
          if (storedProfile?.data().name === legacyProfile.oldName) {
            await setDoc(doc(db, 'teamMembers', legacyProfile.id), legacyProfile.profile, { merge: true });
          }
        }
      }
    } catch (err) {
      console.warn('Seed verification note:', err);
    }
  };

  // Run seed check when admin status is active or changes
  useEffect(() => {
    if (isAdmin) {
      seedIfEmpty();
    }
  }, [isAdmin]);

  // Real-time Firestore Listeners
  useEffect(() => {
    // 1. Site Settings
    const unsubSettings = onSnapshot(doc(db, 'siteSettings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSiteSettings(normalizeCompanyContact(docSnap.data() as SiteSettings));
      }
    }, (error) => {
      console.warn('Settings snapshot error:', error.message);
    });

    // 2. Services
    const unsubServices = onSnapshot(collection(db, 'services'), (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
        items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setServices(items);
      }
    }, (error) => {
      console.warn('Services snapshot error:', error.message);
    });

    // 3. Courses
    const unsubCourses = onSnapshot(collection(db, 'courses'), (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
        items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setCourses(items);
      }
    }, (error) => {
      console.warn('Courses snapshot error:', error.message);
    });

    // 4. Projects
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setProjects(items);
      }
    }, (error) => {
      console.warn('Projects snapshot error:', error.message);
    });

    // 5. Resources
    const unsubResources = onSnapshot(collection(db, 'resources'), (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Resource));
        setResources(items);
      }
    }, (error) => {
      console.warn('Resources snapshot error:', error.message);
    });

    // 6. Team Members
    const unsubTeam = onSnapshot(collection(db, 'teamMembers'), (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map(d => normalizeTeamMember({ id: d.id, ...d.data() } as TeamMember));
        items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setTeamMembers(items);
      }
    }, (error) => {
      console.warn('Team snapshot error:', error.message);
    });

    setIsLoaded(true);

    return () => {
      unsubSettings();
      unsubServices();
      unsubCourses();
      unsubProjects();
      unsubResources();
      unsubTeam();
    };
  }, []);

  // Admin Inquiries and Audit Logs listener (active when user is admin)
  useEffect(() => {
    if (!isAdmin) return;

    const unsubInquiries = onSnapshot(collection(db, 'contactInquiries'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactInquiry));
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInquiries(items);
    }, (error) => {
      console.warn('Inquiries snapshot error:', error.message);
    });

    const unsubLogs = onSnapshot(query(collection(db, 'adminAuditLogs'), orderBy('timestamp', 'desc')), (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminAuditLog));
        setAuditLogs(items);
      }
    }, (error) => {
      console.warn('Audit logs snapshot error:', error.message);
    });

    return () => {
      unsubInquiries();
      unsubLogs();
    };
  }, [isAdmin]);

  // Site Settings mutation
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    setIsSyncing(true);
    const existing = siteSettings || initialSiteSettings;
    const updated = {
      ...existing,
      ...settings,
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'siteSettings', 'global'), updated, { merge: true });
      setSiteSettings(updated as SiteSettings);
      await logAuditAction('Update Settings', 'siteSettings', 'global', 'Updated website brand configuration');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'siteSettings/global');
    } finally {
      setIsSyncing(false);
    }
  };

  // --- Courses CRUD ---
  const addCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSyncing(true);
    const id = `crs-${Date.now().toString().slice(-4)}`;
    const fullCourse: Course = {
      ...courseData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'courses', id), fullCourse, { merge: true });
      setCourses(prev => [fullCourse, ...prev]);
      await logAuditAction('Create Course', 'courses', id, `Created course: ${courseData.title} (${courseData.status})`);
      return id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `courses/${id}`);
      return id;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateCourse = async (id: string, data: Partial<Course>) => {
    setIsSyncing(true);
    const existing = courses.find(c => c.id === id) || initialCourses.find(c => c.id === id);
    const payload = existing
      ? { ...existing, ...data, updatedAt: new Date().toISOString() }
      : { ...data, updatedAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'courses', id), payload, { merge: true });
      setCourses(prev => {
        const found = prev.some(c => c.id === id);
        if (found) {
          return prev.map(c => c.id === id ? { ...c, ...payload } : c);
        }
        return [payload as Course, ...prev];
      });
      await logAuditAction('Update Course', 'courses', id, `Updated fields on course ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `courses/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteCourse = async (id: string) => {
    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, 'courses', id));
      setCourses(prev => prev.filter(c => c.id !== id));
      await logAuditAction('Delete Course', 'courses', id, `Deleted course ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `courses/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleCourseStatus = async (id: string) => {
    const course = courses.find(c => c.id === id) || initialCourses.find(c => c.id === id);
    if (!course) return;
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    await updateCourse(id, { status: newStatus });
    await logAuditAction(newStatus === 'published' ? 'Publish Course' : 'Unpublish Course', 'courses', id, `Course ${id} status -> ${newStatus}`);
  };

  // --- Services CRUD ---
  const addService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSyncing(true);
    const id = `srv-${Date.now().toString().slice(-4)}`;
    const fullService: Service = {
      ...serviceData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'services', id), fullService, { merge: true });
      setServices(prev => [fullService, ...prev]);
      await logAuditAction('Create Service', 'services', id, `Created service: ${serviceData.title}`);
      return id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `services/${id}`);
      return id;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateService = async (id: string, data: Partial<Service>) => {
    setIsSyncing(true);
    const existing = services.find(s => s.id === id) || initialServices.find(s => s.id === id);
    const payload = existing
      ? { ...existing, ...data, updatedAt: new Date().toISOString() }
      : { ...data, updatedAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'services', id), payload, { merge: true });
      setServices(prev => {
        const found = prev.some(s => s.id === id);
        if (found) {
          return prev.map(s => s.id === id ? { ...s, ...payload } : s);
        }
        return [payload as Service, ...prev];
      });
      await logAuditAction('Update Service', 'services', id, `Updated service ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `services/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteService = async (id: string) => {
    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(prev => prev.filter(s => s.id !== id));
      await logAuditAction('Delete Service', 'services', id, `Deleted service ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `services/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleServiceStatus = async (id: string) => {
    const service = services.find(s => s.id === id) || initialServices.find(s => s.id === id);
    if (!service) return;
    const newStatus = service.status === 'published' ? 'draft' : 'published';
    await updateService(id, { status: newStatus });
  };

  // --- Projects CRUD ---
  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSyncing(true);
    const id = `prj-${Date.now().toString().slice(-4)}`;
    const fullProject: Project = {
      ...projectData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'projects', id), fullProject, { merge: true });
      setProjects(prev => [fullProject, ...prev]);
      await logAuditAction('Create Project', 'projects', id, `Created project: ${projectData.title}`);
      return id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `projects/${id}`);
      return id;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    setIsSyncing(true);
    const existing = projects.find(p => p.id === id) || initialProjects.find(p => p.id === id);
    const payload = existing
      ? { ...existing, ...data, updatedAt: new Date().toISOString() }
      : { ...data, updatedAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'projects', id), payload, { merge: true });
      setProjects(prev => {
        const found = prev.some(p => p.id === id);
        if (found) {
          return prev.map(p => p.id === id ? { ...p, ...payload } : p);
        }
        return [payload as Project, ...prev];
      });
      await logAuditAction('Update Project', 'projects', id, `Updated project ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `projects/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteProject = async (id: string) => {
    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
      await logAuditAction('Delete Project', 'projects', id, `Deleted project ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `projects/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleProjectStatus = async (id: string) => {
    const project = projects.find(p => p.id === id) || initialProjects.find(p => p.id === id);
    if (!project) return;
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    await updateProject(id, { status: newStatus });
  };

  // --- Resources CRUD ---
  const addResource = async (resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSyncing(true);
    const id = `res-${Date.now().toString().slice(-4)}`;
    const fullResource: Resource = {
      ...resourceData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'resources', id), fullResource, { merge: true });
      setResources(prev => [fullResource, ...prev]);
      await logAuditAction('Create Resource', 'resources', id, `Uploaded learning resource: ${resourceData.title}`);
      return id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `resources/${id}`);
      return id;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateResource = async (id: string, data: Partial<Resource>) => {
    setIsSyncing(true);
    const existing = resources.find(r => r.id === id) || initialResources.find(r => r.id === id);
    const payload = existing
      ? { ...existing, ...data, updatedAt: new Date().toISOString() }
      : { ...data, updatedAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'resources', id), payload, { merge: true });
      setResources(prev => {
        const found = prev.some(r => r.id === id);
        if (found) {
          return prev.map(r => r.id === id ? { ...r, ...payload } : r);
        }
        return [payload as Resource, ...prev];
      });
      await logAuditAction('Update Resource', 'resources', id, `Updated resource ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `resources/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteResource = async (id: string) => {
    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, 'resources', id));
      setResources(prev => prev.filter(r => r.id !== id));
      await logAuditAction('Delete Resource', 'resources', id, `Deleted resource ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `resources/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleResourceStatus = async (id: string) => {
    const res = resources.find(r => r.id === id) || initialResources.find(r => r.id === id);
    if (!res) return;
    const newStatus = res.status === 'published' ? 'draft' : 'published';
    await updateResource(id, { status: newStatus });
  };

  // --- Team Members CRUD ---
  const addTeamMember = async (memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSyncing(true);
    const id = `team-${Date.now().toString().slice(-4)}`;
    const fullMember: TeamMember = {
      ...memberData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'teamMembers', id), fullMember, { merge: true });
      setTeamMembers(prev => [fullMember, ...prev]);
      await logAuditAction('Create Team Member', 'teamMembers', id, `Added team member: ${memberData.name}`);
      return id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `teamMembers/${id}`);
      return id;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateTeamMember = async (id: string, data: Partial<TeamMember>) => {
    setIsSyncing(true);
    const existing = teamMembers.find(m => m.id === id) || initialTeamMembers.find(m => m.id === id);
    const payload = existing
      ? { ...existing, ...data, updatedAt: new Date().toISOString() }
      : { ...data, updatedAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'teamMembers', id), payload, { merge: true });
      setTeamMembers(prev => {
        const found = prev.some(m => m.id === id);
        if (found) {
          return prev.map(m => m.id === id ? { ...m, ...payload } : m);
        }
        return [payload as TeamMember, ...prev];
      });
      await logAuditAction('Update Team Member', 'teamMembers', id, `Updated team member ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `teamMembers/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteTeamMember = async (id: string) => {
    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, 'teamMembers', id));
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      await logAuditAction('Delete Team Member', 'teamMembers', id, `Deleted member ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `teamMembers/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleTeamMemberStatus = async (id: string) => {
    const member = teamMembers.find(m => m.id === id) || initialTeamMembers.find(m => m.id === id);
    if (!member) return;
    const newStatus = member.status === 'published' ? 'draft' : 'published';
    await updateTeamMember(id, { status: newStatus });
  };

  // --- Inquiries Submission & Management ---
  const submitInquiry = async (data: {
    name: string;
    email: string;
    phone?: string;
    inquiryType: string;
    subject?: string;
    message: string;
    budget?: string;
    timeline?: string;
    services?: string[];
  }) => {
    const inquiryRef = doc(collection(db, 'contactInquiries'));
    const id = inquiryRef.id;
    const newInquiry: ContactInquiry = {
      name: data.name,
      email: data.email,
      inquiryType: data.inquiryType,
      message: data.message,
      ...(data.phone ? { phone: data.phone } : {}),
      ...(data.subject ? { subject: data.subject } : {}),
      ...(data.budget ? { budget: data.budget } : {}),
      ...(data.timeline ? { timeline: data.timeline } : {}),
      ...(data.services ? { services: data.services } : {}),
      id,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(inquiryRef, newInquiry);
      setInquiries(prev => [newInquiry, ...prev]);
      return id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `contactInquiries/${id}`);
      return id;
    }
  };

  const updateInquiryStatus = async (id: string, status: InquiryStatus, adminNotes?: string) => {
    setIsSyncing(true);
    const existing = inquiries.find(inq => inq.id === id);
    const payload: Partial<ContactInquiry> = {
      ...(existing || {}),
      status,
      updatedAt: new Date().toISOString(),
      ...(adminNotes !== undefined ? { adminNotes } : {})
    };
    try {
      await setDoc(doc(db, 'contactInquiries', id), payload, { merge: true });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, ...payload } : inq));
      await logAuditAction('Update Inquiry', 'contactInquiries', id, `Inquiry ${id} status -> ${status}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `contactInquiries/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteInquiry = async (id: string) => {
    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, 'contactInquiries', id));
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      await logAuditAction('Delete Inquiry', 'contactInquiries', id, `Removed inquiry ${id}`);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `contactInquiries/${id}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        siteSettings,
        services,
        courses,
        projects,
        resources,
        teamMembers,
        inquiries,
        auditLogs,
        isLoaded,
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
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        logAuditAction
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
