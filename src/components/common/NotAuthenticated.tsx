import React from 'react';
import { Lock, ArrowLeft, LogIn } from 'lucide-react';
import { MagneticButton } from '../MagneticButton';

interface NotAuthenticatedProps {
  onSignIn: () => void;
  onReturnHome: () => void;
  requiredPortalName?: string;
}

export const NotAuthenticated: React.FC<NotAuthenticatedProps> = ({
  onSignIn,
  onReturnHome,
  requiredPortalName = 'Sanctuary Portal'
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E2D8] p-8 text-center shadow-lg space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FAF3E3] border border-[#C59B4B]/30 flex items-center justify-center mx-auto text-[#C59B4B]">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-widest text-[#78716C] font-mono">
            Access Restricted
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#0F172A]">
            Sign In Required
          </h2>
          <p className="text-xs text-[#64748B] leading-relaxed">
            You must be signed in to view the {requiredPortalName}. Please use your demonstration credentials or return to the public sanctuary.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-[11px] text-[#78716C]">
          Prototype Mode: Use the Sign In button below to choose a demo account.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <MagneticButton
            variant="secondary"
            onClick={onReturnHome}
            className="flex-1 text-xs py-2.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Return to Home</span>
          </MagneticButton>

          <MagneticButton
            variant="primary"
            onClick={onSignIn}
            className="flex-1 text-xs py-2.5"
          >
            <LogIn className="w-3.5 h-3.5 mr-1" />
            <span>Sign In</span>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
};
