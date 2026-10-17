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
q: 'What is medical astrology, and how does it differ from regular astrology?',
a: 'Medical astrology is the traditional astrological study of health-related themes through a person’s birth chart, planetary positions, houses, transits, and other astrological factors. Unlike regular astrology, which may focus on personality, relationships, or career, medical astrology focuses on health-related questions. In my practice, I integrate astrological interpretation with medical knowledge and clinical assessment. Astrology serves as a supplementary aid to clinical reasoning, helping me explore additional perspectives while evaluating a person’s health concerns through appropriate medical methods.'
},
{
q: 'Can medical astrology diagnose diseases, and is it a substitute for professional medical care?',
a: 'No. Medical astrology is not an independently validated method of diagnosing diseases and cannot replace clinical examination, investigations, or evidence-based medical practice. My approach combines medical history-taking, clinical assessment, and astrological interpretation. For example, when evaluating persistent pain in the upper limbs, I may consider the patient’s symptoms, history of trauma, neurological and musculoskeletal findings, and relevant astrological factors together. An astrological interpretation may suggest an additional hypothesis to consider, but it cannot establish the cause of the pain. The final clinical assessment, choice of investigations, diagnosis, and treatment are guided by medical evidence and professional judgment.'
},
{
q: 'What information is required for a medical astrology consultation?',
a: 'Accurate birth details are essential for astrological interpretation. These include the exact date of birth, the most accurate available time of birth, and the place of birth. An incorrect birth time or birthplace may affect the calculated chart and its interpretation. In addition, I collect relevant personal and medical information, such as age, occupation, presenting complaints, history of present illness, past medical history, medication history, previous investigations, and other relevant clinical details. This allows me to assess the medical history and astrological information together rather than interpreting the chart in isolation. If the birth time is uncertain, the limitations this creates will be explained.'
},
{
q: 'How do tarot cards and other forms of cartomancy work with medical astrology?',
a: 'In my practice, medical cartomancy primarily refers to the traditional 78-card tarot deck. Tarot may be used independently or alongside medical astrology to explore a health-related question and generate additional perspectives for consideration. When combined with clinical assessment, these interpretations may help frame questions for further evaluation, but neither tarot nor astrology can establish a medical diagnosis. Where clinically appropriate, I may also consider treatment approaches within my professional scope, including conventional medical management and the Ayurvedic principles of Daivavyapashraya Chikitsa, Yuktivyapashraya Chikitsa, or both. Treatment decisions are based on clinical assessment, patient-specific needs, and applicable professional standards, not on card readings or astrological indications alone.'
},
{
q: 'What are the limitations of using medical astrology and tarot for health-related questions?',
a: 'Medical astrology and tarot are not established methods for diagnosing diseases or determining their severity, prognosis, or treatment. In my integrated approach, astrological or tarot interpretations serve only as supplementary perspectives that may help guide further clinical inquiry. They do not override the patient’s symptoms, examination findings, investigation results, or established medical evidence. If an astrological interpretation does not correspond with the clinical findings, the discrepancy is not forced into a conclusion; the medical assessment continues on its own merits. Any formal diagnosis, medical advice, prescription, or treatment plan is provided separately within the practitioner’s qualifications, scope of practice, and applicable legal and professional requirements.'
},
{
q: 'How long does a consultation take, and what can I expect during a session?',
a: 'Consultations are available in three formats: Medical Astrology (MA), Medical Cartomancy (MCa), and Combined Medical Astrology and Cartomancy (MAC). Depending on the selected service or subscription, the maximum allotted duration may be 45 minutes, 60 minutes, or 90 minutes. This is the maximum session duration rather than a guaranteed minimum; a session may conclude earlier when the relevant questions have been addressed. The consultation may include medical history-taking, discussion of the presenting complaint, review of relevant astrological information, tarot interpretation where applicable, and an integrated consideration of the available information. The session duration and scope depend on the selected service and the questions relevant to the consultation.'
},
{
q: 'Can I request a reading about someone else’s health or ask about a specific treatment, surgery, or medication?',
a: 'Yes, a consultation concerning another person may be requested, subject to appropriate consent, privacy, and professional boundaries. Ideally, the person whose health is being discussed should provide their own birth details and relevant medical information or explicitly authorize their use. If their birth details are unavailable, another suitable consultation method may be considered, depending on the service offered. Using the chart of a relative or partner instead of the person concerned does not provide a reliable substitute for that person’s own information, and any limitations will be explained. Questions about a particular treatment, surgery, or medication may be discussed from an appropriate clinical perspective. However, astrology and tarot cannot determine whether a treatment or procedure is medically indicated or whether medication should be started, stopped, or changed. Such decisions require appropriate clinical evaluation and, where necessary, consultation with the treating healthcare professional.'
},
{
q: 'What is the difference between a natal medical astrology reading and a horary or consultation chart reading?',
a: 'A natal medical astrology reading uses the person’s birth chart, calculated from their date, time, and place of birth, to interpret traditional astrological factors associated with health-related themes. A horary or consultation chart reading uses a chart cast for the time and place associated with a specific question, according to the relevant astrological method. The natal approach focuses on the birth chart, while the horary approach focuses on the particular question being asked. Either approach may be incorporated into my broader interpretive process, but neither independently establishes a medical diagnosis or predicts a clinical outcome. Medical conclusions remain dependent on appropriate clinical assessment.'
},
{
q: 'What medical information should I provide before my consultation?',
a: 'Before the consultation, you may be asked to provide your age, occupation, presenting complaints, duration and progression of symptoms, history of present illness, past medical history, current medications, previous diagnoses, investigation reports, and other relevant information. This information helps establish the clinical context before considering any astrological interpretation. Please provide accurate information to the best of your knowledge and do not omit relevant symptoms or existing medical conditions. Only information necessary for the selected service should be collected and handled in accordance with applicable privacy and data-protection requirements. Providing this information does not guarantee a diagnosis or a particular outcome.'
},
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
        Consultation Methods & Ethics of Medical Astrology and Cartomancy 
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          const isMedicalFaq = item.q.includes('medical advice');
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 transform overflow-hidden ${
                isOpen
                  ? 'bg-white border-[#C59B4B] shadow-md scale-[1.01]'
                  : 'bg-[#FCFBF9] border-[#E8E2D8] hover:border-[#C59B4B]/60 hover:bg-white hover:scale-[1.01]'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer active:scale-[0.99] transition-transform"
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
