import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { MediaRecord } from '../../types';
import { UploadCloud, Trash2, Copy, CheckCircle2, FileText, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';

export const AdminMediaManager: React.FC = () => {
  const { token, adminUser } = useAdminAuth();
  const [mediaList, setMediaList] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('Architectural Images');
  const [caption, setCaption] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadMedia = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminMedia(token);
      setMediaList(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [token]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !token) return;
    const file = e.target.files[0];

    // Client-side file size validation (25MB)
    if (file.size > 25 * 1024 * 1024) {
      setError('File exceeds maximum allowable size limit of 25MB.');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('caption', caption);
    formData.append('title', file.name);

    try {
      await api.uploadMedia(token, formData);
      setFeedback(`File "${file.name}" uploaded successfully.`);
      setTimeout(() => setFeedback(''), 3000);
      setCaption('');
      loadMedia();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!token) return;
    if (!window.confirm(`Permanently remove file: "${title}"?`)) return;
    try {
      await api.deleteMedia(token, id);
      setFeedback('Media file deleted.');
      setTimeout(() => setFeedback(''), 3000);
      loadMedia();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-[#12161A]">Media Assets & Document Storage</h2>
        <p className="text-xs text-gray-500">
          Upload and organize project photographs, approved brochure PDFs, legal RERA plans, and video assets.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
          {error}
        </div>
      )}

      {/* Upload Box */}
      {['super_admin', 'editor'].includes(adminUser?.role || '') && (
        <div className="bg-white p-6 rounded-lg border border-[#ECE8E1] shadow-xs space-y-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#12161A]">
            Upload New Media File
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Asset Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-white"
              >
                <option value="Architectural Images">Architectural Exterior / Interior Images</option>
                <option value="Project Brochures">Project Brochures & Specifications (PDF)</option>
                <option value="Statutory RERA Documents">Statutory RERA & Sanction Plans</option>
                <option value="Drone & Aerials">Drone Photos & Videos</option>
                <option value="Company Logos & Seals">Company Logos & Seals</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Asset Caption / Description</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. 52nd Floor Penthouse Horizon Perspective"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm"
              />
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 hover:border-[#94713A] rounded-lg p-6 text-center transition-colors">
            <input
              type="file"
              id="admin-media-file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.doc,.docx,.txt,.mp4"
            />
            <label htmlFor="admin-media-file" className="cursor-pointer space-y-2 block">
              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto" />
              <div>
                <span className="text-xs font-semibold text-[#94713A] hover:underline">
                  {uploading ? 'Transmitting file to server...' : 'Click to select file or drop here'}
                </span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  Supported: JPG, PNG, WEBP, SVG, PDF, DOC, MP4 (Max 25MB)
                </span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Media Files Grid */}
      <div className="bg-white rounded-lg border border-[#ECE8E1] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-[#12161A]">
            Stored Media Library ({mediaList.length} Files)
          </h3>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading stored media records...</div>
        ) : mediaList.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">
            No uploaded media files in database yet. Use the upload area above to add files.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaList.map((file) => (
              <div
                key={file.id}
                className="border border-[#ECE8E1] rounded-lg overflow-hidden flex flex-col justify-between bg-white hover:border-[#94713A] transition-colors"
              >
                {/* File Preview */}
                <div className="aspect-16/10 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {file.file_type === 'image' ? (
                    <img src={file.file_url} alt={file.title} className="w-full h-full object-cover" />
                  ) : file.file_type === 'video' ? (
                    <Video className="w-8 h-8 text-[#94713A]" />
                  ) : (
                    <FileText className="w-8 h-8 text-[#94713A]" />
                  )}
                  <span className="absolute top-2 left-2 bg-[#12161A]/85 text-white text-[9px] uppercase px-1.5 py-0.5 rounded-xs font-semibold">
                    {file.file_type}
                  </span>
                </div>

                {/* Details */}
                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-[#12161A] truncate text-[11px]" title={file.title}>
                      {file.title}
                    </h4>
                    <div className="text-[10px] text-gray-400 truncate">{file.category}</div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {(file.file_size / 1024).toFixed(1)} KB
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#ECE8E1] flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(file.file_url, file.id)}
                      className="text-[11px] text-[#94713A] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId === file.id ? 'Copied!' : 'Copy Path'}</span>
                    </button>

                    {['super_admin', 'editor'].includes(adminUser?.role || '') && (
                      <button
                        onClick={() => handleDelete(file.id, file.title)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
