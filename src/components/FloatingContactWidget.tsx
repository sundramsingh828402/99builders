import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Phone, MessageSquare, Send, ShieldCheck, X } from 'lucide-react';
import { api } from '../services/api';

export const FloatingContactWidget: React.FC = () => {
  const { openEnquiryModal, navigate } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<{
    whatsapp_number?: string;
    contact_phone?: string;
  }>({
    whatsapp_number: '+919845099888',
    contact_phone: '+91 (080) 4999-9900',
  });

  useEffect(() => {
    let mounted = true;
    api.getPublicSettings()
      .then((data) => {
        if (mounted && data) {
          setSettings({
            whatsapp_number: data.whatsapp_number || '+919845099888',
            contact_phone: data.contact_phone || '+91 (080) 4999-9900',
          });
        }
      })
      .catch(() => {
        // Fall back gracefully to defaults
      });
    return () => {
      mounted = false;
    };
  }, []);

  const cleanWhatsAppNumber = (settings.whatsapp_number || '+919845099888').replace(/[^0-9]/g, '');
  const whatsAppUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
    'Hello 99 Builders & Developers, I would like to enquire about your luxury developments and commercial projects.'
  )}`;

  const cleanPhone = (settings.contact_phone || '+9108049999900').replace(/[^0-9+]/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 print:hidden">
      {/* Expanded Quick Action Menu */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl border border-[#ECE8E1] p-4 w-72 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-150 text-[#12161A] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE6]">
            <div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#12161A]">
                Direct Concierge Desk
              </h4>
              <p className="text-[11px] text-gray-500">Instant Senior Advisory</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-700 rounded-md"
              aria-label="Close Concierge Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {/* WhatsApp Link */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-md bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageSquare className="w-4 h-4 fill-white" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-xs font-semibold text-[#12161A] group-hover:text-[#128C7E] transition-colors">
                  WhatsApp Advisory
                </div>
                <div className="text-[10px] text-gray-500 truncate">Typically responds in minutes</div>
              </div>
            </a>

            {/* Direct Call Button */}
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-3 p-2.5 rounded-md bg-[#94713A]/10 hover:bg-[#94713A]/20 text-[#94713A] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[#94713A] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-xs font-semibold text-[#12161A] group-hover:text-[#94713A] transition-colors">
                  Click to Call Desk
                </div>
                <div className="text-[10px] font-mono text-gray-500 truncate">{settings.contact_phone}</div>
              </div>
            </a>

            {/* Quick Enquiry Modal Trigger */}
            <button
              onClick={() => {
                setIsOpen(false);
                openEnquiryModal('Fast Track Acquisition Enquiry');
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-md bg-[#12161A] hover:bg-[#232B32] text-white transition-colors group text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#C5A880] text-[#12161A] flex items-center justify-center shrink-0 shadow-xs">
                <Send className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-xs font-semibold text-white">General Enquiry Form</div>
                <div className="text-[10px] text-gray-300">Registered to CRM Database</div>
              </div>
            </button>
          </div>

          <div className="pt-2 border-t border-[#F0ECE6] flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
              ISO 14001:2015
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('admin-login');
              }}
              className="text-[#94713A] hover:underline"
            >
              Admin Portal
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-[#12161A] hover:bg-[#232B32] text-white rounded-full shadow-2xl border border-[#C5A880]/30 transition-transform active:scale-95 group focus:outline-hidden cursor-pointer"
        aria-label="Open 99 Builders Concierge Desk"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C5A880]"></span>
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-100 group-hover:text-white">
          Direct Concierge
        </span>
        <div className="w-6 h-6 rounded-full bg-[#C5A880] text-[#12161A] flex items-center justify-center ml-0.5">
          <Phone className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
