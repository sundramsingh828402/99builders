import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { db, initDatabase, hashPassword, verifyPassword } from './server/db.ts';

// Initialize Database & seed if necessary
initDatabase();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    cb(null, `${sanitizedBase}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf', '.doc', '.docx', '.txt', '.mp4'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File extension ${ext} is not allowed.`));
    }
  },
});

// Audit logger helper
function logAuditEvent(userId: string, userName: string, action: string, entityType: string, entityId: string, details: string) {
  try {
    const id = `log_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_name, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, userName, action, entityType, entityId, details, new Date().toISOString());
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}

// In-memory rate limiting map for public forms
const submissionRateMap = new Map<string, { count: number; firstSeen: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxSubmissions = 15;

  const entry = submissionRateMap.get(ip);
  if (!entry || now - entry.firstSeen > windowMs) {
    submissionRateMap.set(ip, { count: 1, firstSeen: now });
    return true;
  }

  if (entry.count >= maxSubmissions) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Admin Authentication Middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'super_admin' | 'editor' | 'lead_manager';
  };
}

function requireAdminAuth(allowedRoles?: ('super_admin' | 'editor' | 'lead_manager')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.session_token ||
      (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.split('Bearer ')[1]
        : null);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Session missing or expired' });
    }

    const session = db
      .prepare(`
        SELECT s.token, s.expires_at, u.id, u.email, u.name, u.role
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ?
      `)
      .get(token) as any;

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized: Invalid session token' });
    }

    if (new Date(session.expires_at) < new Date()) {
      db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
      return res.status(401).json({ error: 'Unauthorized: Session has expired' });
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
      return res.status(403).json({ error: `Forbidden: Requires role [${allowedRoles.join(', ')}]` });
    }

    req.user = {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    };

    next();
  };
}

// Helper to normalize Project records across snake_case DB columns and camelCase UI types
function normalizeProject(p: any) {
  if (!p) return null;
  return {
    ...p,
    id: p.id,
    title: p.title,
    tagline: p.tagline,
    category: p.category,
    subCategory: p.sub_category || p.subCategory,
    status: p.status,
    location: p.location,
    cityHub: p.city_hub || p.cityHub,
    priceStarting: p.price_starting || p.priceStarting,
    unitsOrArea: p.units_or_area || p.unitsOrArea,
    reraNumber: p.rera_number || p.reraNumber,
    heroImage: p.hero_image || p.heroImage,
    videoTourUrl: p.video_tour_url || p.videoTourUrl || '',
    overview: p.overview,
    architectureFirm: p.architecture_firm || p.architectureFirm,
    overallProgress: p.overall_progress ?? p.overallProgress ?? 0,
    possessionDate: p.possession_date || p.possessionDate,
    gallery: typeof p.gallery_json === 'string' ? JSON.parse(p.gallery_json || '[]') : (p.gallery || []),
    amenities: typeof p.amenities_json === 'string' ? JSON.parse(p.amenities_json || '[]') : (p.amenities || []),
    specifications: typeof p.specifications_json === 'string' ? JSON.parse(p.specifications_json || '[]') : (p.specifications || []),
    milestones: typeof p.milestones_json === 'string' ? JSON.parse(p.milestones_json || '[]') : (p.milestones || []),
    featured: Boolean(p.featured),
    isPublished: Boolean(p.is_published ?? 1),
  };
}

function normalizeArticle(a: any) {
  if (!a) return null;
  return {
    ...a,
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category,
    date: a.date,
    readTime: a.read_time || a.readTime || '4 min read',
    summary: a.summary,
    content: typeof a.content_json === 'string' ? JSON.parse(a.content_json || '[]') : (a.content || []),
    image: a.image,
    author: a.author,
    tags: typeof a.tags_json === 'string' ? JSON.parse(a.tags_json || '[]') : (a.tags || []),
    isPressRelease: a.type === 'press' || Boolean(a.isPressRelease),
    isPublished: Boolean(a.is_published ?? 1),
  };
}

// ==========================================
// 1. PUBLIC API ROUTES & SEO ASSETS
// ==========================================

// Dynamic Robots.txt
app.get('/robots.txt', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const origin = `${protocol}://${host}`;

  const content = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin-login',
    'Disallow: /api/admin/',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
  ].join('\n');

  res.header('Content-Type', 'text/plain');
  res.send(content);
});

// Dynamic XML Sitemap
app.get('/sitemap.xml', (req: Request, res: Response) => {
  try {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const origin = `${protocol}://${host}`;
    const now = new Date().toISOString().split('T')[0];

    const staticPages = [
      '',
      '?page=about',
      '?page=profile',
      '?page=team',
      '?page=projects',
      '?page=residential',
      '?page=commercial',
      '?page=services',
      '?page=locations',
      '?page=media-gallery',
      '?page=video-gallery',
      '?page=news',
      '?page=press',
      '?page=blog',
      '?page=events',
      '?page=careers',
      '?page=contact',
      '?page=site-visit',
      '?page=download-brochure',
      '?page=faq',
      '?page=privacy',
      '?page=terms',
      '?page=disclaimer',
    ];

    const projects = db.prepare('SELECT id, updated_at FROM projects WHERE is_published = 1').all() as any[];
    const articles = db.prepare('SELECT id, slug, updated_at FROM articles WHERE is_published = 1').all() as any[];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages
    for (const p of staticPages) {
      const priority = p === '' ? '1.0' : p.includes('projects') || p.includes('residential') || p.includes('commercial') ? '0.9' : '0.8';
      xml += `  <url>\n    <loc>${origin}/${p}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    }

    // Projects
    for (const pr of projects) {
      xml += `  <url>\n    <loc>${origin}/?page=project-detail&amp;id=${pr.id}</loc>\n    <lastmod>${(pr.updated_at || now).split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }

    // Articles
    for (const ar of articles) {
      xml += `  <url>\n    <loc>${origin}/?page=news-article&amp;id=${ar.slug || ar.id}</loc>\n    <lastmod>${(ar.updated_at || now).split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err: any) {
    res.status(500).send('Error generating sitemap');
  }
});

// Get all published projects
app.get('/api/public/projects', (_req: Request, res: Response) => {
  try {
    const projects = db.prepare('SELECT * FROM projects WHERE is_published = 1 ORDER BY featured DESC, created_at DESC').all() as any[];
    res.json(projects.map(normalizeProject));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single published project by ID
app.get('/api/public/projects/:id', (req: Request, res: Response) => {
  try {
    const p = db.prepare('SELECT * FROM projects WHERE id = ? AND is_published = 1').get(req.params.id) as any;
    if (!p) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(normalizeProject(p));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get articles (news, press, blog)
app.get('/api/public/articles', (req: Request, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    let query = 'SELECT * FROM articles WHERE is_published = 1';
    const params: any[] = [];
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    query += ' ORDER BY created_at DESC';

    const articles = db.prepare(query).all(...params) as any[];
    res.json(articles.map(normalizeArticle));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single article by ID or slug
app.get('/api/public/articles/:id', (req: Request, res: Response) => {
  try {
    const a = db.prepare('SELECT * FROM articles WHERE (id = ? OR slug = ?) AND is_published = 1').get(req.params.id, req.params.id) as any;
    if (!a) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(normalizeArticle(a));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get events
app.get('/api/public/events', (_req: Request, res: Response) => {
  try {
    const events = db.prepare('SELECT * FROM events WHERE is_published = 1 ORDER BY date ASC').all() as any[];
    res.json(events.map((e) => ({ ...e, rsvpOpen: Boolean(e.rsvp_open) })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get careers
app.get('/api/public/careers', (_req: Request, res: Response) => {
  try {
    const careers = db.prepare('SELECT * FROM careers WHERE is_published = 1 ORDER BY created_at DESC').all() as any[];
    res.json(careers.map((c) => ({
      ...c,
      responsibilities: JSON.parse(c.responsibilities_json || '[]'),
      requirements: JSON.parse(c.requirements_json || '[]'),
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get FAQs
app.get('/api/public/faqs', (_req: Request, res: Response) => {
  try {
    const faqs = db.prepare('SELECT * FROM faqs WHERE is_published = 1 ORDER BY sort_order ASC').all();
    res.json(faqs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get public site settings
app.get('/api/public/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.prepare('SELECT key, value FROM site_settings').all() as any[];
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    res.json(map);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Universal Form Submission Handler
app.post('/api/public/enquiries', (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests. Please wait a moment before submitting again.' });
    }

    const {
      form_type = 'general',
      name,
      email,
      phone,
      project_id = '',
      subject = '',
      message = '',
      preferred_date = '',
      preferred_time = '',
      meta = {},
    } = req.body;

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Valid full name is required' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
      return res.status(400).json({ error: 'Valid mobile number is required' });
    }

    const id = `enq_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO enquiries (
        id, form_type, name, email, phone, project_id, subject, message,
        status, assigned_to, internal_notes, preferred_date, preferred_time, meta_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      form_type,
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      project_id || '',
      subject.trim() || `${form_type.toUpperCase()} Submission`,
      message.trim(),
      'new',
      null,
      '',
      preferred_date || '',
      preferred_time || '',
      JSON.stringify(meta),
      now,
      now
    );

    // If site visit, generate reference code
    let referenceCode = '';
    if (form_type === 'site_visit') {
      referenceCode = `VISIT-99B-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    res.status(201).json({
      success: true,
      id,
      referenceCode,
      message: 'Submission successfully received and logged to the central database.',
    });
  } catch (err: any) {
    console.error('Enquiry submission error:', err);
    res.status(500).json({ error: 'Failed to record submission' });
  }
});

// ==========================================
// 2. ADMIN AUTHENTICATION API ROUTES
// ==========================================

// Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase()) as any;
    if (!user) {
      return res.status(401).json({ error: 'Invalid administrator credentials' });
    }

    const valid = verifyPassword(password, user.password_hash, user.password_salt);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid administrator credentials' });
    }

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    db.prepare(`
      INSERT INTO sessions (token, user_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `).run(token, user.id, expiresAt, new Date().toISOString());

    // Update last login
    db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').run(new Date().toISOString(), user.id);

    // Set HTTP-only secure cookie
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logAuditEvent(user.id, user.name, 'LOGIN', 'user', user.id, `User ${user.email} logged in successfully`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const token = req.cookies?.session_token || req.headers.authorization?.split('Bearer ')[1];
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }
  res.clearCookie('session_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Current User Profile
app.get('/api/admin/me', requireAdminAuth(), (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// Change Password
app.post('/api/admin/change-password', requireAdminAuth(), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.id) as any;
    if (!verifyPassword(currentPassword, user.password_hash, user.password_salt)) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }

    const { hash, salt } = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').run(hash, salt, user.id);

    logAuditEvent(user.id, user.name, 'PASSWORD_CHANGE', 'user', user.id, 'Administrator password updated');

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. ADMIN DASHBOARD & ANALYTICS
// ==========================================

app.get('/api/admin/dashboard-stats', requireAdminAuth(), (_req: Request, res: Response) => {
  try {
    // Real database counts
    const totalProjects = (db.prepare('SELECT COUNT(*) as c FROM projects').get() as any).c;
    const ongoingProjects = (db.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'ongoing'").get() as any).c;
    const completedProjects = (db.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'completed'").get() as any).c;
    const upcomingProjects = (db.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'upcoming'").get() as any).c;

    const totalEnquiries = (db.prepare('SELECT COUNT(*) as c FROM enquiries').get() as any).c;
    const newLeads = (db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status = 'new'").get() as any).c;
    const siteVisitsCount = (db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE form_type = 'site_visit'").get() as any).c;

    const recentEnquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5').all() as any[];
    const recentAuditLogs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 5').all() as any[];

    res.json({
      totalProjects,
      ongoingProjects,
      completedProjects,
      upcomingProjects,
      totalEnquiries,
      newLeads,
      siteVisitsCount,
      recentEnquiries: recentEnquiries.map((e) => ({
        ...e,
        meta: JSON.parse(e.meta_json || '{}'),
      })),
      recentAuditLogs,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. ADMIN PROJECTS CRUD
// ==========================================

app.get('/api/admin/projects', requireAdminAuth(), (_req: Request, res: Response) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all() as any[];
    const parsed = projects.map((p) => ({
      ...p,
      gallery: JSON.parse(p.gallery_json || '[]'),
      amenities: JSON.parse(p.amenities_json || '[]'),
      specifications: JSON.parse(p.specifications_json || '[]'),
      milestones: JSON.parse(p.milestones_json || '[]'),
      featured: Boolean(p.featured),
      is_published: Boolean(p.is_published),
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/projects', requireAdminAuth(['super_admin', 'editor']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const p = req.body;
    const id = p.id || `proj_${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO projects (
        id, title, tagline, category, sub_category, status, is_published,
        location, city_hub, price_starting, units_or_area, rera_number,
        hero_image, gallery_json, video_tour_url, overview, architecture_firm,
        overall_progress, possession_date, amenities_json, specifications_json,
        milestones_json, featured, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      p.title || 'Untitled Project',
      p.tagline || '',
      p.category || 'residential',
      p.sub_category || 'Luxury Residences',
      p.status || 'ongoing',
      p.is_published !== undefined ? (p.is_published ? 1 : 0) : 1,
      p.location || '',
      p.city_hub || 'Waterfront Promenade',
      p.price_starting || 'Price on Application',
      p.units_or_area || '',
      p.rera_number || '[Demo RERA No: PRM/KA/RERA/1251/DEMO-99]',
      p.hero_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      JSON.stringify(p.gallery || []),
      p.video_tour_url || '',
      p.overview || '',
      p.architecture_firm || '99 Design Atelier',
      p.overall_progress || 0,
      p.possession_date || 'Target 2028',
      JSON.stringify(p.amenities || []),
      JSON.stringify(p.specifications || []),
      JSON.stringify(p.milestones || []),
      p.featured ? 1 : 0,
      now,
      now
    );

    logAuditEvent(req.user!.id, req.user!.name, 'CREATE_PROJECT', 'project', id, `Created project: ${p.title}`);

    res.status(201).json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/projects/:id', requireAdminAuth(['super_admin', 'editor']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const p = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE projects SET
        title = ?, tagline = ?, category = ?, sub_category = ?, status = ?, is_published = ?,
        location = ?, city_hub = ?, price_starting = ?, units_or_area = ?, rera_number = ?,
        hero_image = ?, gallery_json = ?, video_tour_url = ?, overview = ?, architecture_firm = ?,
        overall_progress = ?, possession_date = ?, amenities_json = ?, specifications_json = ?,
        milestones_json = ?, featured = ?, updated_at = ?
      WHERE id = ?
    `).run(
      p.title,
      p.tagline,
      p.category,
      p.sub_category,
      p.status,
      p.is_published ? 1 : 0,
      p.location,
      p.city_hub,
      p.price_starting,
      p.units_or_area,
      p.rera_number,
      p.hero_image,
      JSON.stringify(p.gallery || []),
      p.video_tour_url,
      p.overview,
      p.architecture_firm,
      p.overall_progress,
      p.possession_date,
      JSON.stringify(p.amenities || []),
      JSON.stringify(p.specifications || []),
      JSON.stringify(p.milestones || []),
      p.featured ? 1 : 0,
      now,
      id
    );

    logAuditEvent(req.user!.id, req.user!.name, 'UPDATE_PROJECT', 'project', id, `Updated project: ${p.title}`);

    res.json({ success: true, message: 'Project updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/projects/:id', requireAdminAuth(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    logAuditEvent(req.user!.id, req.user!.name, 'DELETE_PROJECT', 'project', id, `Deleted project id: ${id}`);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. ADMIN ENQUIRIES & LEADS MANAGEMENT
// ==========================================

app.get('/api/admin/enquiries', requireAdminAuth(), (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const formType = req.query.form_type as string | undefined;

    let query = 'SELECT * FROM enquiries WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (formType && formType !== 'all') {
      query += ' AND form_type = ?';
      params.push(formType);
    }

    query += ' ORDER BY created_at DESC';

    const enquiries = db.prepare(query).all(...params) as any[];
    res.json(
      enquiries.map((e) => ({
        ...e,
        meta: JSON.parse(e.meta_json || '{}'),
      }))
    );
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/enquiries/:id', requireAdminAuth(['super_admin', 'lead_manager']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { status, assigned_to, internal_notes } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE enquiries SET
        status = coalesce(?, status),
        assigned_to = coalesce(?, assigned_to),
        internal_notes = coalesce(?, internal_notes),
        updated_at = ?
      WHERE id = ?
    `).run(status, assigned_to, internal_notes, now, id);

    logAuditEvent(req.user!.id, req.user!.name, 'UPDATE_LEAD', 'enquiry', id, `Updated lead status to: ${status}`);

    res.json({ success: true, message: 'Enquiry updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/enquiries/:id', requireAdminAuth(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM enquiries WHERE id = ?').run(id);
    logAuditEvent(req.user!.id, req.user!.name, 'DELETE_LEAD', 'enquiry', id, `Deleted lead record: ${id}`);
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CSV Export for authorized managers
app.get('/api/admin/enquiries/export', requireAdminAuth(['super_admin', 'lead_manager']), (_req: Request, res: Response) => {
  try {
    const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all() as any[];
    const headers = ['ID', 'Type', 'Name', 'Email', 'Phone', 'Project ID', 'Status', 'Assigned To', 'Created At'];
    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${e.form_type}"`,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.project_id || ''}"`,
      `"${e.status}"`,
      `"${e.assigned_to || ''}"`,
      `"${e.created_at}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="99builders_leads_${Date.now()}.csv"`);
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. ADMIN ARTICLES (NEWS / PRESS / BLOG)
// ==========================================

app.get('/api/admin/articles', requireAdminAuth(), (_req: Request, res: Response) => {
  try {
    const articles = db.prepare('SELECT * FROM articles ORDER BY created_at DESC').all() as any[];
    res.json(
      articles.map((a) => ({
        ...a,
        content: JSON.parse(a.content_json || '[]'),
        tags: JSON.parse(a.tags_json || '[]'),
        is_published: Boolean(a.is_published),
      }))
    );
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/articles', requireAdminAuth(['super_admin', 'editor']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const a = req.body;
    const id = a.id || `art_${Date.now()}`;
    const slug = a.slug || id;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO articles (
        id, title, slug, type, category, date, read_time,
        summary, content_json, image, author, tags_json, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      a.title,
      slug,
      a.type || 'news',
      a.category || 'Corporate',
      a.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      a.read_time || '3 min read',
      a.summary || '',
      JSON.stringify(Array.isArray(a.content) ? a.content : [a.content || '']),
      a.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      a.author || 'Corporate Communications',
      JSON.stringify(a.tags || []),
      a.is_published ? 1 : 0,
      now,
      now
    );

    logAuditEvent(req.user!.id, req.user!.name, 'CREATE_ARTICLE', 'article', id, `Created article: ${a.title}`);

    res.status(201).json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/articles/:id', requireAdminAuth(['super_admin', 'editor']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const a = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE articles SET
        title = ?, slug = ?, type = ?, category = ?, read_time = ?,
        summary = ?, content_json = ?, image = ?, author = ?, tags_json = ?,
        is_published = ?, updated_at = ?
      WHERE id = ?
    `).run(
      a.title,
      a.slug,
      a.type,
      a.category,
      a.read_time,
      a.summary,
      JSON.stringify(Array.isArray(a.content) ? a.content : [a.content]),
      a.image,
      a.author,
      JSON.stringify(a.tags || []),
      a.is_published ? 1 : 0,
      now,
      id
    );

    logAuditEvent(req.user!.id, req.user!.name, 'UPDATE_ARTICLE', 'article', id, `Updated article: ${a.title}`);

    res.json({ success: true, message: 'Article updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/articles/:id', requireAdminAuth(['super_admin', 'editor']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    logAuditEvent(req.user!.id, req.user!.name, 'DELETE_ARTICLE', 'article', id, `Deleted article id: ${id}`);
    res.json({ success: true, message: 'Article deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. ADMIN MEDIA MANAGEMENT & UPLOAD
// ==========================================

app.post('/api/admin/media/upload', requireAdminAuth(['super_admin', 'editor']), upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { category = 'General', title = req.file.originalname, caption = '' } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const fileType = ['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext)
      ? 'image'
      : ['.mp4'].includes(ext)
      ? 'video'
      : 'document';

    const id = `med_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO media_files (id, title, file_url, file_type, file_size, category, caption, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, fileUrl, fileType, req.file.size, category, caption, now);

    logAuditEvent(req.user!.id, req.user!.name, 'UPLOAD_MEDIA', 'media', id, `Uploaded file: ${req.file.originalname}`);

    res.status(201).json({
      success: true,
      file: {
        id,
        title,
        fileUrl,
        fileType,
        size: req.file.size,
        category,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/media', requireAdminAuth(), (_req: Request, res: Response) => {
  try {
    const files = db.prepare('SELECT * FROM media_files ORDER BY created_at DESC').all();
    res.json(files);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/media/:id', requireAdminAuth(['super_admin', 'editor']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = db.prepare('SELECT * FROM media_files WHERE id = ?').get(req.params.id) as any;
    if (file) {
      const diskPath = path.resolve(process.cwd(), 'public', file.file_url.replace(/^\//, ''));
      if (fs.existsSync(diskPath)) {
        fs.unlinkSync(diskPath);
      }
      db.prepare('DELETE FROM media_files WHERE id = ?').run(req.params.id);
      logAuditEvent(req.user!.id, req.user!.name, 'DELETE_MEDIA', 'media', file.id, `Deleted file: ${file.title}`);
    }
    res.json({ success: true, message: 'File removed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. ADMIN SITE SETTINGS & AUDIT LOGS
// ==========================================

app.get('/api/admin/settings', requireAdminAuth(), (_req: Request, res: Response) => {
  try {
    const settings = db.prepare('SELECT key, value, updated_at FROM site_settings').all() as any[];
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    res.json(map);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/settings', requireAdminAuth(['super_admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const entries = req.body;
    const now = new Date().toISOString();
    const updateStmt = db.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `);

    for (const [key, val] of Object.entries(entries)) {
      updateStmt.run(key, String(val), now);
    }

    logAuditEvent(req.user!.id, req.user!.name, 'UPDATE_SETTINGS', 'settings', 'all', 'Updated corporate site settings');

    res.json({ success: true, message: 'Settings saved' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/audit-logs', requireAdminAuth(['super_admin']), (_req: Request, res: Response) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 9. VITE DEV MIDDLEWARE / STATIC PRODUCTION
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[99 Builders Backend Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
});
