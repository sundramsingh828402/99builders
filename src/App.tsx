import React from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { DataProvider } from './context/DataContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { EnquiryModal } from './components/EnquiryModal';
import { BrochureModal } from './components/BrochureModal';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { SEOHead } from './components/SEOHead';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';

// 27 Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CompanyProfilePage } from './pages/CompanyProfilePage';
import { LeadershipPage } from './pages/LeadershipPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ResidentialPage } from './pages/ResidentialPage';
import { CommercialPage } from './pages/CommercialPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { LocationsPage } from './pages/LocationsPage';
import { MediaGalleryPage } from './pages/MediaGalleryPage';
import { VideoGalleryPage } from './pages/VideoGalleryPage';
import { NewsPage } from './pages/NewsPage';
import { NewsArticlePage } from './pages/NewsArticlePage';
import { PressPage } from './pages/PressPage';
import { BlogPage } from './pages/BlogPage';
import { EventsPage } from './pages/EventsPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { SiteVisitPage } from './pages/SiteVisitPage';
import { DownloadBrochurePage } from './pages/DownloadBrochurePage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const { currentPage } = useNavigation();
  const { adminUser, isLoading } = useAdminAuth();

  // If on admin routes, provide specialized views
  if (currentPage === 'admin-login') {
    return <AdminLoginPage />;
  }

  if (currentPage === 'admin') {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#12161A] flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A880]"></div>
        </div>
      );
    }
    return adminUser ? <AdminLayout /> : <AdminLoginPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'profile':
        return <CompanyProfilePage />;
      case 'team':
        return <LeadershipPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'project-detail':
        return <ProjectDetailPage />;
      case 'residential':
        return <ResidentialPage />;
      case 'commercial':
        return <CommercialPage />;
      case 'services':
        return <ServicesPage />;
      case 'service-detail':
        return <ServiceDetailPage />;
      case 'locations':
        return <LocationsPage />;
      case 'media-gallery':
        return <MediaGalleryPage />;
      case 'video-gallery':
        return <VideoGalleryPage />;
      case 'news':
        return <NewsPage />;
      case 'news-article':
        return <NewsArticlePage />;
      case 'press':
        return <PressPage />;
      case 'blog':
        return <BlogPage />;
      case 'events':
        return <EventsPage />;
      case 'careers':
        return <CareersPage />;
      case 'contact':
        return <ContactPage />;
      case 'site-visit':
        return <SiteVisitPage />;
      case 'download-brochure':
        return <DownloadBrochurePage />;
      case 'faq':
        return <FaqPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'disclaimer':
        return <DisclaimerPage />;
      case 'not-found':
        return <NotFoundPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#191F28] font-body">
      <SEOHead />
      <Header />
      <main className="flex-1">{renderCurrentPage()}</main>
      <Footer />

      {/* Global Interactive Modals & Concierge Widget */}
      <GlobalSearchModal />
      <EnquiryModal />
      <BrochureModal />
      <FloatingContactWidget />
    </div>
  );
};

export default function App() {
  return (
    <AdminAuthProvider>
      <DataProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </DataProvider>
    </AdminAuthProvider>
  );
}

