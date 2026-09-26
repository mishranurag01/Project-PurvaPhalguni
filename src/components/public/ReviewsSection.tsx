import React from 'react';
import { ReviewItem } from '../../types/practice';
import { Star, Quote, ShieldCheck } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  // Filter only approved reviews that have no medical claims
  const approvedReviews = reviews
    .filter((r) => r.isApproved && !r.hasMedicalClaims)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E2D8]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
          Client Reflections
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#0F172A] mt-2">
          Reflections from the Sanctuary
        </h2>
        <p className="text-sm sm:text-base text-[#526071] mt-3">
          Honest experiences from leaders, creators, and practitioners seeking quiet discernment without superstition or medical claims.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {approvedReviews.map((rev) => (
          <div
            key={rev.id}
            className="group bg-white rounded-3xl border border-[#E8E2D8] hover:border-[#C59B4B]/60 p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative"
          >
            <div>
              {/* Star Rating & Date */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]/60 text-xs">
                <div className="flex items-center gap-1 text-[#C59B4B]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C59B4B] text-[#C59B4B]" />
                  ))}
                </div>
                <span className="text-[#94A3B8] font-mono">{rev.date}</span>
              </div>

              {/* Quote Icon */}
              <Quote className="w-7 h-7 text-[#C59B4B]/20 my-3" />

              {/* Review Text */}
              <p className="text-sm text-[#0F172A] font-serif leading-relaxed italic">
                "{rev.quote}"
              </p>
            </div>

            {/* Author Details & Verified Non-Medical Badge */}
            <div className="mt-6 pt-4 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-semibold text-[#0F172A]">{rev.clientName}</h4>
                <p className="text-[11px] text-[#78716C]">{rev.serviceUsed}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
