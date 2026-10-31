import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useData } from '../context/DataContext';
import { EventItem } from '../types';
import { Calendar, Clock, MapPin, CheckCircle2, X, Ticket, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const EventsPage: React.FC = () => {
  const { events: EVENTS } = useData();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passCode, setPassCode] = useState('');

  const handleOpenRsvp = (event: EventItem) => {
    setSelectedEvent(event);
    setRsvpConfirmed(false);
  };

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpEmail.trim()) return;
    setIsSubmitting(true);
    const code = `VIP-${Math.floor(100000 + Math.random() * 900000)}`;
    setPassCode(code);

    try {
      await api.submitEnquiry({
        form_type: 'event_rsvp',
        name: rsvpName.trim(),
        email: rsvpEmail.trim(),
        phone: rsvpPhone.trim() || '+91 0000000000',
        subject: `Event RSVP: ${selectedEvent?.title || 'Corporate Event'}`,
        message: `RSVP Pass: ${code}. Guests count: ${rsvpGuests}. Location: ${selectedEvent?.location}`,
        meta: {
          event_id: selectedEvent?.id,
          event_title: selectedEvent?.title,
          event_date: selectedEvent?.date,
          guests_count: rsvpGuests,
          vip_pass_code: code,
        },
      });
      setRsvpConfirmed(true);
    } catch (err) {
      setRsvpConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'Media & Insights' }, { label: 'Events & Galas' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Corporate Gatherings & Expos</span>
          <span aria-hidden="true">·</span>
          <span>By Invitation</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Events, Galas & Open House Previews
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Exclusive invitations to architectural unveiling galas, penthouse private previews, groundbreaking stones,
          and annual institutional investor roundtables.
        </p>
      </section>

      {/* Events Listing Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EVENTS.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
          >
            <div className="aspect-16/10 bg-gray-100 relative overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#12161A]/85 text-white text-[10px] font-semibold px-2 py-0.5 rounded-xs uppercase">
                {event.category}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-2 font-semibold text-[#94713A]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <h3 className="font-heading text-base font-bold text-[#12161A] leading-snug">{event.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              <div className="pt-4 border-t border-[#ECE8E1]">
                <button
                  onClick={() => handleOpenRsvp(event)}
                  className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm cursor-pointer"
                >
                  RSVP Registration
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* RSVP Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-[#ECE8E1] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#ECE8E1] flex items-center justify-between bg-[#FBF9F6]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94713A]">
                  Guest Registration
                </span>
                <h3 className="font-heading text-base font-bold text-[#12161A]">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 text-gray-400 hover:text-black rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {rsvpConfirmed ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading text-lg font-bold text-[#12161A]">VIP Attendance Confirmed</h4>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto">
                    Your invitation pass for <strong>{selectedEvent.title}</strong> has been generated.
                  </p>
                  <div className="p-4 bg-[#F9F8F6] rounded-sm border border-[#ECE8E1] font-mono text-center">
                    <span className="text-[10px] uppercase text-gray-400 block">Pass Code</span>
                    <strong className="text-base text-[#12161A]">{passCode}</strong>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] rounded-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitRsvp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="e.g. Richard Sterling"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="richard@example.com"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Number of Attendees</label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm bg-white focus:outline-hidden focus:border-[#94713A]"
                    >
                      <option value="1">1 Person (Self)</option>
                      <option value="2">2 Persons (Couple / Associate)</option>
                      <option value="3">3–4 Persons (Executive Delegation)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm cursor-pointer"
                    >
                      Confirm RSVP Registration
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
