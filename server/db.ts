import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { PROJECTS, SERVICES, LEADERSHIP, NEWS_ARTICLES, PRESS_RELEASES, BLOG_POSTS, EVENTS, CAREERS, FAQS, COMPANY_INFO } from '../src/data/mockData';

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, '99builders.sqlite');
export const db = new DatabaseSync(dbPath);

// Enable foreign keys and WAL mode
db.exec('PRAGMA foreign_keys = ON;');

// Initialize tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL, -- 'super_admin' | 'editor' | 'lead_manager'
      created_at TEXT NOT NULL,
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tagline TEXT NOT NULL,
      category TEXT NOT NULL, -- 'residential' | 'commercial'
      sub_category TEXT NOT NULL,
      status TEXT NOT NULL, -- 'ongoing' | 'completed' | 'upcoming'
      is_published INTEGER NOT NULL DEFAULT 1,
      location TEXT NOT NULL,
      city_hub TEXT NOT NULL,
      price_starting TEXT NOT NULL,
      units_or_area TEXT NOT NULL,
      rera_number TEXT NOT NULL,
      hero_image TEXT NOT NULL,
      gallery_json TEXT NOT NULL,
      video_tour_url TEXT,
      overview TEXT NOT NULL,
      architecture_firm TEXT NOT NULL,
      overall_progress INTEGER DEFAULT 0,
      possession_date TEXT NOT NULL,
      amenities_json TEXT NOT NULL,
      specifications_json TEXT NOT NULL,
      milestones_json TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      form_type TEXT NOT NULL, -- 'general' | 'project' | 'site_visit' | 'callback' | 'requirement' | 'brochure' | 'career' | 'partnership'
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      project_id TEXT,
      subject TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'contacted' | 'site_visit_scheduled' | 'negotiation' | 'closed' | 'archived'
      assigned_to TEXT,
      internal_notes TEXT,
      preferred_date TEXT,
      preferred_time TEXT,
      meta_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_files (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT NOT NULL, -- 'image' | 'video' | 'document'
      file_size INTEGER NOT NULL,
      category TEXT NOT NULL,
      caption TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL, -- 'news' | 'press' | 'blog'
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      read_time TEXT NOT NULL,
      summary TEXT NOT NULL,
      content_json TEXT NOT NULL,
      image TEXT NOT NULL,
      author TEXT NOT NULL,
      tags_json TEXT NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      rsvp_open INTEGER NOT NULL DEFAULT 1,
      image TEXT NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS careers (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      experience TEXT NOT NULL,
      description TEXT NOT NULL,
      responsibilities_json TEXT NOT NULL,
      requirements_json TEXT NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `);

  seedInitialData();
}

// Password hashing helpers
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return testHash === hash;
}

function seedInitialData() {
  const now = new Date().toISOString();

  // 1. Seed Users if empty
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
  if (userCount === 0) {
    const defaultUsers = [
      {
        id: 'usr_superadmin',
        email: 'admin@99builders.com',
        name: 'Executive Super Admin',
        role: 'super_admin',
        password: 'Admin@99Builders2026!',
      },
      {
        id: 'usr_editor',
        email: 'editor@99builders.com',
        name: 'Senior Content Editor',
        role: 'editor',
        password: 'Editor@99Builders2026!',
      },
      {
        id: 'usr_leads',
        email: 'leads@99builders.com',
        name: 'Chief Lead Officer',
        role: 'lead_manager',
        password: 'Leads@99Builders2026!',
      },
    ];

    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, password_salt, name, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const u of defaultUsers) {
      const { hash, salt } = hashPassword(u.password);
      insertUser.run(u.id, u.email, hash, salt, u.name, u.role, now);
    }
  }

  // 2. Seed / Synchronize Projects with authentic assets
  const upsertProject = db.prepare(`
    INSERT OR REPLACE INTO projects (
      id, title, tagline, category, sub_category, status, is_published,
      location, city_hub, price_starting, units_or_area, rera_number,
      hero_image, gallery_json, video_tour_url, overview, architecture_firm,
      overall_progress, possession_date, amenities_json, specifications_json,
      milestones_json, featured, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of PROJECTS) {
    upsertProject.run(
      p.id,
      p.title,
      p.tagline,
      p.category,
      p.subCategory,
      p.status,
      1,
      p.location,
      p.cityHub,
      p.priceStarting,
      p.unitsOrArea,
      p.reraNumber,
      p.heroImage,
      JSON.stringify(p.gallery || []),
      p.videoTourUrl || '',
      p.overview,
      p.architectureFirm,
      p.overallProgress || 0,
      p.possessionDate,
      JSON.stringify(p.amenities || []),
      JSON.stringify(p.specifications || []),
      JSON.stringify(p.milestones || []),
      p.featured ? 1 : 0,
      now,
      now
    );
  }

  // 3. Seed / Synchronize Articles with authentic imagery
  const upsertArticle = db.prepare(`
    INSERT OR REPLACE INTO articles (
      id, title, slug, type, category, date, read_time,
      summary, content_json, image, author, tags_json, is_published, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const na of NEWS_ARTICLES) {
    upsertArticle.run(
      na.id,
      na.title,
      na.id,
      'news',
      na.category,
      na.date,
      na.readTime,
      na.summary,
      JSON.stringify(na.content || []),
      na.image,
      na.author,
      JSON.stringify(na.tags || []),
      1,
      now,
      now
    );
  }

  for (const pr of PRESS_RELEASES) {
    upsertArticle.run(
      pr.id,
      pr.title,
      pr.id,
      'press',
      pr.category,
      pr.date,
      pr.readTime,
      pr.summary,
      JSON.stringify(pr.content || []),
      pr.image,
      pr.author,
      JSON.stringify(pr.tags || []),
      1,
      now,
      now
    );
  }

  for (const bp of BLOG_POSTS) {
    upsertArticle.run(
      bp.id,
      bp.title,
      bp.id,
      'blog',
      bp.category,
      bp.date,
      bp.readTime,
      bp.summary,
      JSON.stringify(bp.content || []),
      bp.image,
      bp.author,
      JSON.stringify(bp.tags || []),
      1,
      now,
      now
    );
  }

  // 4. Seed Events if empty
  const eventCount = (db.prepare('SELECT COUNT(*) as count FROM events').get() as any).count;
  if (eventCount === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (id, title, date, time, location, category, description, rsvp_open, image, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const ev of EVENTS) {
      insertEvent.run(
        ev.id,
        ev.title,
        ev.date,
        ev.time,
        ev.location,
        ev.category,
        ev.description,
        ev.rsvpOpen ? 1 : 0,
        ev.image,
        1,
        now
      );
    }
  }

  // 5. Seed Careers if empty
  const careerCount = (db.prepare('SELECT COUNT(*) as count FROM careers').get() as any).count;
  if (careerCount === 0) {
    const insertCareer = db.prepare(`
      INSERT INTO careers (id, title, department, location, type, experience, description, responsibilities_json, requirements_json, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of CAREERS) {
      insertCareer.run(
        c.id,
        c.title,
        c.department,
        c.location,
        c.type,
        c.experience,
        c.description,
        JSON.stringify(c.responsibilities || []),
        JSON.stringify(c.requirements || []),
        1,
        now
      );
    }
  }

  // 6. Seed FAQs if empty
  const faqCount = (db.prepare('SELECT COUNT(*) as count FROM faqs').get() as any).count;
  if (faqCount === 0) {
    const insertFaq = db.prepare(`
      INSERT INTO faqs (id, question, answer, category, sort_order, is_published)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    FAQS.forEach((f, idx) => {
      insertFaq.run(`faq_${idx + 1}`, f.question, f.answer, f.category, idx + 1, 1);
    });
  }

  // 7. Seed Site Settings if empty
  const settingsCount = (db.prepare('SELECT COUNT(*) as count FROM site_settings').get() as any).count;
  if (settingsCount === 0) {
    const insertSetting = db.prepare(`
      INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
    `);

    const initialSettings: Record<string, string> = {
      company_name: COMPANY_INFO.name,
      company_tagline: COMPANY_INFO.tagline,
      company_phone: COMPANY_INFO.headquarters.phone,
      company_email: COMPANY_INFO.headquarters.email,
      sales_email: COMPANY_INFO.headquarters.salesEmail,
      careers_email: COMPANY_INFO.headquarters.careersEmail,
      address: COMPANY_INFO.headquarters.address,
      city: COMPANY_INFO.headquarters.city,
      pin: COMPANY_INFO.headquarters.pin,
      whatsapp_number: '+918049999900',
      whatsapp_message: 'Hello 99 Builders, I am interested in scheduling a private project inspection.',
      google_maps_url: 'https://maps.google.com/?q=Bangalore+Skyline+Avenue',
      site_title_seo: '99 Builders & Developers | Luxury Real Estate & Civil Engineering',
      meta_description_seo: 'ISO 14001:2015 certified developers delivering luxury residential and commercial landmarks.',
    };

    for (const [key, value] of Object.entries(initialSettings)) {
      insertSetting.run(key, value, now);
    }
  }

  // 8. Seed sample Enquiries & Site Visits for analytics
  const enquiryCount = (db.prepare('SELECT COUNT(*) as count FROM enquiries').get() as any).count;
  if (enquiryCount === 0) {
    const insertEnquiry = db.prepare(`
      INSERT INTO enquiries (
        id, form_type, name, email, phone, project_id, subject, message,
        status, assigned_to, internal_notes, preferred_date, preferred_time, meta_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedEnquiries = [
      {
        id: 'enq_101',
        form_type: 'site_visit',
        name: 'Lord Arthur Pendelton',
        email: 'arthur@pendelton.co.uk',
        phone: '+44 7700 900123',
        project_id: 'aurora-sky-villas',
        subject: 'Duplex Sky Mansion Inspection',
        message: 'Requesting chauffeur pickup from Airport VIP Gate for Aurora Sky Residences inspection.',
        status: 'site_visit_scheduled',
        assigned_to: 'Meera Kapoor (Customer Experience)',
        internal_notes: 'High net worth client, interested in 52nd-floor penthouse duplex.',
        preferred_date: '2026-10-28',
        preferred_time: '10:30 AM',
        meta_json: JSON.stringify({ chauffeur: true, passCode: 'VISIT-99B-849120' }),
      },
      {
        id: 'enq_102',
        form_type: 'project',
        name: 'Priya Narayanan',
        email: 'priya.n@techholdings.sg',
        phone: '+65 9123 4567',
        project_id: 'meridian-tech-park',
        subject: 'Corporate Campus Lease RFP',
        message: 'Inquiring regarding 75,000 sq.ft contiguous floor plate leasing for AI engineering hub.',
        status: 'negotiation',
        assigned_to: 'Vikramaditya Rao (COO)',
        internal_notes: 'Draft term sheet delivered. Reviewing power redundancy specs.',
        preferred_date: '',
        preferred_time: '',
        meta_json: JSON.stringify({ company: 'Quantum Robotics SG' }),
      },
      {
        id: 'enq_103',
        form_type: 'brochure',
        name: 'Rajiv Mehra',
        email: 'rajiv.mehra@investgroup.com',
        phone: '+91 98450 11223',
        project_id: 'grand-verona-estates',
        subject: 'Approved Brochure Download',
        message: 'Downloaded Grand Verona Sovereign Villa monograph.',
        status: 'contacted',
        assigned_to: 'Sales Desk',
        internal_notes: 'Followed up via WhatsApp. Client reviewing master site plan.',
        preferred_date: '',
        preferred_time: '',
        meta_json: JSON.stringify({ units: '4 BHK Sovereign Villa' }),
      },
      {
        id: 'enq_104',
        form_type: 'general',
        name: 'Carlos Mendoza',
        email: 'carlos@mendoza-arch.com',
        phone: '+34 600 123 456',
        project_id: '',
        subject: 'Architectural Partnership Proposal',
        message: 'Proposing collaborative structural design for upcoming waterfront developments.',
        status: 'new',
        assigned_to: 'Ar. Ananya Sen',
        internal_notes: 'Portfolio received.',
        preferred_date: '',
        preferred_time: '',
        meta_json: JSON.stringify({ type: 'Partnership' }),
      },
    ];

    for (const e of seedEnquiries) {
      insertEnquiry.run(
        e.id,
        e.form_type,
        e.name,
        e.email,
        e.phone,
        e.project_id,
        e.subject,
        e.message,
        e.status,
        e.assigned_to,
        e.internal_notes,
        e.preferred_date,
        e.preferred_time,
        e.meta_json,
        now,
        now
      );
    }
  }

  // 9. Initial Audit Log
  const logCount = (db.prepare('SELECT COUNT(*) as count FROM audit_logs').get() as any).count;
  if (logCount === 0) {
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_name, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'log_init',
      'system',
      'System Initializer',
      'INITIALIZE_DATABASE',
      'system',
      'system',
      'Database initialized and seeded with ISO 14001:2015 99 Builders master records',
      now
    );
  }
}
