import React, { useState } from 'react';
import { StudyArticle } from '../types/astrology';
import { NAKSHATRAS } from '../utils/vedicCalculations';
import { BookOpen, Sparkles, Search, Compass, ChevronRight, X } from 'lucide-react';

export const STUDY_ARTICLES: StudyArticle[] = [
  {
    id: 'purva-phalguni-lore',
    title: 'The Architecture of Purva Phalguni: Rest as the Precursor to Sovereign Art',
    subtitle: 'Governed by Venus and presided over by Bhaga, the solar deity of grace, this star teaches the sacred power of relaxation.',
    category: 'Nakshatra Wisdom',
    readTime: '6 min read',
    excerpt: 'In classical Vedic symbology, Purva Phalguni is represented by the front two legs of a hammock or ceremonial marriage bed. Far from idle inertia, it denotes the deep somatic ease that precedes monumental cultural breakthroughs.',
    content: [
      'The modern condition treats rest as a reward reluctantly granted after exhaustion. Purva Phalguni reverses this polarity: stillness and aesthetic delight are the generative womb from which effortless mastery blossoms.',
      'Presided over by Bhaga—the Aditya responsible for rightful inheritance, marital harmony, and the enjoyment of cosmic fruits—native placements here possess an intrinsic magnetism. They need not chase; they compose the conditions in which beauty gathers naturally.',
      'When working with clients carrying strong Purva Phalguni signatures (Moon, Sun, or Lagna), the practitioner must counsel against over-striving. Their vitality returns when they replace anxiety with hospitality and curated repose.'
    ],
    keyTakeaway: 'Great creation is not extracted by force; it is received through unhurried receptivity.'
  },
  {
    id: 'retrograde-without-fear',
    title: 'Vakri Grahas: Understanding Retrograde Planets Without Fatalism',
    subtitle: 'How retrograde motion intensifies internal luminosity (Chesta Bala) rather than causing chaotic disruption.',
    category: 'Parashari Foundations',
    readTime: '8 min read',
    excerpt: 'Popular astrology has turned retrograde planets into cautionary tales of doom. In classical Parashari Jyotish, however, retrograde motion confers supreme Chesta Bala—motional strength that demands profound inner originality.',
    content: [
      'When a planet appears retrograde from our earthly vantage, it is at its closest geometric point to Earth, glowing brighter in the night sky. In Sanskrit, this state is known as Vakri.',
      'Chesta Bala represents the fortitude that arises from non-conformity. A retrograde Mercury does not struggle to communicate; rather, it resists superficial pleasantries and seeks idiosyncratic metaphors.',
      'A retrograde Jupiter often challenges conventional religious orthodoxy in favor of direct, experiential gnosis. Far from weakened, the planet refuses to accept inherited dogma without empirical verification.'
    ],
    keyTakeaway: 'Retrograde planets are not malfunctioning; they are specialized interior faculties refusing common paths.'
  },
  {
    id: 'twelve-bhavas-mansions',
    title: 'The 12 Bhavas as Mansions of Consciousness',
    subtitle: 'From the visceral ignition of Lagna to the surrender of Vyaya Bhava: a journey across the holographic sky.',
    category: 'Parashari Foundations',
    readTime: '10 min read',
    excerpt: 'The 12 houses of the Vedic natal chart are not arbitrary segments of sky. They form a seamless developmental arc mapping how pure spirit condenses into bone, lineage, craft, and ultimate release.',
    content: [
      'The four Kendras (Houses 1, 4, 7, and 10) constitute the structural pillars of life—Self, Heart, Alliance, and Vocation. Without robust Kendras, even brilliant talent lacks an earthly foundation.',
      'The Trikona houses (1, 5, and 9) represent Lakshmi Sthanas—abodes of auspicious fortune and past-life credit (Purvapunya). They operate as natural shields during turbulent planetary weather.',
      'Finally, the Moksha trikona (4, 8, 12) dissolves worldly identity, culminating in the 12th house—the sacred precinct where the soul surrenders all pretense and finds pristine peace.'
    ],
    keyTakeaway: 'The birth chart is a sacred topography where no single house is discarded.'
  },
  {
    id: 'vimshottari-clockwork',
    title: 'Vimshottari Dasha: The 120-Year Rhythm of Unfolding Karma',
    subtitle: 'Why planetary periods unfold in an invariant spiral tied to the Moon’s exact birth longitude.',
    category: 'Timing & Dasha',
    readTime: '7 min read',
    excerpt: 'Unlike Western progressions that advance one degree per year, the Vimshottari system activates specific planetary archetypes in an ordained 120-year cycle dictated by the Janma Nakshatra.',
    content: [
      'Each Mahadasha awakens a different chamber of the unconscious. During Sun dasha, fatherhood and sovereignty emerge; during Moon dasha, emotional tides and community deepen; during Rahu, foreign voyages and technological hunger take hold.',
      'Understanding the active dasha prevents unnecessary resistance. One does not plant summer seeds during Saturnian winter; one builds greenhouses and refines stone foundations.',
      'Timing is the highest art of the Vedic practitioner: aligning the client’s conscious intent with the seasonal momentum of the cosmos.'
    ],
    keyTakeaway: 'We do not choose our seasons, but we choose our harvest through deliberate timing.'
  }
];

export const StudyMaterials: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<StudyArticle | null>(null);
  const [nakshatraSearch, setNakshatraSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredArticles = selectedCategory === 'all'
    ? STUDY_ARTICLES
    : STUDY_ARTICLES.filter((a) => a.category === selectedCategory);

  const filteredNakshatras = NAKSHATRAS.filter((n) =>
    n.name.toLowerCase().includes(nakshatraSearch.toLowerCase()) ||
    n.lord.toLowerCase().includes(nakshatraSearch.toLowerCase()) ||
    n.deity.toLowerCase().includes(nakshatraSearch.toLowerCase())
  );

  return (
    <section id="study" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
          Vedic Academy & Shastric Library
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#0F172A] mt-2">
          Wisdom, Shastras & Nakshatra Lore
        </h2>
        <p className="text-sm sm:text-base text-[#526071] mt-3">
          Deepen your discernment with foundational writings on Parashari principles, sidereal mechanics, and the 27 stellar mansions.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 p-1 bg-[#F5F2EB] rounded-lg max-w-fit mx-auto text-xs font-medium">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedCategory === 'all' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            All Treatises
          </button>
          <button
            onClick={() => setSelectedCategory('Nakshatra Wisdom')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedCategory === 'Nakshatra Wisdom' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Nakshatra Wisdom
          </button>
          <button
            onClick={() => setSelectedCategory('Parashari Foundations')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedCategory === 'Parashari Foundations' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Parashari Foundations
          </button>
          <button
            onClick={() => setSelectedCategory('Timing & Dasha')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedCategory === 'Timing & Dasha' ? 'bg-white text-[#0F172A] shadow-sm font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Timing & Dasha
          </button>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {filteredArticles.map((art) => (
          <article
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="group bg-white rounded-2xl border border-[#E8E2D8] hover:border-[#C59B4B]/60 p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer relative"
          >
            <div>
              <div className="flex items-center gap-2 text-xs text-[#78716C]">
                <span className="text-[#C59B4B] font-semibold">{art.category}</span>
                <span aria-hidden="true">·</span>
                <span>{art.readTime}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#0F172A] mt-2 group-hover:text-[#A87F32] transition-colors leading-snug">
                {art.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#526071] mt-3 line-clamp-3 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs">
              <span className="font-serif italic text-[#78716C]">
                {art.keyTakeaway.slice(0, 48)}...
              </span>
              <span className="text-[#0F172A] font-medium flex items-center gap-1 group-hover:text-[#C59B4B] transition-colors">
                Read Treatise <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* 27 Nakshatras Interactive Quick Lexicon */}
      <div className="mt-14 bg-white rounded-2xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E8E2D8]">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C59B4B]" />
              <span className="text-xs uppercase tracking-wider text-[#C59B4B] font-semibold">
                Stellar Directory
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A] mt-0.5">
              The 27 Nakshatras (Lunar Mansions)
            </h3>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search star, ruler or deity..."
              value={nakshatraSearch}
              onChange={(e) => setNakshatraSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredNakshatras.map((n, i) => (
            <div
              key={n.name}
              className={`p-3 rounded-xl border text-xs transition-all ${
                n.name === 'Purva Phalguni'
                  ? 'bg-[#FAF3E3] border-[#C59B4B] shadow-xs'
                  : 'bg-[#FCFBF9] border-[#E8E2D8] hover:border-[#C59B4B]/50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-[#0F172A]">{n.name}</span>
                {n.name === 'Purva Phalguni' && (
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
                )}
              </div>
              <div className="text-[11px] text-[#A87F32] font-medium mt-1">Lord: {n.lord}</div>
              <div className="text-[10px] text-[#78716C] mt-0.5 truncate" title={n.deity}>
                {n.deity}
              </div>
              <div className="text-[9px] text-[#94A3B8] mt-1 italic truncate" title={n.symbol}>
                {n.symbol}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#E8E2D8] max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D8]">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C59B4B] font-semibold">
                  {selectedArticle.category} · {selectedArticle.readTime}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] mt-1 leading-tight">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-[#94A3B8] hover:text-[#0F172A] text-lg font-mono p-1 shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-[#475569] leading-relaxed">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
              <span className="text-xs uppercase tracking-wider text-[#A87F32] font-semibold block mb-1">
                Contemplative Principle
              </span>
              <p className="text-sm font-serif font-medium text-[#0F172A] italic">
                "{selectedArticle.keyTakeaway}"
              </p>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-[#0F172A] text-white rounded-lg text-xs font-medium hover:bg-[#1E293B] transition-colors"
              >
                Close Treatise
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
