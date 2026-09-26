import React, { useState, useEffect } from 'react';
import { ChartCalculationResult } from '../types/astrology';
import { MagneticButton } from './MagneticButton';
import { Bookmark, Share2, Check, Copy, Download, Sparkles, Feather } from 'lucide-react';

interface ChartNotesSummaryProps {
  data: ChartCalculationResult;
  reducedMotion?: boolean;
}

export const ChartNotesSummary: React.FC<ChartNotesSummaryProps> = ({
  data,
  reducedMotion = false
}) => {
  const storageKey = `purvaphalungi_notes_${data.profile.id}`;
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setNotes(saved);
    } else {
      // Default contemplative reflection prompt
      setNotes(
        `• Core Orientation: ${data.ascendant.sign} Lagna (${data.ascendant.nakshatra} Pada ${data.ascendant.pada})\n` +
        `• Planetary Luminary: Moon in ${data.planets.find(p => p.name === 'Moon')?.sign} with Nakshatra lord ${data.planets.find(p => p.name === 'Moon')?.nakshatraLord}.\n` +
        `• Active Chronos: ${data.currentDasha.mahadasha} / ${data.currentDasha.antardasha} period.\n` +
        `• Contemplative Reflection: Deepen devotional rest during Venusian hours; harmonize creative tension through disciplined architecture.`
      );
    }
  }, [storageKey, data]);

  const handleSave = () => {
    localStorage.setItem(storageKey, notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const generateSummaryText = () => {
    const moon = data.planets.find((p) => p.name === 'Moon');
    return `✦ PURVAPHALUNGI VEDIC CONSULTATION SUMMARY ✦\n` +
      `Client: ${data.profile.name} (${data.profile.title})\n` +
      `Birth Coordinates: ${data.profile.birthDate} ${data.profile.birthTime} · ${data.profile.birthPlace}\n\n` +
      `Lagna (Ascendant): ${data.ascendant.sign} at ${data.ascendant.degreesInSign.toFixed(1)}° (${data.ascendant.nakshatra})\n` +
      `Moon (Janma Rasi): ${moon?.sign} at ${moon?.degreesInSign.toFixed(1)}° (${moon?.nakshatra} P${moon?.pada})\n` +
      `Dominant Graha: ${data.dominantGraha}\n` +
      `Active Dasha: ${data.currentDasha.mahadasha} Mahadasha / ${data.currentDasha.antardasha} Antardasha\n\n` +
      `Creative & Soul Gift:\n"${data.creativeGift}"\n\n` +
      `Practitioner Notes:\n${notes}\n\n` +
      `— Crafted at PurvaPhalungi Celestial Sanctuary`;
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(generateSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generateSummaryText()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `PurvaPhalungi_${data.profile.name.replace(/\s+/g, '_')}_Summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]/60">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C59B4B] font-semibold">
            Private Contemplation
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#0F172A] mt-0.5">
            Practitioner Synthesis & Journal Notes
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Magnetic Save Notes */}
          <MagneticButton
            variant="secondary"
            onClick={handleSave}
            reducedMotion={reducedMotion}
            className="text-xs py-2 px-3.5"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-[#C59B4B]" />}
            {isSaved ? 'Notes Preserved' : 'Save Notes'}
          </MagneticButton>

          {/* Magnetic Share Summary */}
          <MagneticButton
            variant="primary"
            onClick={() => setShowShareModal(true)}
            reducedMotion={reducedMotion}
            className="text-xs py-2 px-3.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C59B4B]" />
            Share Summary
          </MagneticButton>
        </div>
      </div>

      {/* Soul Synthesis Card */}
      <div className="mt-5 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-start gap-3">
        <Feather className="w-5 h-5 text-[#C59B4B] shrink-0 mt-0.5" />
        <div>
          <span className="text-xs uppercase tracking-wider text-[#A87F32] font-semibold">
            Cosmic Alignment & Creative Gift
          </span>
          <p className="text-xs sm:text-sm text-[#0F172A] font-serif font-medium italic mt-1 leading-relaxed">
            "{data.creativeGift}"
          </p>
        </div>
      </div>

      {/* Notes Textarea */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-[#526071] uppercase tracking-wider mb-2">
          Private Reading Record (Auto-saved locally)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          className="w-full p-4 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs sm:text-sm text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B4B]/50 transition-all font-sans leading-relaxed resize-y"
          placeholder="Document specific insights, planetary transits, remedies (Upayas), or questions for the next consultation..."
        />
      </div>

      {/* Share Summary Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-[#E8E2D8] max-w-lg w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C59B4B]" />
                <h4 className="text-xl font-serif font-bold text-[#0F172A]">
                  Consultation Summary Document
                </h4>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] text-lg font-mono p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-xs font-mono whitespace-pre-wrap max-h-72 overflow-y-auto text-[#0F172A] leading-relaxed">
              {generateSummaryText()}
            </div>

            <div className="mt-5 flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#78716C]">
                Ready to deliver to client or archive in personal dossier.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="px-3.5 py-2 bg-white border border-[#E8E2D8] hover:border-[#C59B4B] text-[#0F172A] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save .txt
                </button>
                <button
                  onClick={handleCopySummary}
                  className="px-4 py-2 bg-[#0F172A] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-[#1E293B] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C59B4B]" />}
                  {copied ? 'Copied to Clipboard' : 'Copy Summary'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
