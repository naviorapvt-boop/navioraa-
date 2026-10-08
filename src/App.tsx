import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { CoursesPage } from './pages/CoursesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage, TermsPage } from './pages/LegalPages';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '' ? path : '/';
    }
    return '/';
  });

  const navigate = useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Determine subPath for admin tabs
  const getAdminSubPath = (path: string): string | undefined => {
    if (path.startsWith('/admin/')) {
      return path.replace('/admin/', '');
    }
    return undefined;
  };

  const isAdminRoute = currentPath.startsWith('/admin');
  const isLoginRoute = currentPath === '/login';

  // Render appropriate page content
  const renderContent = () => {
    if (isLoginRoute) {
      return <AdminLogin navigate={navigate} />;
    }

    if (isAdminRoute) {
      const subPath = getAdminSubPath(currentPath);
      return <AdminDashboard navigate={navigate} subPath={subPath} />;
    }

    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/services':
        return <ServicesPage navigate={navigate} />;
      case '/courses':
        return <CoursesPage navigate={navigate} />;
      case '/projects':
        return <ProjectsPage navigate={navigate} />;
      case '/resources':
        return <ResourcesPage navigate={navigate} />;
      case '/team':
        return <TeamPage navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/privacy-policy':
        return <PrivacyPage navigate={navigate} />;
      case '/terms':
        return <TermsPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <DataProvider>
        <div className="app-shell min-h-screen flex flex-col">
          {!isAdminRoute && !isLoginRoute && (
            <Header currentPath={currentPath} navigate={navigate} />
          )}

          <div className="flex-1">
            <div key={currentPath} className={!isAdminRoute && !isLoginRoute ? 'public-page page-transition' : undefined}>
            {renderContent()}
            </div>
          </div>

          {!isAdminRoute && !isLoginRoute && (
            <Footer navigate={navigate} />
          )}
        </div>
      </DataProvider>
    </AuthProvider>
  );
}
