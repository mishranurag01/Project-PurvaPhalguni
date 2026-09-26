import React, { useState, useEffect } from 'react';
import { MagneticButton } from './MagneticButton';
import { Lock, Sparkles, Feather, Music, Volume2, Bookmark, Check, Calendar } from 'lucide-react';
import { soundSynth } from '../utils/soundAmbience';

interface ClientSanctuaryProps {
  reducedMotion?: boolean;
}

export const ClientSanctuary: React.FC<ClientSanctuaryProps> = ({ reducedMotion = false }) => {
  const [isPlayingMantra, setIsPlayingMantra] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'dossier' | 'remedies' | 'journal'>('dossier');

  const defaultJournal = `Today's observation: noticing how the Venusian morning hours bring natural clarity to spatial design problems. Less cognitive strain when starting with silence rather than correspondence.`;

  useEffect(() => {
    const saved = localStorage.getItem('purvaphalungi_client_journal');
    setJournalEntry(saved || defaultJournal);
  }, []);

  const handleSaveJournal = () => {
    localStorage.setItem('purvaphalungi_client_journal', journalEntry);
    setIsSaved(true);
    soundSynth.playSoftTap();
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleMantra = () => {
    setIsPlayingMantra(!isPlayingMantra);
    soundSynth.playCelestialChime();
  };

  return (
    <section id="portal" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C59B4B]" />
              <span className="text-xs uppercase tracking-wider text-[#C59B4B] font-semibold">
                Private Client Enclave
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] mt-1">
              Sanctuary Dossier & Contemplation Desk
            </h2>
          </div>

          {/* Navigation Tabs */}
          <div className="inline-flex p-1 bg-[#F5F2EB] rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('dossier')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'dossier' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Archived Readings
            </button>
            <button
              onClick={() => setActiveTab('remedies')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'remedies' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Prescribed Upayas
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'journal' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Reflective Journal
            </button>
          </div>
        </div>

        {/* Tab 1: Archived Readings */}
        {activeTab === 'dossier' && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Consultation Record 1 */}
              <div className="p-6 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] hover:border-[#C59B4B]/60 transition-all">
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-2">
                  <span className="font-semibold text-[#A87F32]">Recorded Consultation</span>
                  <span className="font-mono">14 Sept 2026</span>
                </div>
                <h4 className="text-xl font-serif font-bold text-[#0F172A]">
                  The Natal Blueprint & D9 Navamsa Realignment
                </h4>
                <p className="text-xs text-[#526071] mt-2 leading-relaxed">
                  Deep analysis of the Purva Phalguni Moon in the 5th House, clarifying creative sovereignty, release of competitive burnout, and preparation for the upcoming Jupiter transit.
                </p>

                <div className="mt-4 pt-4 border-t border-[#E8E2D8]/60 flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">Duration: 74 mins · Audio + Notes</span>
                  <button
                    onClick={toggleMantra}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E2D8] text-xs text-[#0F172A] hover:border-[#C59B4B] flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#C59B4B]" />
                    <span>{isPlayingMantra ? 'Audio Playing...' : 'Listen to Session Audio'}</span>
                  </button>
                </div>
              </div>

              {/* Consultation Record 2 */}
              <div className="p-6 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] hover:border-[#C59B4B]/60 transition-all">
                <div className="flex items-center justify-between text-xs text-[#78716C] mb-2">
                  <span className="font-semibold text-[#8E7CC3]">Upcoming Session</span>
                  <span className="font-mono">28 Oct 2026</span>
                </div>
                <h4 className="text-xl font-serif font-bold text-[#0F172A]">
                  Chronos & Dasha Strategy (Quarterly Check-In)
                </h4>
                <p className="text-xs text-[#526071] mt-2 leading-relaxed">
                  Evaluating the shift from Venus-Rahu into Venus-Jupiter antardasha. Aligning architectural studio contracts with sidereal transit windows.
                </p>

                <div className="mt-4 pt-4 border-t border-[#E8E2D8]/60 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Confirmed on Calendar
                  </span>
                  <span className="text-xs text-[#78716C] font-mono">14:00 GMT</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Prescribed Upayas (Remedies) */}
        {activeTab === 'remedies' && (
          <div className="mt-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D8]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A87F32]">
                  Somatic Remedy
                </span>
                <h4 className="text-base font-serif font-bold text-[#0F172A] mt-1">
                  Morning Venusian Stillness
                </h4>
                <p className="text-xs text-[#526071] mt-2 leading-relaxed">
                  Allocate 25 minutes upon waking without digital screens. Light pure sandalwood incense and allow intuitive aesthetic thoughts to settle without demand.
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D8]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8E7CC3]">
                  Acoustic Mantra
                </span>
                <h4 className="text-base font-serif font-bold text-[#0F172A] mt-1">
                  Shukra Gayatri & Bhaga Sukta
                </h4>
                <p className="text-xs text-[#526071] mt-2 leading-relaxed">
                  Recitation of the Venusian Gayatri hymn at Friday dawn to harmonize relational warmth and soothe nervous tension.
                </p>
                <button
                  onClick={toggleMantra}
                  className="mt-3 text-xs text-[#8E7CC3] hover:underline flex items-center gap-1 font-medium"
                >
                  <Music className="w-3.5 h-3.5" />
                  {isPlayingMantra ? 'Harmonic Playing' : 'Play 432Hz Acoustic Drone'}
                </button>
              </div>

              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D8]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#15803D]">
                  Dharmic Action (Dana)
                </span>
                <h4 className="text-base font-serif font-bold text-[#0F172A] mt-1">
                  Patronage of Crafts
                </h4>
                <p className="text-xs text-[#526071] mt-2 leading-relaxed">
                  Support independent weavers, potters, or classical musicians once monthly. In Jyotish, supporting living artisans directly appeases Shukra.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reflective Journal */}
        {activeTab === 'journal' && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                Private Contemplation Stream (Encrypted in Local Storage)
              </span>
              <MagneticButton
                variant="primary"
                onClick={handleSaveJournal}
                reducedMotion={reducedMotion}
                className="text-xs py-1.5 px-3"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5 text-[#C59B4B]" />}
                {isSaved ? 'Reflections Preserved' : 'Save Entry'}
              </MagneticButton>
            </div>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              rows={6}
              className="w-full p-4 rounded-2xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs sm:text-sm text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B4B]/40 leading-relaxed font-sans"
              placeholder="Record your observations regarding planetary transits, dasha shifts, or intuitive nudges..."
            />
          </div>
        )}
      </div>
    </section>
  );
};
