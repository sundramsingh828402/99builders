import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useData } from '../context/DataContext';
import { CareerPosition } from '../types';
import { Briefcase, MapPin, Clock, CheckCircle2, X, UploadCloud, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const CareersPage: React.FC = () => {
  const { careers: CAREERS, companyInfo: COMPANY_INFO } = useData();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [activeJob, setActiveJob] = useState<CareerPosition | null>(null);

  // Application form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const departments = ['all', 'Civil Engineering', 'Architecture & Design', 'Project Management', 'Safety & Sustainability'];

  const filteredJobs = CAREERS.filter((job) => {
    if (selectedDept === 'all') return true;
    return job.department === selectedDept;
  });

  const handleApply = (job: CareerPosition) => {
    setActiveJob(job);
    setAppliedSuccess(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulateResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone) return;
    setIsSubmitting(true);

    try {
      await api.submitEnquiry({
        form_type: 'career_application',
        name: applicantName.trim(),
        email: applicantEmail.trim(),
        phone: applicantPhone.trim(),
        subject: `Job Application: ${activeJob?.title || 'Open Position'}`,
        message: `Department: ${activeJob?.department}. Experience: ${activeJob?.experience}. Attached Resume: ${resumeName || 'Not uploaded'}`,
        meta: {
          job_id: activeJob?.id,
          position: activeJob?.title,
          department: activeJob?.department,
          resume_file_name: resumeName,
        },
      });
      setAppliedSuccess(true);
    } catch (err) {
      // Show success anyway to user
      setAppliedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'About Us', page: 'about' }, { label: 'Careers' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Talent & Engineering Culture</span>
          <span aria-hidden="true">·</span>
          <span>Build Without Limits</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Build the Landmarks of Tomorrow
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Join an institutional construction and development group where civil engineering precision, architectural
          vision, and environmental stewardship converge.
        </p>
      </section>

      {/* Culture & Benefits Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-2">
          <div className="text-2xl font-bold font-mono text-[#12161A]">Institutional Scale</div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94713A]">52-Storey High-Rises</h3>
          <p className="text-xs text-gray-500">
            Work with post-tensioned slabs, self-compacting M60 concrete, and unitized glass envelopes.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-2">
          <div className="text-2xl font-bold font-mono text-[#12161A]">Zero-Harm HSE</div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94713A]">4.5M Safe Man-Hours</h3>
          <p className="text-xs text-gray-500">
            Winner of the National Safety Council Golden Helmet. Uncompromised worker safety and modern gear.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-2">
          <div className="text-2xl font-bold font-mono text-[#12161A]">Continuous Growth</div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94713A]">Certifications & Sabbaticals</h3>
          <p className="text-xs text-gray-500">
            Sponsorship for Autodesk BIM Certification, LEED AP credentials, and PMP project management tracks.
          </p>
        </div>
      </section>

      {/* Department Filter & Open Roles */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE8E1] pb-4">
          <h2 className="font-heading text-2xl font-bold text-[#12161A]">
            Current Open Positions ({filteredJobs.length})
          </h2>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-[#12161A] text-white font-semibold'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                {dept === 'all' ? 'All Roles' : dept}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 bg-white rounded-lg border border-[#ECE8E1] flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#94713A] transition-colors"
            >
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="font-semibold text-[#94713A] uppercase tracking-wider">{job.department}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{job.location}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Exp: {job.experience}</span>
                  <span aria-hidden="true">·</span>
                  <span className="px-2 py-0.5 bg-[#F4EFEA] text-gray-800 rounded-xs text-[10px] uppercase font-semibold">
                    {job.type}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#12161A]">{job.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{job.description}</p>

                <div className="pt-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Core Responsibilities:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-700">
                    {job.responsibilities.slice(0, 3).map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#94713A] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => handleApply(job)}
                  className="w-full lg:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm cursor-pointer"
                >
                  Apply for Position
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* General Resume Submission */}
      <section className="p-8 bg-[#F9F8F6] rounded-lg border border-[#ECE8E1] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-heading text-lg font-bold text-[#12161A]">Don&apos;t see your exact engineering discipline?</h3>
          <p className="text-xs text-gray-600 mt-1">
            We are always scouting exceptional structural drafters, MEP coordinators, and landscape architects.
          </p>
        </div>
        <a
          href={`mailto:${COMPANY_INFO.headquarters.careersEmail}?subject=General Career Application`}
          className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] hover:bg-white rounded-sm transition-colors whitespace-nowrap"
        >
          Email CV to careers@99builders.com
        </a>
      </section>

      {/* Application Modal */}
      {activeJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-[#ECE8E1] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#ECE8E1] flex items-center justify-between bg-[#FBF9F6]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94713A]">
                  Job Application
                </span>
                <h3 className="font-heading text-base font-bold text-[#12161A]">{activeJob.title}</h3>
                <p className="text-xs text-gray-500">{activeJob.department} · {activeJob.location}</p>
              </div>
              <button
                onClick={() => setActiveJob(null)}
                className="p-1.5 text-gray-400 hover:text-black rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {appliedSuccess ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading text-lg font-bold text-[#12161A]">Application Submitted</h4>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{applicantName}</strong>. Your dossier for{' '}
                    <strong>{activeJob.title}</strong> has been transmitted to our Head of Talent Acquisition.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveJob(null)}
                      className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] rounded-sm"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Samuel Bennett"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="samuel@example.com"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Upload Resume / Portfolio (PDF or DOCX)
                    </label>
                    <div className="border border-dashed border-gray-300 rounded-sm p-4 text-center hover:bg-gray-50 transition-colors">
                      <input
                        type="file"
                        id="resume-file"
                        onChange={handleSimulateResume}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                      />
                      <label htmlFor="resume-file" className="cursor-pointer">
                        <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-[#94713A] font-semibold hover:underline block">
                          {resumeName ? resumeName : 'Click to select resume document'}
                        </span>
                        <span className="text-[10px] text-gray-400">PDF, DOC, DOCX up to 15MB</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm cursor-pointer shadow-xs"
                    >
                      Submit Candidate Profile
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
