import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { MagneticButton } from '../MagneticButton';

interface PermissionDeniedProps {
  requiredRoleName?: string;
  onReturnHome: () => void;
  onSwitchAccount?: () => void;
  customMessage?: string;
}

export const PermissionDenied: React.FC<PermissionDeniedProps> = ({
  requiredRoleName = 'Admin or Authorized Practitioner',
  onReturnHome,
  onSwitchAccount,
  customMessage
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E2D8] p-8 text-center shadow-lg space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center mx-auto text-amber-700">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-widest text-[#78716C] font-mono">
            Permission Restricted
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#0F172A]">
            Access Denied
          </h2>
          <p className="text-xs text-[#64748B] leading-relaxed">
            {customMessage ||
              `You do not have the required access permissions to enter this section. This workspace is reserved for ${requiredRoleName}.`}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-[11px] text-[#78716C]">
          Prototype Access Control: Switch to an authorized account via the Sign In screen to access this view.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <MagneticButton
            variant="secondary"
            onClick={onReturnHome}
            className="flex-1 text-xs py-2.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Return to Sanctuary</span>
          </MagneticButton>

          {onSwitchAccount && (
            <MagneticButton
              variant="primary"
              onClick={onSwitchAccount}
              className="flex-1 text-xs py-2.5"
            >
              <LogIn className="w-3.5 h-3.5 mr-1" />
              <span>Switch Account</span>
            </MagneticButton>
          )}
        </div>
      </div>
    </div>
  );
};
