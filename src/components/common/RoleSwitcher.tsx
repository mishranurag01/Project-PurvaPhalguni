import React from 'react';
import { UserRole } from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { ShieldCheck, UserCheck, Stethoscope, Compass, LogOut } from 'lucide-react';
import { soundSynth } from '../../utils/soundAmbience';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (newRole: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  const handleSelect = (role: UserRole) => {
    soundSynth.playSoftTap();
    PracticeStore.setActiveRole(role);
    onRoleChange(role);
  };

  return (
    <aside aria-label="Role Simulation Console" className="bg-[#0F172A] text-white border-b border-[#1E293B] py-2 px-4 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#94A3B8] font-mono uppercase tracking-wider text-[11px]">
            Security & RBAC Environment:
          </span>
          <span className="text-white font-medium bg-[#1E293B] px-2 py-0.5 rounded border border-white/10 font-mono">
            {currentRole === 'public' && 'Public Website'}
            {currentRole === 'client' && 'Client Portal (Elena Vance)'}
            {currentRole === 'affiliate' && 'Affiliate Portal (Dr. Julian Croft)'}
            {currentRole === 'admin' && 'Admin Executive Suite (Director)'}
          </span>
        </div>

        {/* Role Quick Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-[#94A3B8] mr-1 hidden sm:inline">Simulate Role:</span>
          
          <button
            onClick={() => handleSelect('public')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
              currentRole === 'public'
                ? 'bg-[#C59B4B] text-[#0F172A] font-semibold'
                : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>Public Site</span>
          </button>

          <button
            onClick={() => handleSelect('client')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
              currentRole === 'client'
                ? 'bg-[#C59B4B] text-[#0F172A] font-semibold'
                : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Client</span>
          </button>

          <button
            onClick={() => handleSelect('affiliate')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
              currentRole === 'affiliate'
                ? 'bg-[#C59B4B] text-[#0F172A] font-semibold'
                : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Stethoscope className="w-3 h-3" />
            <span>Affiliate</span>
          </button>

          <button
            onClick={() => handleSelect('admin')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
              currentRole === 'admin'
                ? 'bg-[#C59B4B] text-[#0F172A] font-semibold'
                : 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
