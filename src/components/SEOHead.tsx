import React, { useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';

export const SEOHead: React.FC = () => {
  const { currentPage, currentProjectId, currentArticleId, currentServiceId } = useNavigation();
  const { getProject, getArticle, services, companyInfo } = useData();

  useEffect(() => {
    let title = '99 Builders & Developers — ISO 14001:2015 Certified Construction & Real Estate';
    let description =
      'Explore luxury residential sky mansions, prime commercial IT corridors, and institutional EPC general contracting by 99 Builders & Developers.';
    let image = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80';
    let jsonLdType = 'GeneralContractor';
    let specificJsonLd: any = null;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://99builders.com';
    const canonicalUrl = `${origin}/?page=${currentPage}${
      currentProjectId ? `&id=${currentProjectId}` : currentArticleId ? `&id=${currentArticleId}` : ''
    }`;

    switch (currentPage) {
      case 'home':
        title = '99 Builders & Developers | Luxury Real Estate & EPC Infrastructure';
        description =
          'Discover prestigious residential penthouses, sustainable commercial campuses, and EPC contracting by 99 Builders. ISO 14001:2015 Certified.';
        break;
      case 'about':
        title = 'About 99 Builders & Developers | 18+ Years of Engineering Legacies';
        description =
          'Learn about 99 Builders & Developers, our history, architectural vision, engineering standards, and sustainable urban development leadership.';
        break;
      case 'profile':
        title = 'Company Profile & ISO 14001:2015 Standards | 99 Builders';
        description =
          'Comprehensive corporate profile of 99 Builders & Developers detailing safety protocols, quality benchmarks, and biophilic architectural governance.';
        break;
      case 'team':
        title = 'Executive Leadership & Chief Architects | 99 Builders & Developers';
        description =
          'Meet the veteran civil engineers, managing directors, and master architects shaping the skyline landmarks of 99 Builders.';
        break;
      case 'projects':
        title = 'Our Landmark Projects Portfolio | 99 Builders & Developers';
        description =
          'Browse our portfolio of completed, ongoing, and upcoming luxury residences and commercial tech parks across prime metropolitan hubs.';
        break;
      case 'project-detail': {
        const proj = getProject(currentProjectId || 'aurora-sky-villas');
        if (proj) {
          title = `${proj.title} | 99 Builders & Developers`;
          description = `${proj.tagline}. Located at ${proj.location}. ${proj.unitsOrArea}. Verified RERA: ${proj.reraNumber}.`;
          image = proj.heroImage;
          specificJsonLd = {
            '@context': 'https://schema.org',
            '@type': proj.category === 'residential' ? 'SingleFamilyResidence' : 'CommercialBuilding',
            name: proj.title,
            description: proj.overview,
            image: proj.heroImage,
            address: {
              '@type': 'PostalAddress',
              addressLocality: proj.cityHub,
              streetAddress: proj.location,
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: proj.priceStarting,
              availability: 'https://schema.org/InStock',
            },
          };
        }
        break;
      }
      case 'residential':
        title = 'Luxury Residential Residences & Sky Penthouses | 99 Builders';
        description =
          'Tour ultra-luxury residences, sky mansions, and penthouses with private cantilevered pools, biophilic terraces, and club amenities.';
        break;
      case 'commercial':
        title = 'Grade-A Commercial Tech Parks & Retail Campuses | 99 Builders';
        description =
          'Next-generation Grade-A commercial office spaces, high-street retail atriums, and LEED Gold certified enterprise campuses.';
        break;
      case 'services':
        title = 'Construction & EPC Infrastructure Services | 99 Builders';
        description =
          'End-to-end turnkey construction: Architectural Masterplanning, Structural Engineering, MEP Infrastructure, and Project Delivery.';
        break;
      case 'service-detail': {
        const srv = services.find((s) => s.id === currentServiceId);
        if (srv) {
          title = `${srv.title} | Construction Services | 99 Builders`;
          description = srv.shortDesc;
          image = srv.heroImage;
        }
        break;
      }
      case 'locations':
        title = 'Strategic Project Locations & Regional Hubs | 99 Builders';
        description =
          'Interactive map coordinates and infrastructure connectivity guides for all 99 Builders residential and commercial hubs.';
        break;
      case 'media-gallery':
        title = 'Architectural Photography & Project Gallery | 99 Builders';
        description =
          'High-definition architectural photography capturing exterior façades, curated interiors, and sky amenity spaces.';
        break;
      case 'video-gallery':
        title = 'Video Walkthroughs & Drone Fly-Throughs | 99 Builders';
        description =
          'Watch 4K architectural fly-throughs, sample residence walkthroughs, and quarterly construction progress broadcasts.';
        break;
      case 'news':
        title = 'Corporate News & Milestone Updates | 99 Builders & Developers';
        description =
          'Latest press updates, structural topping-out announcements, and statutory approvals from 99 Builders & Developers.';
        break;
      case 'news-article': {
        const article = getArticle(currentArticleId || '');
        if (article) {
          title = `${article.title} | 99 Builders`;
          description = article.summary;
          image = article.image;
          specificJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            image: [article.image],
            datePublished: article.date,
            author: [{ '@type': 'Organization', name: article.author || '99 Builders & Developers' }],
            publisher: {
              '@type': 'Organization',
              name: '99 Builders & Developers',
              logo: { '@type': 'ImageObject', url: `${origin}/assets/aistudio/99logo_64777909.png` },
            },
            description: article.summary,
          };
        }
        break;
      }
      case 'press':
        title = 'Press Releases & Media Announcements | 99 Builders';
        description =
          'Official corporate press releases, joint venture declarations, and sustainability awards from 99 Builders.';
        break;
      case 'blog':
        title = 'Real Estate Insights & Architectural Thought Leadership | 99 Builders';
        description =
          'Market trends, capital appreciation analyses, and structural engineering insights for investors and homebuyers.';
        break;
      case 'events':
        title = 'Corporate Galas, Expos & Investor Days | 99 Builders';
        description =
          'Upcoming property expos, foundation-stone ceremonies, and private investor symposiums hosted by 99 Builders.';
        break;
      case 'careers':
        title = 'Careers in Civil Engineering & Architecture | 99 Builders';
        description =
          'Join our multidisciplinary engineering team. Openings in civil construction, project planning, and BIM design.';
        break;
      case 'contact':
        title = 'Contact Corporate Headquarters & Sales Desks | 99 Builders';
        description =
          'Direct contact lines, experience center addresses, and concierge desks for 99 Builders & Developers.';
        break;
      case 'site-visit':
        title = 'Book a Private Site Inspection & Chauffeur Transit | 99 Builders';
        description =
          'Experience sample sky mansions in person. Complimentary chauffeur pick-up and private briefings by senior relationship directors.';
        break;
      case 'download-brochure':
        title = 'Download Official Project Dossiers & Floor Plans | 99 Builders';
        description =
          'Instant access to high-resolution architectural brochures, unit layouts, specifications, and verified RERA certificates.';
        break;
      case 'faq':
        title = 'Frequently Asked Questions & RERA Legal Guidance | 99 Builders';
        description =
          'Answers to common buyer questions regarding home loans, NRI purchasing rules, possession milestones, and maintenance.';
        break;
      case 'privacy':
        title = 'Privacy Policy & Data Security | 99 Builders & Developers';
        description =
          'Corporate policy regarding user confidentiality, lead data security, and communication permissions under global privacy standards.';
        break;
      case 'terms':
        title = 'Terms of Use & Statutory Disclaimers | 99 Builders';
        description =
          'Terms and conditions governing the use of the 99 Builders & Developers portal, architectural renders, and enquiries.';
        break;
      case 'disclaimer':
        title = 'RERA Statutory Disclaimer & Evaluation Notice | 99 Builders';
        description:
          'Official demo evaluation disclaimer confirming that architectural representations reflect demo evaluation content.';
        break;
      case 'not-found':
        title = 'Page Not Found (404) | 99 Builders & Developers';
        description = 'The requested property page or architectural document could not be found.';
        break;
      case 'admin':
      case 'admin-login':
        title = 'Admin Portal | 99 Builders CRM';
        description = 'Authorized administrative access for 99 Builders & Developers staff.';
        break;
    }

    // Apply to DOM
    document.title = title;

    const setMeta = (name: string, content: string, isProp = false) => {
      const selector = isProp ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (isProp) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Schema.org Structured Data
    const defaultOrgSchema = {
      '@context': 'https://schema.org',
      '@type': ['RealEstateAgent', 'GeneralContractor'],
      name: companyInfo.name,
      url: origin,
      logo: `${origin}/assets/aistudio/99logo_64777909.png`,
      description: companyInfo.subtitle,
      telephone: companyInfo.headquarters.phone,
      email: companyInfo.headquarters.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: companyInfo.headquarters.address,
        addressLocality: companyInfo.headquarters.city,
        postalCode: companyInfo.headquarters.pin,
      },
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'ISO 14001:2015 Environmental Management Systems',
      },
    };

    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(specificJsonLd || defaultOrgSchema);
  }, [currentPage, currentProjectId, currentArticleId, currentServiceId, getProject, getArticle, services, companyInfo]);

  return null;
};
