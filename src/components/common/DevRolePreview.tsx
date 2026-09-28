import React, { useState } from 'react';
import { UserRole } from '../../types/practice';
import { Sliders, X, ChevronUp, ChevronDown, ShieldAlert, Sparkles } from 'lucide-react';

interface DevRolePreviewProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const DevRolePreview: React.FC<DevRolePreviewProps> = ({ currentRole, onRoleChange }) => {
  // Only render when VITE_DEMO_MODE is explicitly 'true'
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isDemoMode) {
    return null;
  }

  return (
    <aside aria-label="Development Role Preview" className="fixed bottom-4 right-4 z-50 font-sans select-none">
      {/* Collapsed Pill Button */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F172A]/90 hover:bg-[#0F172A] text-[#FAF8F5] text-[11px] shadow-lg border border-[#C59B4B]/40 backdrop-blur-md transition-all hover:scale-105"
          title="Development preview only — not authentication"
        >
          <Sliders className="w-3.5 h-3.5 text-[#C59B4B]" />
          <span>Preview as: <strong className="capitalize text-[#C59B4B]">{currentRole}</strong></span>
          <ChevronUp className="w-3 h-3 text-[#94A3B8]" />
        </button>
      ) : (
        /* Expanded Floating Control Panel */
        <div className="w-72 bg-[#0F172A]/95 text-[#FAF8F5] rounded-2xl p-3.5 shadow-2xl border border-[#C59B4B]/50 backdrop-blur-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
              <span className="text-[11px] font-semibold tracking-wide text-white">Dev Role Preview</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-md text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#1E293B] text-[10px] text-[#CBD5E1] mb-2.5">
              <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Development preview only — not authentication.</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => {
                  onRoleChange('public');
                  setIsExpanded(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium flex items-center justify-between ${
                  currentRole === 'public'
                    ? 'bg-[#C59B4B] text-[#0F172A] font-bold'
                    : 'bg-[#1E293B] text-[#E2E8F0] hover:bg-[#334155]'
                }`}
              >
                <span>Public Site</span>
                {currentRole === 'public' && <span className="text-[9px]">●</span>}
              </button>

              <button
                onClick={() => {
                  onRoleChange('client');
                  setIsExpanded(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium flex items-center justify-between ${
                  currentRole === 'client'
                    ? 'bg-[#C59B4B] text-[#0F172A] font-bold'
                    : 'bg-[#1E293B] text-[#E2E8F0] hover:bg-[#334155]'
                }`}
              >
                <span>Client</span>
                {currentRole === 'client' && <span className="text-[9px]">●</span>}
              </button>

              <button
                onClick={() => {
                  onRoleChange('affiliate');
                  setIsExpanded(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium flex items-center justify-between ${
                  currentRole === 'affiliate'
                    ? 'bg-[#C59B4B] text-[#0F172A] font-bold'
                    : 'bg-[#1E293B] text-[#E2E8F0] hover:bg-[#334155]'
                }`}
              >
                <span>Affiliate</span>
                {currentRole === 'affiliate' && <span className="text-[9px]">●</span>}
              </button>

              <button
                onClick={() => {
                  onRoleChange('admin');
                  setIsExpanded(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium flex items-center justify-between ${
                  currentRole === 'admin'
                    ? 'bg-[#C59B4B] text-[#0F172A] font-bold'
                    : 'bg-[#1E293B] text-[#E2E8F0] hover:bg-[#334155]'
                }`}
              >
                <span>Admin Suite</span>
                {currentRole === 'admin' && <span className="text-[9px]">●</span>}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#334155] text-[9px] text-[#64748B] flex items-center justify-between">
            <span>VITE_DEMO_MODE=true</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[#94A3B8] hover:underline"
            >
              Minimize
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
