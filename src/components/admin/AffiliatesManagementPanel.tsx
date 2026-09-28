import React, { useState } from 'react';
import {
  UserProfile,
  PractitionerRoleTier,
  PractitionerPermissions,
  ROLE_PERMISSION_DEFAULTS,
  PRACTITIONER_ROLE_LABELS,
  PRACTITIONER_ROLE_DESCRIPTIONS,
  AdminBulletin,
  PartnerPayout,
  BookingSession
} from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { soundSynth } from '../../utils/soundAmbience';
import {
  Users,
  UserPlus,
  UserCheck,
  PauseCircle,
  PlayCircle,
  Edit3,
  ShieldCheck,
  Shield,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Search,
  Briefcase,
  Radio,
  DollarSign,
  BarChart3,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  Check,
  X,
  CreditCard,
  FileText,
  MessageSquare,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface AffiliatesManagementPanelProps {
  users: UserProfile[];
  bookings: BookingSession[];
  bulletins: AdminBulletin[];
  payouts: PartnerPayout[];
  workloadSummary: ReturnType<typeof PracticeStore.getAffiliateWorkloadSummary>;
  onAddAffiliate: () => void;
  onEditAffiliate: (affiliate: UserProfile) => void;
  onDeactivateAffiliate: (affiliate: UserProfile) => void;
  onReactivateAffiliate: (affiliate: UserProfile) => void;
  onSendPayout: (affiliateId?: string) => void;
  onBroadcast: () => void;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const AffiliatesManagementPanel: React.FC<AffiliatesManagementPanelProps> = ({
  users,
  bookings,
  bulletins,
  payouts,
  workloadSummary,
  onAddAffiliate,
  onEditAffiliate,
  onDeactivateAffiliate,
  onReactivateAffiliate,
  onSendPayout,
  onBroadcast,
  onRefreshData,
  onShowToast
}) => {
  // Sub-tabs within Affiliates Panel
  const [subTab, setSubTab] = useState<'accounts' | 'permissions' | 'workload' | 'bulletins'>('accounts');

  // Filters for Accounts view
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deactivated' | 'pending'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Workload table filter
  const [workloadFilter, setWorkloadFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const affiliates = users.filter((u) => u.role === 'affiliate');
  const activeAffiliates = affiliates.filter((u) => u.activeStatus === 'active' || !u.activeStatus);
  const deactivatedAffiliates = affiliates.filter(
    (u) => u.activeStatus === 'deactivated' || u.activeStatus === 'suspended'
  );

  // Role count metrics
  const seniorCount = affiliates.filter((u) => u.practitionerRole === 'senior_astrologer').length;
  const associateCount = affiliates.filter(
    (u) => u.practitionerRole === 'associate_astrologer' || !u.practitionerRole
  ).length;
  const cartomancyCount = affiliates.filter((u) => u.practitionerRole === 'cartomancy_specialist').length;
  const apprenticeCount = affiliates.filter((u) => u.practitionerRole === 'apprentice_fellow').length;

  // Filtered Affiliates for Accounts View
  const filteredAffiliates = affiliates.filter((aff) => {
    // Search
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      aff.name.toLowerCase().includes(q) ||
      aff.email.toLowerCase().includes(q) ||
      (aff.specialty && aff.specialty.toLowerCase().includes(q)) ||
      (aff.affiliateCode && aff.affiliateCode.toLowerCase().includes(q));

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = aff.activeStatus === 'active' || !aff.activeStatus;
    } else if (statusFilter === 'deactivated') {
      matchesStatus = aff.activeStatus === 'deactivated' || aff.activeStatus === 'suspended';
    } else if (statusFilter === 'pending') {
      matchesStatus = aff.activeStatus === 'pending';
    }

    // Role filter
    let matchesRole = true;
    if (roleFilter !== 'all') {
      matchesRole = aff.practitionerRole === roleFilter;
    }

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleTogglePermission = (
    affiliateId: string,
    permKey: keyof PractitionerPermissions
  ) => {
    const target = affiliates.find((a) => a.id === affiliateId);
    if (!target) return;

    const currentPerms = target.permissions || {
      ...ROLE_PERMISSION_DEFAULTS[target.practitionerRole || 'associate_astrologer']
    };

    const updatedPerms: PractitionerPermissions = {
      ...currentPerms,
      [permKey]: !currentPerms[permKey]
    };

    PracticeStore.updateAffiliatePermissions(affiliateId, updatedPerms, target.practitionerRole);
    soundSynth.playSoftTap();
    onRefreshData();
    onShowToast(`Updated permission "${permKey}" for ${target.name}.`);
  };

  const handleApplyRolePreset = (affiliateId: string, newRoleTier: PractitionerRoleTier) => {
    const target = affiliates.find((a) => a.id === affiliateId);
    if (!target) return;

    const newPerms = { ...ROLE_PERMISSION_DEFAULTS[newRoleTier] };
    PracticeStore.updateAffiliatePermissions(affiliateId, newPerms, newRoleTier);
    soundSynth.playCelestialChime();
    onRefreshData();
    onShowToast(`Applied ${PRACTITIONER_ROLE_LABELS[newRoleTier]} role preset for ${target.name}.`);
  };

  const getRoleBadgeStyle = (tier?: PractitionerRoleTier) => {
    switch (tier) {
      case 'senior_astrologer':
        return 'bg-[#FAF3E3] text-[#7A5B20] border-[#C59B4B]/40 ring-1 ring-[#C59B4B]/30';
      case 'cartomancy_specialist':
        return 'bg-purple-50 text-purple-900 border-purple-200';
      case 'apprentice_fellow':
        return 'bg-teal-50 text-teal-900 border-teal-200';
      case 'associate_astrologer':
      default:
        return 'bg-blue-50 text-blue-900 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header with Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C59B4B] animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-[#C59B4B] font-bold">
              Practitioner Governance & Role-Based Permissions
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0F172A] mt-0.5">
            Affiliates & Clinical Practitioners Management
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage practitioner accounts, grant or restrict role-based clinical permissions, handle deactivations with client reassignment, and monitor caseload progress.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onAddAffiliate}
            className="px-4 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#C59B4B] hover:text-[#0F172A] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Practitioner</span>
          </button>

          <button
            onClick={onBroadcast}
            className="px-3.5 py-2 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-medium text-[#0F172A] hover:bg-[#FAF3E3] transition-colors flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>Broadcast Sync</span>
          </button>

          <button
            onClick={() => onSendPayout()}
            className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Send Payout</span>
          </button>
        </div>
      </div>

      {/* Top Practitioner Statistics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8]">
          <div className="flex items-center justify-between text-[#78716C] text-xs">
            <span>Total Practitioners</span>
            <Users className="w-4 h-4 text-[#C59B4B]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
            {affiliates.length}
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">
            {activeAffiliates.length} Active · {deactivatedAffiliates.length} Deactivated
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8]">
          <div className="flex items-center justify-between text-[#78716C] text-xs">
            <span>Role Tiers</span>
            <ShieldCheck className="w-4 h-4 text-[#C59B4B]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
            4 Tiers
          </div>
          <span className="text-[10px] text-[#78716C] mt-0.5 block truncate">
            {seniorCount} Sr · {associateCount} Assoc · {cartomancyCount} Carto · {apprenticeCount} Appr
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8]">
          <div className="flex items-center justify-between text-[#78716C] text-xs">
            <span>Caseload Progress</span>
            <BarChart3 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
            {workloadSummary.globalCompletionRate}%
          </div>
          <span className="text-[11px] text-[#78716C] mt-0.5 block">
            {workloadSummary.totalCompletedWorks} Done / {workloadSummary.totalPendingWorks} Pending
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8]">
          <div className="flex items-center justify-between text-[#78716C] text-xs">
            <span>Unpaid Honoraria Due</span>
            <CreditCard className="w-4 h-4 text-[#A87F32]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1 font-mono">
            ${workloadSummary.totalPendingPayouts.toLocaleString()} USD
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">
            ${workloadSummary.totalPaidOut.toLocaleString()} Settled
          </span>
        </div>
      </div>

      {/* Sub-Panel Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-1 text-xs">
        <button
          onClick={() => setSubTab('accounts')}
          className={`pb-2.5 px-3.5 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
            subTab === 'accounts'
              ? 'border-[#C59B4B] text-[#0F172A]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Practitioner Accounts ({affiliates.length})</span>
        </button>

        <button
          onClick={() => setSubTab('permissions')}
          className={`pb-2.5 px-3.5 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
            subTab === 'permissions'
              ? 'border-[#C59B4B] text-[#0F172A]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Role-Based Permission Matrix</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#FAF3E3] text-[#7A5B20] border border-[#C59B4B]/30 font-mono text-[9px] font-bold">
            Access Control
          </span>
        </button>

        <button
          onClick={() => setSubTab('workload')}
          className={`pb-2.5 px-3.5 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
            subTab === 'workload'
              ? 'border-[#C59B4B] text-[#0F172A]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Workload Progression (Pending vs Done)</span>
          {workloadSummary.totalPendingWorks > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-mono text-[9px] font-bold">
              {workloadSummary.totalPendingWorks}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('bulletins')}
          className={`pb-2.5 px-3.5 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
            subTab === 'bulletins'
              ? 'border-[#C59B4B] text-[#0F172A]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Practice Bulletins & Live Sync ({bulletins.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: PRACTITIONER ACCOUNTS */}
      {subTab === 'accounts' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by practitioner name, code, email, specialty..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs focus:outline-none focus:border-[#C59B4B]"
              />
            </div>

            {/* Filter Pills & Selectors */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#E8E2D8]">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-white shadow-xs text-[#0F172A] font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  All ({affiliates.length})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    statusFilter === 'active'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Active ({activeAffiliates.length})
                </button>
                <button
                  onClick={() => setStatusFilter('deactivated')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    statusFilter === 'deactivated'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Deactivated ({deactivatedAffiliates.length})
                </button>
              </div>

              {/* Role Filter Dropdown */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-2 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs text-[#0F172A] focus:outline-none focus:border-[#C59B4B]"
              >
                <option value="all">All Role Tiers</option>
                <option value="senior_astrologer">Senior Astrologers</option>
                <option value="associate_astrologer">Associate Astrologers</option>
                <option value="cartomancy_specialist">Cartomancy Specialists</option>
                <option value="apprentice_fellow">Apprentice Fellows</option>
              </select>
            </div>
          </div>

          {/* Practitioner Cards List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredAffiliates.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] text-center text-xs text-[#78716C] space-y-2">
                <Users className="w-8 h-8 text-[#C59B4B] mx-auto opacity-50" />
                <p>No practitioner accounts matched the specified search and filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setRoleFilter('all');
                  }}
                  className="text-xs text-[#C59B4B] font-semibold hover:underline"
                >
                  Clear search & filters
                </button>
              </div>
            ) : (
              filteredAffiliates.map((aff) => {
                const metric = workloadSummary.affiliateMetrics.find(
                  (m) => m.affiliate.id === aff.id
                );
                const isDeactivated =
                  aff.activeStatus === 'deactivated' || aff.activeStatus === 'suspended';
                const perms =
                  aff.permissions ||
                  ROLE_PERMISSION_DEFAULTS[aff.practitionerRole || 'associate_astrologer'];

                return (
                  <div
                    key={aff.id}
                    className={`p-6 rounded-2xl border transition-all text-xs space-y-4 ${
                      isDeactivated
                        ? 'bg-gray-50/80 border-gray-300 opacity-90'
                        : 'bg-[#FCFBF9] border-[#E8E2D8] hover:border-[#C59B4B]/50'
                    }`}
                  >
                    {/* Top Row: Avatar, Name, Role Tier, Status Badge, Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif font-bold text-lg ${
                            isDeactivated
                              ? 'bg-gray-200 text-gray-700 border border-gray-300'
                              : 'bg-[#FAF3E3] text-[#0F172A] border border-[#C59B4B]/30'
                          }`}
                        >
                          {aff.name.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-serif font-bold text-lg text-[#0F172A]">
                              {aff.name}
                            </h4>

                            {/* Status Pill */}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                aff.activeStatus === 'active' || !aff.activeStatus
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : isDeactivated
                                  ? 'bg-red-50 text-red-800 border border-red-200'
                                  : 'bg-amber-50 text-amber-900 border border-amber-200'
                              }`}
                            >
                              {isDeactivated
                                ? 'DEACTIVATED'
                                : (aff.activeStatus || 'ACTIVE').toUpperCase()}
                            </span>

                            {/* Role Tier Badge */}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadgeStyle(
                                aff.practitionerRole
                              )}`}
                            >
                              {PRACTITIONER_ROLE_LABELS[aff.practitionerRole || 'associate_astrologer']}
                            </span>
                          </div>

                          <div className="text-[#A87F32] font-medium text-xs mt-0.5">
                            {aff.specialty} · <span className="text-[#64748B] font-mono">{aff.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Header Quick Meta */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E2D8] font-mono text-[10px] text-[#0F172A]">
                          Code: <strong>{aff.affiliateCode}</strong> · Commission:{' '}
                          <strong>{((aff.commissionRate || 0.25) * 100).toFixed(0)}%</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#FAF3E3] border border-[#C59B4B]/30 font-medium text-[10px] text-[#7A5B20]">
                          {aff.workCapacity || '8 sessions / wk'}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    {aff.bio && <p className="text-[#526071] leading-relaxed">{aff.bio}</p>}

                    {/* Deactivation Banner if Inactive */}
                    {isDeactivated && (
                      <div className="p-3 bg-red-50/80 rounded-xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-start gap-2">
                          <PauseCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-red-900">
                              Account Deactivated / On Hiatus
                            </span>
                            <div className="text-[11px] text-red-700 mt-0.5">
                              Reason: {aff.deactivationReason || 'Administrative pause'}{' '}
                              {aff.deactivatedAt &&
                                `· Since ${new Date(aff.deactivatedAt).toLocaleDateString()}`}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            PracticeStore.reactivateAffiliate(aff.id);
                            soundSynth.playCelestialChime();
                            onRefreshData();
                            onShowToast(`Reactivated practitioner account for ${aff.name}.`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shrink-0 text-xs shadow-xs"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Reactivate Account</span>
                        </button>
                      </div>
                    )}

                    {/* Role-Based Permissions Checklist Bar */}
                    <div className="p-3 rounded-xl bg-white border border-[#E8E2D8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C59B4B]" />
                          <span>Active Role Permissions ({Object.values(perms).filter(Boolean).length}/8)</span>
                        </span>
                        <button
                          onClick={() => setSubTab('permissions')}
                          className="text-[10px] text-[#C59B4B] hover:underline font-semibold"
                        >
                          Configure in Matrix →
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            perms.canAccessJHoraEngine
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200 line-through'
                          }`}
                        >
                          JHora Sidereal
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            perms.canSuggestRemedies
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200 line-through'
                          }`}
                        >
                          Contemplative Upayas
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            perms.canDirectMessageClients
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200 line-through'
                          }`}
                        >
                          Direct Messaging
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            perms.canExportClientCharts
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200 line-through'
                          }`}
                        >
                          Export Charts
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            perms.canPublishToSanctuaryNotes
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200 line-through'
                          }`}
                        >
                          Publish Notes
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            perms.canViewUnassignedQueue
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200 line-through'
                          }`}
                        >
                          Intake Triage
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            perms.canModifyConsultationFees
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200 line-through'
                          }`}
                        >
                          Fee Concessions
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            perms.requireAdminSummaryReview
                              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                              : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}
                        >
                          {perms.requireAdminSummaryReview ? '⚠ Admin Review Required' : '✓ Self Sign-off'}
                        </span>
                      </div>
                    </div>

                    {/* Caseload & Financial Progression Summary */}
                    {metric && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-white border border-[#E8E2D8]">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                            Caseload
                          </span>
                          <div className="font-bold text-[#0F172A] text-sm mt-0.5">
                            {metric.assignedClientsCount} Clients
                          </div>
                          <span className="text-[10px] text-[#64748B]">
                            {metric.bookingsCount} Bookings
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                            Pending Works
                          </span>
                          <div className="font-bold text-amber-800 text-sm mt-0.5 flex items-center gap-1">
                            <span>{metric.pendingWorksCount} Works</span>
                            {metric.pendingWorksCount > 0 && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#78716C]">
                            {metric.pendingSessions.length} sessions, {metric.pendingSummaries.length} summaries
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                            Completed Works
                          </span>
                          <div className="font-bold text-emerald-800 text-sm mt-0.5">
                            {metric.completedWorksCount} Done ({metric.completionRate}%)
                          </div>
                          <div className="w-full bg-[#E8E2D8] h-1.5 rounded-full mt-1 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${metric.completionRate}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">
                            Unpaid Due
                          </span>
                          <div className="font-bold text-[#0F172A] text-sm mt-0.5 font-mono">
                            ${metric.pendingPayout.toLocaleString()} USD
                          </div>
                          <span className="text-[10px] text-[#78716C]">
                            Total paid: ${metric.paidOut}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="pt-2 border-t border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-[11px] text-[#78716C]">
                        <CreditCard className="w-3.5 h-3.5 text-[#C59B4B]" />
                        <span className="font-mono uppercase font-semibold text-[#0F172A]">
                          {aff.payoutMethodPreference || 'wise'}
                        </span>
                        <span className="truncate max-w-xs font-mono text-[10px]">
                          ({aff.payoutAccountDetails || aff.email})
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onSendPayout(aff.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1 text-xs"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Disburse</span>
                        </button>

                        <button
                          onClick={() => onEditAffiliate(aff)}
                          className="px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-white text-[#0F172A] font-semibold hover:bg-[#FAF8F5] transition-colors flex items-center gap-1 text-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#C59B4B]" />
                          <span>Edit & Permissions</span>
                        </button>

                        {isDeactivated ? (
                          <button
                            onClick={() => {
                              PracticeStore.reactivateAffiliate(aff.id);
                              soundSynth.playCelestialChime();
                              onRefreshData();
                              onShowToast(`Reactivated practitioner account for ${aff.name}.`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1 text-xs shadow-xs"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Reactivate</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onDeactivateAffiliate(aff)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-colors flex items-center gap-1 text-xs"
                          >
                            <PauseCircle className="w-3.5 h-3.5" />
                            <span>Deactivate Account</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ROLE-BASED PERMISSION MATRIX */}
      {subTab === 'permissions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D8] text-xs">
            <div>
              <h4 className="font-serif font-bold text-base text-[#0F172A]">
                Role-Based Permission & Clinical Access Matrix
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Granular capability matrix governing what each practitioner is authorized to access and perform within the practice.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security & Ethics Enforced</span>
            </span>
          </div>

          {/* Permission Matrix Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E8E2D8]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E2D8] text-[#78716C] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 min-w-[180px]">Practitioner & Role Tier</th>
                  <th className="py-3 px-2 text-center" title="Access to JHora engine">
                    JHora Sidereal
                  </th>
                  <th className="py-3 px-2 text-center" title="Suggest contemplative practices (upayas)">
                    Upayas
                  </th>
                  <th className="py-3 px-2 text-center" title="In-app direct messaging with clients">
                    Direct Msg
                  </th>
                  <th className="py-3 px-2 text-center" title="Export client chart folios as PDF">
                    Export Folios
                  </th>
                  <th className="py-3 px-2 text-center" title="Publish articles to knowledge base">
                    Publish Notes
                  </th>
                  <th className="py-3 px-2 text-center" title="Claim clients from intake queue">
                    Intake Triage
                  </th>
                  <th className="py-3 px-2 text-center" title="Modify consultation fees / grant discounts">
                    Fee Concession
                  </th>
                  <th className="py-3 px-2 text-center text-amber-800" title="Admin sign-off required">
                    Review Required
                  </th>
                  <th className="py-3 px-3 text-right">Apply Preset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]">
                {affiliates.map((aff) => {
                  const perms =
                    aff.permissions ||
                    ROLE_PERMISSION_DEFAULTS[aff.practitionerRole || 'associate_astrologer'];
                  const isDeactivated =
                    aff.activeStatus === 'deactivated' || aff.activeStatus === 'suspended';

                  return (
                    <tr
                      key={aff.id}
                      className={`hover:bg-[#FCFBF9] transition-colors ${
                        isDeactivated ? 'bg-gray-50/60 opacity-80' : ''
                      }`}
                    >
                      {/* Practitioner & Role info */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-[#0F172A]">{aff.name}</div>
                          {isDeactivated && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-800">
                              INACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#A87F32] font-medium">
                          {PRACTITIONER_ROLE_LABELS[aff.practitionerRole || 'associate_astrologer']}
                        </div>
                      </td>

                      {/* 1. JHora Engine */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(aff.id, 'canAccessJHoraEngine')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            perms.canAccessJHoraEngine
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle JHora Calculation Engine"
                        >
                          {perms.canAccessJHoraEngine ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* 2. Remedies */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(aff.id, 'canSuggestRemedies')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            perms.canSuggestRemedies
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Constitutional Remedies Guidance"
                        >
                          {perms.canSuggestRemedies ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* 3. Direct Messaging */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(aff.id, 'canDirectMessageClients')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            perms.canDirectMessageClients
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Client Direct Messaging"
                        >
                          {perms.canDirectMessageClients ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* 4. Export Client Charts */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(aff.id, 'canExportClientCharts')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            perms.canExportClientCharts
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Natal Chart Export"
                        >
                          {perms.canExportClientCharts ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* 5. Publish Notes */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(aff.id, 'canPublishToSanctuaryNotes')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            perms.canPublishToSanctuaryNotes
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Research Notes Publication"
                        >
                          {perms.canPublishToSanctuaryNotes ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* 6. Intake Queue */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(aff.id, 'canViewUnassignedQueue')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            perms.canViewUnassignedQueue
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Unassigned Queue Access"
                        >
                          {perms.canViewUnassignedQueue ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* 7. Fee Concession */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(aff.id, 'canModifyConsultationFees')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            perms.canModifyConsultationFees
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Fee Modification"
                        >
                          {perms.canModifyConsultationFees ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* 8. Require Summary Review */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(aff.id, 'requireAdminSummaryReview')}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            perms.requireAdminSummaryReview
                              ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 font-bold hover:bg-amber-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Mandatory Admin Review on Summaries"
                        >
                          {perms.requireAdminSummaryReview ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          ) : (
                            <Check className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                      </td>

                      {/* Role Preset Selector */}
                      <td className="py-3 px-3 text-right">
                        <select
                          value={aff.practitionerRole || 'associate_astrologer'}
                          onChange={(e) =>
                            handleApplyRolePreset(aff.id, e.target.value as PractitionerRoleTier)
                          }
                          className="p-1 rounded-lg border border-[#E8E2D8] bg-white text-[11px] font-medium text-[#0F172A] focus:outline-none focus:border-[#C59B4B]"
                        >
                          <option value="senior_astrologer">Senior Astrologer</option>
                          <option value="associate_astrologer">Associate Astrologer</option>
                          <option value="cartomancy_specialist">Cartomancy Specialist</option>
                          <option value="apprentice_fellow">Apprentice Fellow</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Matrix Legend Card */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-2 text-xs">
            <h5 className="font-bold text-[#0F172A] flex items-center gap-1.5 text-xs">
              <Shield className="w-4 h-4 text-[#C59B4B]" />
              <span>Practitioner Permission Matrix Guide</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-[#526071]">
              <div>
                <strong>Sidereal Engine:</strong> Access to the 9-graha and D1-D30 varga computational engine (Local engine).
              </div>
              <div>
                <strong>Contemplations:</strong> Formulating reflective pacing, lifestyle rhythm, and somatic contemplations.
              </div>
              <div>
                <strong>Intake Triage:</strong> Authority to review incoming unassigned public client inquiries.
              </div>
              <div>
                <strong>Review Required:</strong> When enabled, summaries must be approved by Practice Director before delivery.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PENDING VS DONE WORKLOAD BOARD */}
      {subTab === 'workload' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E2D8] text-xs">
            <div>
              <h4 className="font-serif font-bold text-base text-[#0F172A]">
                Caseload & Task Progression Board (Pending vs Done)
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Track preparation stages, verified charts, and reading summary delivery across all practitioner cases.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setWorkloadFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  workloadFilter === 'all'
                    ? 'bg-[#0F172A] text-white'
                    : 'bg-[#FCFBF9] border border-[#E8E2D8] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                All Works ({bookings.length})
              </button>

              <button
                onClick={() => setWorkloadFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  workloadFilter === 'pending'
                    ? 'bg-amber-800 text-white'
                    : 'bg-[#FCFBF9] border border-[#E8E2D8] text-[#64748B] hover:text-amber-800'
                }`}
              >
                Pending Works ({workloadSummary.totalPendingWorks})
              </button>

              <button
                onClick={() => setWorkloadFilter('completed')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  workloadFilter === 'completed'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-[#FCFBF9] border border-[#E8E2D8] text-[#64748B] hover:text-emerald-800'
                }`}
              >
                Completed & Delivered ({workloadSummary.totalCompletedWorks})
              </button>
            </div>
          </div>

          {/* Workload Cases Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E8E2D8]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E2D8] text-[#78716C] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Client & Service</th>
                  <th className="py-3 px-3">Assigned Practitioner</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Milestone Progress</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Summary Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]/60">
                {bookings
                  .filter((b) => {
                    const isPending = b.status === 'confirmed' || !b.hasSummaryShared;
                    const isDone = b.status === 'completed' && b.hasSummaryShared;
                    if (workloadFilter === 'pending') return isPending;
                    if (workloadFilter === 'completed') return isDone;
                    return true;
                  })
                  .map((b) => {
                    const isSessionDone = b.status === 'completed';
                    const isSummaryDelivered = b.hasSummaryShared;
                    const isAllDone = isSessionDone && isSummaryDelivered;

                    return (
                      <tr key={b.id} className="hover:bg-[#FAF8F5]">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-[#0F172A]">{b.clientName}</div>
                          <div className="text-[#64748B] text-[11px] font-mono">
                            {b.serviceCode} · {b.serviceName}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-[#A87F32]">{b.affiliateName}</div>
                          <div className="text-[#78716C] text-[10px]">Partner in Charge</div>
                        </td>

                        <td className="py-3.5 px-3 font-mono text-[#64748B]">
                          {b.date} · {b.timeSlot}
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✓ Consent
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✓ Natal Chart
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded ${
                                isSessionDone
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-900 border border-amber-200 font-semibold'
                              }`}
                            >
                              {isSessionDone ? '✓ Session Held' : '⏳ Scheduled'}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded ${
                                isSummaryDelivered
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-900 border border-amber-200 font-semibold'
                              }`}
                            >
                              {isSummaryDelivered ? '✓ Summary Shared' : '⏳ Summary Pending'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          {isAllDone ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Done</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {!isSessionDone ? 'Session Pending' : 'Summary Delivery Pending'}
                              </span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          {!b.hasSummaryShared ? (
                            <button
                              onClick={() => {
                                const updated = bookings.map((item) =>
                                  item.id === b.id
                                    ? {
                                        ...item,
                                        hasSummaryShared: true,
                                        status: 'completed' as const
                                      }
                                    : item
                                );
                                PracticeStore.saveBookings(updated);
                                soundSynth.playCelestialChime();
                                onRefreshData();
                                onShowToast(
                                  `Summary for ${b.clientName} delivered to private sanctuary enclave.`
                                );
                              }}
                              className="px-2.5 py-1 rounded bg-[#C59B4B] text-[#0F172A] font-bold text-[11px] hover:bg-[#FAF3E3] transition-colors"
                            >
                              Mark Delivered
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#78716C] font-mono">
                              Archived & Shared
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: BULLETINS & LIVE BROADCAST SYNC */}
      {subTab === 'bulletins' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E2D8] text-xs">
            <div>
              <h4 className="font-serif font-bold text-base text-[#0F172A]">
                Practice Bulletins & Live Synchronized Broadcasts
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Broadcast protocol shifts and announcements live to all practitioner workspaces.
              </p>
            </div>

            <button
              onClick={onBroadcast}
              className="px-3.5 py-2 rounded-xl bg-[#0F172A] text-white font-semibold hover:bg-[#C59B4B] hover:text-[#0F172A] transition-colors flex items-center gap-1.5 text-xs shadow-xs"
            >
              <Radio className="w-3.5 h-3.5 text-[#C59B4B]" />
              <span>New Broadcast</span>
            </button>
          </div>

          <div className="space-y-3">
            {bulletins.map((b) => {
              const ackCount = b.acknowledgedBy.length;
              const totalActive = activeAffiliates.length;

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.priority === 'urgent'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : b.priority === 'payout'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : b.priority === 'scheduling'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-[#FAF3E3] text-[#7A5B20] border border-[#C59B4B]/30'
                        }`}
                      >
                        {b.priority}
                      </span>
                      <h4 className="font-bold text-[#0F172A] text-sm">{b.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                      <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border border-[#E8E2D8]">
                        Acknowledged: {ackCount}/{totalActive}
                      </span>
                    </div>
                  </div>

                  <p className="text-[#526071] leading-relaxed">{b.content}</p>

                  <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between text-[11px] text-[#78716C]">
                    <span>Author: {b.authorName}</span>
                    <span className="font-mono text-[10px] text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Synced to Practitioner Desks</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
