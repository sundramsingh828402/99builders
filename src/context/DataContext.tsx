import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Project,
  ConstructionService,
  NewsArticle,
  EventItem,
  CareerPosition,
  FaqItem,
} from '../types';
import {
  PROJECTS as INITIAL_PROJECTS,
  SERVICES as INITIAL_SERVICES,
  NEWS_ARTICLES as INITIAL_NEWS,
  PRESS_RELEASES as INITIAL_PRESS,
  BLOG_POSTS as INITIAL_BLOGS,
  EVENTS as INITIAL_EVENTS,
  CAREERS as INITIAL_CAREERS,
  FAQS as INITIAL_FAQS,
  COMPANY_INFO as INITIAL_COMPANY_INFO,
} from '../data/mockData';
import { api } from '../services/api';

interface DataContextType {
  projects: Project[];
  services: ConstructionService[];
  articles: NewsArticle[];
  newsArticles: NewsArticle[];
  pressReleases: NewsArticle[];
  blogPosts: NewsArticle[];
  events: EventItem[];
  careers: CareerPosition[];
  faqs: FaqItem[];
  companyInfo: typeof INITIAL_COMPANY_INFO;
  settings: Record<string, string>;
  getProject: (id: string) => Project | undefined;
  getArticle: (idOrSlug: string) => NewsArticle | undefined;
  refreshData: () => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [articles, setArticles] = useState<NewsArticle[]>([
    ...INITIAL_NEWS,
    ...INITIAL_PRESS,
    ...INITIAL_BLOGS,
  ]);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [careers, setCareers] = useState<CareerPosition[]>(INITIAL_CAREERS);
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Derived arrays
  const newsArticles = articles.filter((a) => !a.isPressRelease && a.category !== 'Insight');
  const pressReleases = articles.filter((a) => a.isPressRelease || a.category === 'Press');
  const blogPosts = articles.filter((a) => a.category === 'Insight' || a.category === 'Corporate');

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedProjects, fetchedArticles, fetchedEvents, fetchedCareers, fetchedFaqs, fetchedSettings] =
        await Promise.allSettled([
          api.getPublicProjects(),
          api.getPublicArticles(),
          api.getPublicEvents(),
          api.getPublicCareers(),
          api.getPublicFaqs(),
          api.getPublicSettings(),
        ]);

      if (fetchedProjects.status === 'fulfilled' && Array.isArray(fetchedProjects.value) && fetchedProjects.value.length > 0) {
        setProjects(fetchedProjects.value);
      }
      if (fetchedArticles.status === 'fulfilled' && Array.isArray(fetchedArticles.value) && fetchedArticles.value.length > 0) {
        setArticles(fetchedArticles.value);
      }
      if (fetchedEvents.status === 'fulfilled' && Array.isArray(fetchedEvents.value) && fetchedEvents.value.length > 0) {
        setEvents(fetchedEvents.value);
      }
      if (fetchedCareers.status === 'fulfilled' && Array.isArray(fetchedCareers.value) && fetchedCareers.value.length > 0) {
        setCareers(fetchedCareers.value);
      }
      if (fetchedFaqs.status === 'fulfilled' && Array.isArray(fetchedFaqs.value) && fetchedFaqs.value.length > 0) {
        setFaqs(fetchedFaqs.value);
      }
      if (fetchedSettings.status === 'fulfilled' && fetchedSettings.value) {
        setSettings(fetchedSettings.value);
      }
    } catch (err) {
      console.warn('Data sync note: Using verified local corporate dataset fallback', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getProject = useCallback(
    (id: string) => {
      return projects.find((p) => p.id === id);
    },
    [projects]
  );

  const getArticle = useCallback(
    (idOrSlug: string) => {
      return articles.find((a) => a.id === idOrSlug || (a as any).slug === idOrSlug);
    },
    [articles]
  );

  // Dynamic companyInfo combined with site_settings from DB
  const dynamicCompanyInfo = {
    ...INITIAL_COMPANY_INFO,
    headquarters: {
      ...INITIAL_COMPANY_INFO.headquarters,
      phone: settings.contact_phone || INITIAL_COMPANY_INFO.headquarters.phone,
      email: settings.contact_email || INITIAL_COMPANY_INFO.headquarters.email,
    },
    social: {
      ...INITIAL_COMPANY_INFO.social,
      whatsapp: settings.whatsapp_number || '+919845099888',
    },
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        services: INITIAL_SERVICES,
        articles,
        newsArticles,
        pressReleases,
        blogPosts,
        events,
        careers,
        faqs,
        companyInfo: dynamicCompanyInfo,
        settings,
        getProject,
        getArticle,
        refreshData,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within a DataProvider');
  }
  return ctx;
};
