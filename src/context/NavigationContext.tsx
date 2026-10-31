import React, { createContext, useContext, useState, useEffect } from 'react';
import { PageId } from '../types';

interface NavigationContextType {
  currentPage: PageId;
  currentProjectId: string | null;
  currentServiceId: string | null;
  currentArticleId: string | null;
  navigate: (
    page: PageId,
    options?: { projectId?: string; serviceId?: string; articleId?: string; scrollToTop?: boolean }
  ) => void;
  // Modals
  isEnquiryModalOpen: boolean;
  enquirySubject: string;
  openEnquiryModal: (subject?: string) => void;
  closeEnquiryModal: () => void;
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  isBrochureModalOpen: boolean;
  brochureProjectId: string | null;
  openBrochureModal: (projectId?: string) => void;
  closeBrochureModal: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>('aurora-sky-villas');
  const [currentServiceId, setCurrentServiceId] = useState<string | null>('architecture-masterplanning');
  const [currentArticleId, setCurrentArticleId] = useState<string | null>('aurora-sky-residences-topping-out');

  // Modals
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [brochureProjectId, setBrochureProjectId] = useState<string | null>(null);

  // Sync initial state from URL search params
  useEffect(() => {
    const parseUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as PageId | null;
      const idParam = params.get('id');

      if (pageParam) {
        setCurrentPage(pageParam);
        if (pageParam === 'project-detail' && idParam) setCurrentProjectId(idParam);
        if (pageParam === 'service-detail' && idParam) setCurrentServiceId(idParam);
        if (pageParam === 'news-article' && idParam) setCurrentArticleId(idParam);
      }
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, []);

  const navigate = (
    page: PageId,
    options?: { projectId?: string; serviceId?: string; articleId?: string; scrollToTop?: boolean }
  ) => {
    setCurrentPage(page);
    if (options?.projectId) setCurrentProjectId(options.projectId);
    if (options?.serviceId) setCurrentServiceId(options.serviceId);
    if (options?.articleId) setCurrentArticleId(options.articleId);

    const url = new URL(window.location.href);
    url.searchParams.set('page', page);

    if (page === 'project-detail' && options?.projectId) {
      url.searchParams.set('id', options.projectId);
    } else if (page === 'service-detail' && options?.serviceId) {
      url.searchParams.set('id', options.serviceId);
    } else if (page === 'news-article' && options?.articleId) {
      url.searchParams.set('id', options.articleId);
    } else {
      url.searchParams.delete('id');
    }

    window.history.pushState({}, '', url.toString());

    if (options?.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openEnquiryModal = (subject = 'General Property Enquiry') => {
    setEnquirySubject(subject);
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => setIsEnquiryModalOpen(false);

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const openBrochureModal = (projectId?: string) => {
    setBrochureProjectId(projectId || currentProjectId || 'aurora-sky-villas');
    setIsBrochureModalOpen(true);
  };

  const closeBrochureModal = () => setIsBrochureModalOpen(false);

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        currentProjectId,
        currentServiceId,
        currentArticleId,
        navigate,
        isEnquiryModalOpen,
        enquirySubject,
        openEnquiryModal,
        closeEnquiryModal,
        isSearchModalOpen,
        openSearchModal,
        closeSearchModal,
        isBrochureModalOpen,
        brochureProjectId,
        openBrochureModal,
        closeBrochureModal,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
};
