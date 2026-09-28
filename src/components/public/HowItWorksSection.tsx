import React from 'react';
import { Calendar, CheckSquare, CreditCard, Sparkles, FileText } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose a Reading',
      desc: 'Select from M + A (Medical Astrology), M + C (Medical Cartomancy), or our integrated M + A + C complete insight folio.',
      icon: Sparkles
    },
    {
      num: '02',
      title: 'Select Date & Time',
      desc: 'Pick your preferred private session window from our practice calendar across worldwide timezones.',
      icon: Calendar
    },
    {
      num: '03',
      title: 'Profile & Consent Form',
      desc: 'Provide your birth certificate minute, birthplace coordinates, and review our transparent non-diagnostic ethical consent agreement.',
      icon: CheckSquare
    },
    {
      num: '04',
      title: 'Pay & Confirm',
      desc: 'Confirm your session and receive an instant calendar invitation (.ics) with your private video sanctuary link.',
      icon: CreditCard
    },
    {
      num: '05',
      title: 'Session & Summary Folio',
      desc: 'Experience your confidential consultation, followed by a personalized reading summary with contemplative homework in your portal.',
      icon: FileText
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E2D8]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
          Seamless Journey
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#0F172A] mt-2">
          How It Works
        </h2>
        <p className="text-sm sm:text-base text-[#526071] mt-3">
          Five deliberate steps toward reflective clarity, ethical consent, and restorative pacing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              className="bg-white rounded-2xl border border-[#E8E2D8] hover:border-[#C59B4B]/60 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xs relative"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]/60">
                  <span className="text-2xl font-serif font-bold text-[#C59B4B]">{st.num}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center text-[#0F172A]">
                    <Icon className="w-4 h-4 text-[#C59B4B]" />
                  </div>
                </div>

                <h3 className="text-base font-serif font-bold text-[#0F172A] mt-4">
                  {st.title}
                </h3>

                <p className="text-xs text-[#526071] mt-2 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E2D8]/40 text-[10px] text-[#94A3B8] font-mono">
                Step {i + 1} of 5
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
