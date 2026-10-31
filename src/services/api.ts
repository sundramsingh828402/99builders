import { Project, EnquiryRecord, MediaRecord, AuditLogRecord } from '../types';

export const api = {
  // Public Form Submissions
  async submitEnquiry(data: {
    form_type: string;
    name: string;
    email: string;
    phone: string;
    project_id?: string;
    subject?: string;
    message?: string;
    preferred_date?: string;
    preferred_time?: string;
    meta?: Record<string, any>;
  }) {
    const res = await fetch('/api/public/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit form');
    }
    return result;
  },

  async getPublicSettings(): Promise<Record<string, string>> {
    const res = await fetch('/api/public/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async getPublicProjects(): Promise<Project[]> {
    const res = await fetch('/api/public/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getPublicProject(id: string): Promise<Project> {
    const res = await fetch(`/api/public/projects/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },

  async getPublicArticles(type?: string): Promise<any[]> {
    const url = type ? `/api/public/articles?type=${encodeURIComponent(type)}` : '/api/public/articles';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch articles');
    return res.json();
  },

  async getPublicArticle(idOrSlug: string): Promise<any> {
    const res = await fetch(`/api/public/articles/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) throw new Error('Failed to fetch article');
    return res.json();
  },

  async getPublicEvents(): Promise<any[]> {
    const res = await fetch('/api/public/events');
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  async getPublicCareers(): Promise<any[]> {
    const res = await fetch('/api/public/careers');
    if (!res.ok) throw new Error('Failed to fetch careers');
    return res.json();
  },

  async getPublicFaqs(): Promise<any[]> {
    const res = await fetch('/api/public/faqs');
    if (!res.ok) throw new Error('Failed to fetch faqs');
    return res.json();
  },

  // Admin API Methods
  async getDashboardStats(token: string) {
    const res = await fetch('/api/admin/dashboard-stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load dashboard statistics');
    return res.json();
  },

  async getAdminProjects(token: string): Promise<any[]> {
    const res = await fetch('/api/admin/projects', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async saveAdminProject(token: string, project: any, isEdit = false): Promise<any> {
    const url = isEdit ? `/api/admin/projects/${project.id}` : '/api/admin/projects';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save project');
    }
    return res.json();
  },

  async deleteAdminProject(token: string, id: string): Promise<any> {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  async getAdminEnquiries(token: string, status?: string, formType?: string): Promise<EnquiryRecord[]> {
    let url = '/api/admin/enquiries?';
    if (status) url += `status=${encodeURIComponent(status)}&`;
    if (formType) url += `form_type=${encodeURIComponent(formType)}&`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  },

  async updateAdminEnquiry(token: string, id: string, data: Partial<EnquiryRecord>): Promise<any> {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update enquiry');
    return res.json();
  },

  async deleteAdminEnquiry(token: string, id: string): Promise<any> {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete enquiry');
    return res.json();
  },

  async getAdminArticles(token: string): Promise<any[]> {
    const res = await fetch('/api/admin/articles', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch articles');
    return res.json();
  },

  async saveAdminArticle(token: string, article: any, isEdit = false): Promise<any> {
    const url = isEdit ? `/api/admin/articles/${article.id}` : '/api/admin/articles';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(article),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save article');
    }
    return res.json();
  },

  async deleteAdminArticle(token: string, id: string): Promise<any> {
    const res = await fetch(`/api/admin/articles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete article');
    return res.json();
  },

  async getAdminMedia(token: string): Promise<MediaRecord[]> {
    const res = await fetch('/api/admin/media', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch media');
    return res.json();
  },

  async uploadMedia(token: string, formData: FormData): Promise<any> {
    const res = await fetch('/api/admin/media/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upload media');
    }
    return res.json();
  },

  async deleteMedia(token: string, id: string): Promise<any> {
    const res = await fetch(`/api/admin/media/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete media');
    return res.json();
  },

  async getAdminSettings(token: string): Promise<Record<string, string>> {
    const res = await fetch('/api/admin/settings', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async saveAdminSettings(token: string, settings: Record<string, string>): Promise<any> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to save settings');
    return res.json();
  },

  async getAdminAuditLogs(token: string): Promise<AuditLogRecord[]> {
    const res = await fetch('/api/admin/audit-logs', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },
};
