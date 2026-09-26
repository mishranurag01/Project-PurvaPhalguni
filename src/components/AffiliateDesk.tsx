import React, { useState } from 'react';
import { MagneticButton } from './MagneticButton';
import { Users, TrendingUp, Link2, Copy, Check, Calendar, DollarSign, Sparkles, Filter } from 'lucide-react';
import { soundSynth } from '../utils/soundAmbience';

interface AffiliateDeskProps {
  reducedMotion?: boolean;
}

export const AffiliateDesk: React.FC<AffiliateDeskProps> = ({ reducedMotion = false }) => {
  const [affiliateHandle, setAffiliateHandle] = useState('sanctuary_art');
  const [copiedLink, setCopiedLink] = useState(false);
  const [clientFilter, setClientFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const referralUrl = `https://purvaphalungi.com/c/${affiliateHandle}`;

  const clientList = [
    { id: 'c-101', name: 'Dr. Vivienne St. Claire', date: '2026-10-02', service: 'The Natal Blueprint', status: 'Upcoming', fee: '$380', commission: '$76' },
    { id: 'c-102', name: 'Alasdair MacIntyre', date: '2026-09-29', service: 'Chronos & Dasha Strategy', status: 'Completed', fee: '$320', commission: '$64' },
    { id: 'c-103', name: 'Mira & Rowan Chen', date: '2026-09-24', service: 'Union & Synastry', status: 'Completed', fee: '$450', commission: '$90' },
    { id: 'c-104', name: 'Siddharth Rao', date: '2026-10-08', service: 'Annual Solar Return', status: 'Upcoming', fee: '$340', commission: '$68' },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      soundSynth.playSoftTap();
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const filteredClients = clientFilter === 'all'
    ? clientList
    : clientList.filter((c) => (clientFilter === 'pending' ? c.status === 'Upcoming' : c.status === 'Completed'));

  return (
    <section id="affiliate" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-10 shadow-sm relative">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8E7CC3]" />
              <span className="text-xs uppercase tracking-wider text-[#8E7CC3] font-semibold">
                Practitioner & Affiliate Console
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] mt-1">
              Affiliate Operations & Client Dossier
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78716C] bg-[#FAF8F5] border border-[#E8E2D8] px-3 py-1.5 rounded-lg font-mono">
              Partner Tier: Sovereign (20% Honorarium)
            </span>
          </div>
        </div>

        {/* Dashboard Top Metrics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FCFBF9] p-5 rounded-2xl border border-[#E8E2D8] hover:border-[#C59B4B]/50 transition-all">
            <div className="flex items-center justify-between text-xs text-[#78716C]">
              <span>Active Consultations</span>
              <Users className="w-4 h-4 text-[#C59B4B]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#0F172A] mt-2">18</div>
            <span className="text-[11px] text-emerald-700 font-medium">+3 confirmed this cycle</span>
          </div>

          <div className="bg-[#FCFBF9] p-5 rounded-2xl border border-[#E8E2D8] hover:border-[#C59B4B]/50 transition-all">
            <div className="flex items-center justify-between text-xs text-[#78716C]">
              <span>Cycle Honorarium</span>
              <DollarSign className="w-4 h-4 text-[#8E7CC3]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#0F172A] mt-2">$1,240</div>
            <span className="text-[11px] text-[#78716C]">Disbursed bi-weekly</span>
          </div>

          <div className="bg-[#FCFBF9] p-5 rounded-2xl border border-[#E8E2D8] hover:border-[#C59B4B]/50 transition-all">
            <div className="flex items-center justify-between text-xs text-[#78716C]">
              <span>Client Retention</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#0F172A] mt-2">87.4%</div>
            <span className="text-[11px] text-[#78716C]">Multi-year dasha tracking</span>
          </div>

          <div className="bg-[#FCFBF9] p-5 rounded-2xl border border-[#E8E2D8] hover:border-[#C59B4B]/50 transition-all">
            <div className="flex items-center justify-between text-xs text-[#78716C]">
              <span>Chart Quality Score</span>
              <Sparkles className="w-4 h-4 text-[#C59B4B]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#0F172A] mt-2">100%</div>
            <span className="text-[11px] text-[#78716C]">Lahiri Sidereal verified</span>
          </div>
        </div>

        {/* Affiliate Link Generator */}
        <div className="mt-8 p-5 sm:p-6 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-serif font-bold text-[#0F172A] flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[#C59B4B]" />
                Personal Sanctuary Referral Conduit
              </h4>
              <p className="text-xs text-[#526071] mt-0.5">
                Share this refined gateway with discerning private clients, colleagues, and creative studios.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="px-3 py-2 text-xs font-mono bg-white border border-[#E8E2D8] rounded-lg text-[#0F172A] select-all w-full sm:w-72"
              />
              <MagneticButton
                variant="primary"
                onClick={handleCopyLink}
                reducedMotion={reducedMotion}
                className="text-xs py-2 px-3 shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C59B4B]" />}
                {copiedLink ? 'Copied' : 'Copy Link'}
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Client Roster / Table */}
        <div className="mt-8">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
            <h4 className="text-lg font-serif font-bold text-[#0F172A]">
              Referred Client Consultations
            </h4>

            {/* Filter buttons */}
            <div className="inline-flex p-1 bg-[#F5F2EB] rounded-lg text-xs font-medium">
              <button
                onClick={() => setClientFilter('all')}
                className={`px-3 py-1 rounded-md transition-all ${
                  clientFilter === 'all' ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#64748B]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setClientFilter('pending')}
                className={`px-3 py-1 rounded-md transition-all ${
                  clientFilter === 'pending' ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#64748B]'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setClientFilter('completed')}
                className={`px-3 py-1 rounded-md transition-all ${
                  clientFilter === 'completed' ? 'bg-white text-[#0F172A] shadow-xs font-semibold' : 'text-[#64748B]'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E2D8] text-[#78716C] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Consultation Offering</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Consultation Fee</th>
                  <th className="py-3 px-3">Partner Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]/60">
                {filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FCFBF9] transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#0F172A]">{c.name}</td>
                    <td className="py-3 px-3 text-[#78716C] font-mono">{c.date}</td>
                    <td className="py-3 px-3 text-[#526071]">{c.service}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-medium ${
                        c.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#0F172A]">{c.fee}</td>
                    <td className="py-3 px-3 font-semibold text-[#C59B4B]">{c.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
