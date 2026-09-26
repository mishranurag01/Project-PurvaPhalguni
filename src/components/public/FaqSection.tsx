import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'What happens in a session?',
      a: 'Each consultation takes place in a confidential, high-definition video sanctuary room. Your practitioner reviews your sidereal natal chart, current dasha timing, and constitutional signatures (Pitta, Vata, Kapha humors). In cartomancy sessions, live cards are drawn to reflect subconscious themes and somatic tension. You receive thoughtful, non-judgmental guidance and practical pacing strategies, followed by an archived written summary.'
    },
    {
      q: 'What birth details are needed?',
      a: 'We require your exact date of birth, city and country of birth, and exact minute of birth (as recorded on your birth certificate or hospital registry). Because Vedic astrology uses high-precision rising signs (Lagna changes approximately every two hours) and lunar mansion padas, accuracy is essential.'
    },
    {
      q: 'Can I change or cancel a booking?',
      a: 'Yes. Clients may reschedule or cancel any session directly within their Client Portal up to 48 hours prior to the scheduled time without penalty. Cancellations made within 48 hours are subject to a nominal rescheduling fee.'
    },
    {
      q: 'How is my data handled?',
      a: 'Privacy and data sovereignty are paramount. Your birth records, questions, and notes are encrypted at rest. We never sell, transfer, or commercialize your personal information. You retain the right to withdraw consent or request complete permanent record deletion at any time.'
    },
    {
      q: 'Is this medical advice?',
      a: 'No. Absolutely not. Services are offered strictly for spiritual, philosophical, and educational reflection. We do not provide clinical diagnoses, prescribe medications, or recommend changes to treatments prescribed by licensed healthcare providers. If you are experiencing physical or psychiatric distress, please consult a qualified physician or licensed medical professional immediately.'
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#E8E2D8]">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
          Transparency & Clarity
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#0F172A] mt-2">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-[#526071] mt-3">
          Essential details regarding our ethical boundaries, data handling, and session preparations.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          const isMedicalFaq = item.q.includes('medical advice');
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-[#C59B4B]/60 shadow-xs'
                  : 'bg-[#FCFBF9] border-[#E8E2D8] hover:border-[#C59B4B]/40 hover:bg-white'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {isMedicalFaq ? (
                    <ShieldAlert className="w-4 h-4 text-[#C59B4B] shrink-0" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-[#78716C] shrink-0" />
                  )}
                  <span className={`text-base font-serif font-semibold ${isMedicalFaq ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>
                    {item.q}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#78716C] transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-[#C59B4B]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#526071] leading-relaxed border-t border-[#E8E2D8]/60 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
