import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PROJECTS, COMPANY_INFO } from '../data/mockData';
import { Calendar, Clock, Car, CheckCircle2, ShieldCheck, MapPin, ArrowRight, User, Phone, Mail, Ticket, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const SiteVisitPage: React.FC = () => {
  const { currentProjectId, navigate } = useNavigation();

  const [selectedProject, setSelectedProject] = useState<string>(currentProjectId || PROJECTS[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-25');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [chauffeurRequired, setChauffeurRequired] = useState<boolean>(true);
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [ticketReference, setTicketReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const projectObj = PROJECTS.find((p) => p.id === selectedProject) || PROJECTS[0];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setError('Please provide your full name, email address, and phone number.');
      return;
    }
    setError('');
    setLoading(true);

    const ref = `VISIT-99B-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketReference(ref);

    try {
      await api.submitEnquiry({
        form_type: 'site_visit',
        name: guestName.trim(),
        email: guestEmail.trim(),
        phone: guestPhone.trim(),
        project_id: selectedProject,
        preferred_date: selectedDate,
        preferred_time: selectedTime,
        subject: `Site Visit: ${projectObj.title}`,
        message: specialRequests || `Chauffeur transit requested: ${chauffeurRequired ? 'Yes (' + pickupAddress + ')' : 'No'}`,
        meta: {
          ticket_reference: ref,
          chauffeur_required: chauffeurRequired,
          pickup_address: pickupAddress,
          time_slot: selectedTime,
          inspection_date: selectedDate,
        },
      });
      setBookingConfirmed(true);
    } catch (err: any) {
      setError(err.message || 'Unable to schedule site visit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'Book a Site Visit' }]} />

      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>VIP On-Site Experience</span>
          <span aria-hidden="true">·</span>
          <span>Complimentary Chauffeur Transit</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Schedule a Private Site Inspection
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Walk the physical development site, inspect sample sky villas and penthouse finishes, and receive a private
          briefing from our Senior Relationship Directors.
        </p>
      </section>

      {bookingConfirmed ? (
        <section className="bg-white rounded-lg border border-[#ECE8E1] p-8 lg:p-12 shadow-md space-y-8 animate-in fade-in duration-200">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#12161A]">
              Site Visit Pass Confirmed
            </h2>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Your appointment for <strong>{projectObj.title}</strong> has been booked. A confirmation SMS and
              calendar invitation have been dispatched to <strong>{guestEmail}</strong>.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="max-w-md mx-auto bg-[#F9F8F6] rounded-lg border border-[#ECE8E1] p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#ECE8E1] pb-3">
              <span className="text-gray-400">BOARDING PASS</span>
              <span className="font-bold text-[#94713A]">{ticketReference}</span>
            </div>

            <div className="space-y-2">
              <div className="text-gray-400 text-[10px] uppercase">Development</div>
              <div className="font-sans font-bold text-sm text-[#12161A]">{projectObj.title}</div>
              <div className="text-gray-500 font-sans text-xs">{projectObj.location}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#ECE8E1]">
              <div>
                <span className="text-gray-400 text-[10px] uppercase block">Date</span>
                <strong className="text-[#12161A]">{selectedDate}</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase block">Time Window</span>
                <strong className="text-[#12161A]">{selectedTime}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-[#ECE8E1]">
              <span className="text-gray-400 text-[10px] uppercase block">Guest Name</span>
              <div className="font-sans text-[#12161A] font-semibold">{guestName}</div>
            </div>

            {chauffeurRequired && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-sm text-[11px] text-emerald-800 font-sans flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complimentary Chauffeur Transit Scheduled</span>
              </div>
            )}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setBookingConfirmed(false);
                navigate('projects');
              }}
              className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm"
            >
              Return to Master Projects
            </button>
          </div>
        </section>
      ) : (
        <form onSubmit={handleBooking} className="bg-white rounded-lg border border-[#ECE8E1] p-6 lg:p-8 shadow-xs space-y-8">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Select Project */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#12161A]">
              1. Select Project & Experience Pavilion
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-sm bg-white focus:outline-hidden focus:border-[#94713A] font-medium text-gray-800"
            >
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.location} ({p.subCategory})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Date & Time */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#12161A]">
              2. Preferred Inspection Date & Time
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-[11px] text-gray-500 mb-1">Select Date</span>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>

              <div>
                <span className="block text-[11px] text-gray-500 mb-1">Time Slot</span>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm bg-white focus:outline-hidden focus:border-[#94713A]"
                >
                  <option value="10:00 AM">Morning Session — 10:00 AM</option>
                  <option value="11:30 AM">Morning Session — 11:30 AM</option>
                  <option value="02:30 PM">Afternoon Session — 02:30 PM</option>
                  <option value="04:30 PM">Sunset Golden Hour — 04:30 PM (Recommended for Views)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Chauffeur Service Assistance */}
          <div className="space-y-3 p-5 bg-[#F9F8F6] rounded-lg border border-[#ECE8E1]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#94713A]" />
                <div>
                  <h4 className="text-xs font-bold text-[#12161A]">Complimentary VIP Chauffeur Pickup</h4>
                  <p className="text-[11px] text-gray-500">
                    We arrange private door-to-door transit from your residence, hotel, or airport.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                id="chauffeur-toggle"
                checked={chauffeurRequired}
                onChange={(e) => setChauffeurRequired(e.target.checked)}
                className="w-4 h-4 accent-[#12161A]"
              />
            </div>

            {chauffeurRequired && (
              <div className="pt-2">
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Pickup Address / Airport Terminal
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. The Oberoi Hotel or Terminal 1 Arrivals"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm bg-white focus:outline-hidden focus:border-[#94713A]"
                />
              </div>
            )}
          </div>

          {/* Step 4: Visitor Contact Details */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#12161A]">
              3. Guest Details & Security Pre-Clearance
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="block text-[11px] text-gray-500 mb-1">Full Name *</span>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Richard Wright"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>

              <div>
                <span className="block text-[11px] text-gray-500 mb-1">Email *</span>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="richard@wright.com"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>

              <div>
                <span className="block text-[11px] text-gray-500 mb-1">Mobile / WhatsApp *</span>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Special Preferences (Optional)
            </label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Wish to inspect duplex penthouses on floors 45+ or discuss customized kitchen fit-outs..."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-[#ECE8E1] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#94713A]" />
              <span>Private Inspection Guarantee</span>
            </div>
            <button
              type="submit"
              className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Ticket className="w-4 h-4 text-[#C5A880]" />
              <span>Confirm Site Visit Pass</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
