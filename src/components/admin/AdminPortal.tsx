import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  ServicePlan,
  BookingSession,
  ReviewItem,
  KnowledgeNote,
  KnowledgeDocument,
  ResearchStudy,
  ResearchParticipant,
  AuditLogEntry,
  WebsiteSettings,
  PartnerPayout,
  AdminBulletin,
  PayoutMethod,
  BulletinPriority
} from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { JHoraService } from '../../services/jhoraService';
import { InteractiveKundali } from '../InteractiveKundali';
import { PlanetaryMatrix } from '../PlanetaryMatrix';
import { DashaTransitTimeline } from '../DashaTransitTimeline';
import { MagneticButton } from '../MagneticButton';
import { AddAffiliateModal } from './AddAffiliateModal';
import { RemoveAffiliateModal } from './RemoveAffiliateModal';
import { EditAffiliateModal } from './EditAffiliateModal';
import { PartnerPayoutModal } from './PartnerPayoutModal';
import { PracticeBroadcastModal } from './PracticeBroadcastModal';
import { AffiliatesManagementPanel } from './AffiliatesManagementPanel';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Star,
  Settings,
  BookOpen,
  FileText,
  Activity,
  Lock,
  Key,
  Eye,
  EyeOff,
  Edit3,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  AlertCircle,
  HeartPulse,
  LogOut,
  Search,
  Sparkles,
  UserPlus,
  UserMinus,
  Radio,
  Bell,
  CreditCard,
  ArrowUpRight,
  Wallet,
  Briefcase,
  Clock,
  BarChart3,
  Sliders,
  Check,
  Send
} from 'lucide-react';
import { soundSynth } from '../../utils/soundAmbience';
import { PermissionDenied } from '../common/PermissionDenied';

interface AdminPortalProps {
  admin: UserProfile;
  settings: WebsiteSettings;
  onUpdateSettings: (newSettings: WebsiteSettings) => void;
  onExitPortal: () => void;
  reducedMotion?: boolean;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  admin,
  settings: initialSettings,
  onUpdateSettings,
  onExitPortal,
  reducedMotion = false
}) => {
  if (!admin || admin.role !== 'admin') {
    return (
      <PermissionDenied
        requiredRoleName="Practice Administrators"
        customMessage="Only authorized practice administrators have permission to access the Executive Admin Suite."
        onReturnHome={onExitPortal}
        onSwitchAccount={onExitPortal}
      />
    );
  }

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'content'
    | 'reviews'
    | 'services'
    | 'bookings'
    | 'clients'
    | 'affiliates'
    | 'payments'
    | 'astrology'
    | 'knowledge'
    | 'research'
    | 'audit'
    | 'settings'
  >('dashboard');

  // Website Settings Form State
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Data Collections
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [services, setServices] = useState<ServicePlan[]>([]);
  const [bookings, setBookings] = useState<BookingSession[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [knowledgeNotes, setKnowledgeNotes] = useState<KnowledgeNote[]>([]);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [researchStudy, setResearchStudy] = useState<ResearchStudy>(PracticeStore.getResearchStudy());
  const [researchParticipants, setResearchParticipants] = useState<ResearchParticipant[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [payouts, setPayouts] = useState<PartnerPayout[]>([]);
  const [bulletins, setBulletins] = useState<AdminBulletin[]>([]);
  const [workloadSummary, setWorkloadSummary] = useState(() => PracticeStore.getAffiliateWorkloadSummary());

  // Action Toast Notification
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  // Modals
  const [showAddAffiliateModal, setShowAddAffiliateModal] = useState(false);
  const [showRemoveAffiliateModal, setShowRemoveAffiliateModal] = useState(false);
  const [targetRemoveAffiliate, setTargetRemoveAffiliate] = useState<UserProfile | null>(null);
  const [showEditAffiliateModal, setShowEditAffiliateModal] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<UserProfile | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [preselectedPayoutAffiliateId, setPreselectedPayoutAffiliateId] = useState<string | undefined>(undefined);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Modals & Sub-forms
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<KnowledgeNote['category']>('Medical Astrology Principles');
  const [searchAudit, setSearchAudit] = useState('');

  // Universal Astrology Workspace State
  const [astrologyClientId, setAstrologyClientId] = useState<string>('user-client-1');

  useEffect(() => {
    loadAllData();

    // Subscribe to real-time events across portals and actions
    const unsubscribe = PracticeStore.subscribe(() => {
      loadAllData();
    });

    return () => unsubscribe();
  }, []);

  const loadAllData = () => {
    setUsers(PracticeStore.getUsers());
    setServices(PracticeStore.getServices());
    setBookings(PracticeStore.getBookings());
    setReviews(PracticeStore.getReviews());
    setKnowledgeNotes(PracticeStore.getKnowledgeNotes());
    setDocuments(PracticeStore.getDocuments());
    setResearchParticipants(PracticeStore.getResearchParticipants());
    setAuditLogs(PracticeStore.getAuditLogs());
    setPayouts(PracticeStore.getPayouts());
    setBulletins(PracticeStore.getBulletins());
    setWorkloadSummary(PracticeStore.getAffiliateWorkloadSummary());
  };

  const showToast = (msg: string) => {
    setActionNotification(msg);
    setTimeout(() => {
      setActionNotification((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleSaveWebsiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    soundSynth.playCelestialChime();
    PracticeStore.saveSettings(settings);
    onUpdateSettings(settings);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 2500);
  };

  // Admin Password Management State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false);

  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPasswordInput.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const isCurrentValid = await PracticeStore.verifyUserPassword(admin.id, currentPasswordInput);
      if (!isCurrentValid) {
        setPasswordError('Current password is incorrect. Please verify your existing password.');
        setIsUpdatingPassword(false);
        return;
      }

      await PracticeStore.updateUserPassword(admin.id, newPasswordInput);
      soundSynth.playCelestialChime();
      setPasswordSuccess('Admin password updated successfully with salted SHA-256 cryptographic digest.');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      showToast('Admin password updated and cryptographically salted.');
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Review management: filter medical claims
  const handleToggleApproveReview = (reviewId: string) => {
    soundSynth.playSoftTap();
    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        // Prevent approval if it has medical claims
        if (r.hasMedicalClaims) {
          alert('Policy Violation: Reviews containing medical diagnosis or cure claims cannot be approved.');
          return r;
        }
        return { ...r, isApproved: !r.isApproved };
      }
      return r;
    });
    setReviews(updated);
    PracticeStore.saveReviews(updated);
    PracticeStore.logAction(admin.id, admin.name, 'admin', 'REVIEW_APPROVED', `Updated review approval status for ${reviewId}`);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updated = reviews.filter((r) => r.id !== reviewId);
    setReviews(updated);
    PracticeStore.saveReviews(updated);
  };

  // Service management (Dispatches real-time SERVICES_UPDATED events)
  const handleToggleServiceActive = (serviceId: string) => {
    soundSynth.playSoftTap();
    const current = services.find((s) => s.id === serviceId);
    if (!current) return;
    const updated = PracticeStore.updateService(serviceId, { isActive: !current.isActive });
    if (updated) {
      setServices(PracticeStore.getServices());
      setActionNotification(`Service "${updated.name}" is now ${updated.isActive ? 'Active' : 'Archived'}. Event broadcasted.`);
      setTimeout(() => setActionNotification(null), 4000);
    }
  };

  const handleUpdateServicePrice = (serviceId: string, newPrice: number) => {
    const updated = PracticeStore.updateService(serviceId, { price: newPrice });
    if (updated) {
      setServices(PracticeStore.getServices());
      setActionNotification(`Updated "${updated.name}" price to $${newPrice} USD. Event broadcasted to Affiliate & Client portals.`);
      setTimeout(() => setActionNotification(null), 4000);
    }
  };

  const handleUpdateServiceDuration = (serviceId: string, newDurationMinutes: number) => {
    soundSynth.playSoftTap();
    const updated = PracticeStore.updateService(serviceId, {
      durationMinutes: newDurationMinutes,
      duration: `${newDurationMinutes} min`
    });
    if (updated) {
      setServices(PracticeStore.getServices());
      setActionNotification(`Updated "${updated.name}" duration to ${newDurationMinutes} min. Event broadcasted to Affiliate & Client portals.`);
      setTimeout(() => setActionNotification(null), 4000);
    }
  };

  // Client assignment to affiliate
  const handleAssignClient = (clientId: string, affiliateId: string) => {
    soundSynth.playSoftTap();
    const targetAffiliate = users.find((u) => u.id === affiliateId);
    const updated = users.map((u) => (u.id === clientId ? { ...u, assignedAffiliateId: affiliateId } : u));
    setUsers(updated);
    PracticeStore.saveUsers(updated);

    PracticeStore.logAction(
      admin.id,
      admin.name,
      'admin',
      'CLIENT_ASSIGNED',
      `Assigned client (${clientId}) to practitioner ${targetAffiliate?.name || affiliateId}`,
      true
    );
  };

  // Research participant withdrawal
  const handleWithdrawParticipant = (participantId: string) => {
    soundSynth.playSoftTap();
    const updated = researchParticipants.map((p) =>
      p.id === participantId ? { ...p, withdrawn: true, consentActive: false } : p
    );
    setResearchParticipants(updated);
    PracticeStore.saveResearchParticipants(updated);

    PracticeStore.logAction(
      admin.id,
      admin.name,
      'admin',
      'CONSENT_WITHDRAWN',
      `Withdrew research participant ${participantId} and anonymized metrics.`,
      true
    );
  };

  // Export anonymized research dataset (CSV)
  const handleExportResearchCSV = () => {
    const activeData = researchParticipants.filter((p) => !p.withdrawn);
    const csvRows = [
      ['Deidentified_ID', 'Intake_Date', 'Signatures', 'Outcome_Category', 'Outcome_Source'],
      ...activeData.map((p) => [
        p.deidentifiedId,
        p.intakeDate,
        `"${p.primaryAstrologicalSignatures.join('; ')}"`,
        `"${p.verifiedOutcomeCategory}"`,
        `"${p.outcomeSource}"`
      ])
    ];

    const csvContent = csvRows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Anonymized_Astro_Research_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    PracticeStore.logAction(
      admin.id,
      admin.name,
      'admin',
      'DATA_EXPORT',
      'Exported anonymized research dataset for statistical analysis.',
      true
    );
  };

  // Create Knowledge Note
  const handleCreateKnowledgeNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    soundSynth.playSoftTap();
    const newNote: KnowledgeNote = {
      id: `kn-${Date.now()}`,
      title: newNoteTitle.trim(),
      category: newNoteCategory,
      tags: ['Reference', 'Clinical Ethos'],
      excerpt: newNoteContent.slice(0, 100) + '...',
      content: newNoteContent.trim(),
      author: admin.name,
      updatedAt: new Date().toISOString().slice(0, 10),
      accessLevel: 'affiliate_accessible'
    };

    const updated = [newNote, ...knowledgeNotes];
    setKnowledgeNotes(updated);
    PracticeStore.saveKnowledgeNotes(updated);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  // Astrology calculation target
  const currentAstrologyClient = users.find((u) => u.id === astrologyClientId) || users[3];
  const chartRes = currentAstrologyClient
    ? JHoraService.calculateClientChart(currentAstrologyClient, {
        id: admin.id,
        name: admin.name,
        role: 'admin'
      })
    : null;

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.actorName.toLowerCase().includes(searchAudit.toLowerCase()) ||
      l.action.toLowerCase().includes(searchAudit.toLowerCase()) ||
      l.details.toLowerCase().includes(searchAudit.toLowerCase())
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4 border border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C59B4B] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
              Executive Admin Suite
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Governance & Practice Administration
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Full authority over services, bookings, research protocols, and ethical governance.
          </p>
        </div>

        <button
          onClick={onExitPortal}
          className="px-3.5 py-1.5 rounded-lg border border-[#334155] text-xs font-medium text-[#CBD5E1] hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin</span>
        </button>

        {/* Prototype Temporary Notice */}
        <div className="w-full mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Demo mode: changes are temporary and will reset when the application refreshes.</span>
        </div>
      </div>

      {/* Main Grid: Navigation Tabs + Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E8E2D8] p-3 shadow-xs space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'dashboard'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#C59B4B]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'content'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Edit3 className="w-4 h-4 text-[#C59B4B]" />
            <span>Website Content & Brand</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'reviews'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Star className="w-4 h-4 text-[#C59B4B]" />
            <span>Client Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'services'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#C59B4B]" />
            <span>Services & Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'bookings'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#C59B4B]" />
            <span>Bookings & Refunds ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'clients'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Users className="w-4 h-4 text-[#C59B4B]" />
            <span>Clients & Assignments</span>
          </button>

          <button
            onClick={() => setActiveTab('affiliates')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'affiliates'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C59B4B]" />
              <span>Affiliate Practitioners</span>
            </div>
            {workloadSummary.totalPendingWorks > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[9px] font-bold">
                {workloadSummary.totalPendingWorks} pending
              </span>
            ) : (
              <span className="font-mono text-[10px] text-[#A87F32]">
                {users.filter((u) => u.role === 'affiliate').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'payments'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#C59B4B]" />
            <span>Payments & Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('astrology')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'astrology'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C59B4B]" />
            <span>Full Astrology Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'knowledge'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C59B4B]" />
            <span>Knowledge Centre</span>
          </button>

          <button
            onClick={() => setActiveTab('research')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'research'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Activity className="w-4 h-4 text-[#8E7CC3]" />
            <span>Research Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'audit'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Lock className="w-4 h-4 text-[#C59B4B]" />
            <span>Security Audit Log</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'settings'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Key className="w-4 h-4 text-[#C59B4B]" />
            <span>Admin Password & Security</span>
          </button>
        </div>

        {/* Dynamic Admin Panes */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Gross Platform Revenue</span>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    ${totalRevenue.toLocaleString()} USD
                  </div>
                  <span className="text-[11px] text-emerald-700">All services accounted</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Total Active Bookings</span>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    {bookings.length}
                  </div>
                  <span className="text-[11px] text-[#A87F32]">
                    {bookings.filter((b) => b.status === 'confirmed').length} upcoming
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Total Client Roster</span>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    {users.filter((u) => u.role === 'client').length}
                  </div>
                  <span className="text-[11px] text-[#78716C]">Consents verified</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Active Practitioners</span>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    {users.filter((u) => u.role === 'affiliate').length}
                  </div>
                  <span className="text-[11px] text-[#78716C]">Licensed affiliate cohort</span>
                </div>
              </div>

              {/* Quick Actions / Recent Bookings */}
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                  <h3 className="text-lg font-serif font-bold text-[#0F172A]">
                    Recent Global Consultations
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-[#C59B4B] hover:underline font-medium"
                  >
                    View All Bookings →
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-4 bg-[#FCFBF9] rounded-xl border border-[#E8E2D8] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-[#0F172A]">{b.clientName}</div>
                        <div className="text-[#64748B]">
                          {b.serviceName} · {b.date} ({b.affiliateName})
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#0F172A]">${b.amount} USD</span>
                        <div className="text-[10px] text-emerald-700 font-mono">{b.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEBSITE CONTENT (LIVE BRAND & TEXT EDITOR) */}
          {activeTab === 'content' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                  Public Website Content & Brand Configuration
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Update your practice brand name, tagline, homepage hero copy, and non-medical disclaimer in real time.
                </p>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Website content changes published globally.</span>
                </div>
              )}

              <form onSubmit={handleSaveWebsiteContent} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="Purva Phalguni"
                      value={settings.brandName || 'Purva Phalguni'}
                      onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-serif text-sm font-bold focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Primary Tagline
                    </label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                    Mandatory Non-Medical Disclaimer (Enforced across all booking screens)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.requiredDisclaimer}
                    onChange={(e) => setSettings({ ...settings, requiredDisclaimer: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E8E2D8] bg-[#FAF3E3] text-[#7A5B20] text-xs focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Sanctuary Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Sanctuary Contact Phone
                    </label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Sanctuary Location
                    </label>
                    <input
                      type="text"
                      value={settings.officeLocation}
                      onChange={(e) => setSettings({ ...settings, officeLocation: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                    About Story Text
                  </label>
                  <textarea
                    rows={3}
                    value={settings.aboutStory}
                    onChange={(e) => setSettings({ ...settings, aboutStory: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                    Philosophy Text
                  </label>
                  <textarea
                    rows={3}
                    value={settings.aboutPhilosophy}
                    onChange={(e) => setSettings({ ...settings, aboutPhilosophy: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>

                <div className="pt-4 text-right">
                  <MagneticButton type="submit" variant="primary" reducedMotion={reducedMotion}>
                    <span>Save Website Content</span>
                  </MagneticButton>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: REVIEWS MANAGER (STRICT NO MEDICAL CLAIMS) */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E8E2D8]">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                    Client Reviews Governance
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Approve, reorder, or suppress client reviews. Strict automated filter prohibits claims of curing, diagnosing, or treating disease.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      rev.hasMedicalClaims
                        ? 'bg-red-50/60 border-red-200'
                        : rev.isApproved
                        ? 'bg-[#FAF8F5] border-[#E8E2D8]'
                        : 'bg-white border-dashed border-[#E8E2D8]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]/60 text-xs">
                      <div>
                        <span className="font-semibold text-[#0F172A]">{rev.clientName}</span>
                        <span className="text-[#78716C] ml-2">({rev.serviceUsed})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {rev.hasMedicalClaims ? (
                          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded border border-red-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Violates Non-Medical Policy
                          </span>
                        ) : (
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            rev.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rev.isApproved ? 'Approved & Public' : 'Pending Review'}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#0F172A] italic mt-3 font-serif leading-relaxed">
                      "{rev.quote}"
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs">
                      <span className="text-[#78716C] font-mono text-[10px]">{rev.date}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleApproveReview(rev.id)}
                          disabled={rev.hasMedicalClaims}
                          className={`px-3 py-1.5 rounded-lg font-medium text-xs ${
                            rev.hasMedicalClaims
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : rev.isApproved
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-[#0F172A] text-white hover:bg-[#1E293B]'
                          }`}
                        >
                          {rev.isApproved ? 'Hide Review' : 'Approve for Public'}
                        </button>

                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES & PRICING */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D8]">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                    Services, Plans & Pricing Configuration
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Modifications to service rates, duration, or active status are broadcast in real-time across all portals.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-800 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-time Event-Listener Active</span>
                </div>
              </div>

              <div className="space-y-6">
                {services.map((s) => (
                  <div key={s.id} className="p-6 bg-[#FCFBF9] rounded-2xl border border-[#E8E2D8] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="font-mono text-xs text-[#A87F32] font-semibold">{s.code}</span>
                        <h4 className="text-xl font-serif font-bold text-[#0F172A]">{s.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[#64748B]">Current: {s.duration} · ${s.price} USD</span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                            s.isActive
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {s.isActive ? 'Active in Directory' : 'Archived'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Duration Control */}
                        <div className="flex items-center gap-1.5 text-xs bg-white p-2 rounded-xl border border-[#E8E2D8]">
                          <span className="text-[#64748B] font-medium">Duration:</span>
                          <select
                            value={s.durationMinutes || 60}
                            onChange={(e) => handleUpdateServiceDuration(s.id, parseInt(e.target.value, 10))}
                            className="bg-transparent font-mono text-xs font-semibold text-[#0F172A] focus:outline-none cursor-pointer"
                          >
                            <option value={30}>30 min</option>
                            <option value={45}>45 min</option>
                            <option value={60}>60 min</option>
                            <option value={75}>75 min</option>
                            <option value={90}>90 min</option>
                            <option value={120}>120 min</option>
                          </select>
                        </div>

                        {/* Price Control */}
                        <div className="flex items-center gap-1.5 text-xs bg-white p-2 rounded-xl border border-[#E8E2D8]">
                          <span className="text-[#64748B] font-medium">Rate:</span>
                          <input
                            type="number"
                            min={0}
                            step={5}
                            value={s.price}
                            onChange={(e) => handleUpdateServicePrice(s.id, parseInt(e.target.value) || 0)}
                            className="w-20 p-1 rounded border border-[#E8E2D8] bg-[#FCFBF9] font-mono text-xs font-bold text-right focus:border-[#C59B4B] focus:outline-none"
                          />
                          <span className="font-mono text-xs text-[#0F172A]">USD</span>
                        </div>

                        {/* Active Toggle */}
                        <button
                          onClick={() => handleToggleServiceActive(s.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                            s.isActive
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                              : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                          }`}
                        >
                          {s.isActive ? 'Active' : 'Archived'}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#526071]">{s.shortDesc}</p>

                    <div className="pt-2 border-t border-[#E8E2D8]/60 flex items-center justify-between text-[11px] text-[#78716C]">
                      <span>Includes: {s.includes.slice(0, 2).join(' · ')}...</span>
                      <span className="font-mono text-[10px] text-[#A87F32]">
                        Event: SERVICES_UPDATED dispatches on edit
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BOOKINGS & REFUNDS */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#0F172A] pb-3 border-b border-[#E8E2D8]">
                Master Booking Roster & Payment Statuses
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8E2D8] text-[#78716C] uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Service</th>
                      <th className="py-3 px-3">Practitioner</th>
                      <th className="py-3 px-3">Date/Time</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Session Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D8]/60">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF8F5]">
                        <td className="py-3 px-3 font-semibold text-[#0F172A]">{b.clientName}</td>
                        <td className="py-3 px-3">{b.serviceCode}</td>
                        <td className="py-3 px-3 text-[#A87F32]">{b.affiliateName}</td>
                        <td className="py-3 px-3 text-[#64748B] font-mono">{b.date} · {b.timeSlot}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px]">
                            ${b.amount} USD {b.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-[#0F172A]">{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CLIENTS & ASSIGNMENTS */}
          {activeTab === 'clients' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#0F172A] pb-3 border-b border-[#E8E2D8]">
                Client Roster & Practitioner Assignment
              </h3>

              <div className="space-y-4">
                {users
                  .filter((u) => u.role === 'client')
                  .map((c) => {
                    const currentAffiliate = users.find((u) => u.id === c.assignedAffiliateId);
                    return (
                      <div
                        key={c.id}
                        className="p-5 bg-[#FCFBF9] rounded-2xl border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#0F172A] text-sm">{c.name}</div>
                          <div className="text-[#64748B]">{c.email} · {c.phone}</div>
                          <div className="mt-1 text-[#78716C]">
                            Birth: {c.birthDate} {c.birthTime} ({c.birthCity}) · Consent: {c.consentGiven && !c.consentWithdrawn ? 'Active' : 'Withdrawn'}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[#64748B]">Assigned Practitioner:</span>
                          <select
                            value={c.assignedAffiliateId || ''}
                            onChange={(e) => handleAssignClient(c.id, e.target.value)}
                            className="p-2 rounded-lg border border-[#E8E2D8] bg-white text-xs"
                          >
                            <option value="">Unassigned</option>
                            {users
                              .filter((u) => u.role === 'affiliate')
                              .map((aff) => (
                                <option key={aff.id} value={aff.id}>
                                  {aff.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 7: AFFILIATE PRACTITIONER MANAGEMENT & WORKLOAD SUB-PANEL */}
          {activeTab === 'affiliates' && (
            <AffiliatesManagementPanel
              users={users}
              bookings={bookings}
              bulletins={bulletins}
              payouts={payouts}
              workloadSummary={workloadSummary}
              onAddAffiliate={() => setShowAddAffiliateModal(true)}
              onEditAffiliate={(aff) => {
                setEditingAffiliate(aff);
                setShowEditAffiliateModal(true);
              }}
              onDeactivateAffiliate={(aff) => {
                setTargetRemoveAffiliate(aff);
                setShowRemoveAffiliateModal(true);
              }}
              onReactivateAffiliate={(aff) => {
                PracticeStore.updateAffiliate(aff.id, { activeStatus: 'active' });
                soundSynth.playCelestialChime();
                showToast(`${aff.name} has been reactivated to active status.`);
                loadAllData();
              }}
              onSendPayout={(affiliateId) => {
                setPreselectedPayoutAffiliateId(affiliateId);
                setShowPayoutModal(true);
              }}
              onBroadcast={() => setShowBroadcastModal(true)}
              onRefreshData={() => loadAllData()}
              onShowToast={(msg) => showToast(msg)}
            />
          )}

          {/* TAB 8: PAYMENTS & PARTNER DISBURSEMENTS */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-bold">
                      Treasury & Disbursements
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#0F172A] mt-0.5">
                    Partner Honoraria & Payout Ledger
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Calculate commissions, disburse payouts via verified channels (Wise, Direct Wire, Stripe, PayPal), and maintain audit-certified records.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setPreselectedPayoutAffiliateId(undefined);
                    setShowPayoutModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors flex items-center gap-2 shadow-xs"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Send Partner Payout</span>
                </button>
              </div>

              {/* Financial Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Gross Consultations Settled</span>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    ${totalRevenue.toLocaleString()} USD
                  </div>
                  <span className="text-[11px] text-emerald-700">100% Client payments verified</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Total Honoraria Disbursed</span>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    ${workloadSummary.totalPaidOut.toLocaleString()} USD
                  </div>
                  <span className="text-[11px] text-[#78716C]">Across all payout rails</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <span className="text-xs text-amber-900 font-medium">Pending Payout Liabilities</span>
                  <div className="text-2xl font-serif font-bold text-amber-900 mt-1">
                    ${workloadSummary.totalPendingPayouts.toLocaleString()} USD
                  </div>
                  <span className="text-[11px] text-amber-700">Due for completed readings</span>
                </div>
              </div>

              {/* Partner Balances & Payout Action Table */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-[#0F172A]">
                  Partner Commission Balances
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E8E2D8] text-[#78716C] uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Practitioner</th>
                        <th className="py-2.5 px-3">Commission Rate</th>
                        <th className="py-2.5 px-3">Total Earned</th>
                        <th className="py-2.5 px-3">Total Paid Out</th>
                        <th className="py-2.5 px-3">Unpaid Balance Due</th>
                        <th className="py-2.5 px-3">Preferred Payout Rail</th>
                        <th className="py-2.5 px-3 text-right">Disburse Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D8]/60">
                      {workloadSummary.affiliateMetrics.map((m) => {
                        const aff = m.affiliate;
                        return (
                          <tr key={aff.id} className="hover:bg-[#FAF8F5]">
                            <td className="py-3 px-3">
                              <div className="font-bold text-[#0F172A]">{aff.name}</div>
                              <div className="text-[10px] text-[#64748B]">{aff.email}</div>
                            </td>

                            <td className="py-3 px-3 font-mono">
                              {((aff.commissionRate || 0.25) * 100).toFixed(0)}%
                            </td>

                            <td className="py-3 px-3 font-mono font-semibold text-[#0F172A]">
                              ${m.earnedCommission} USD
                            </td>

                            <td className="py-3 px-3 font-mono text-[#64748B]">
                              ${m.paidOut} USD
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                                  m.pendingPayout > 0
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                ${m.pendingPayout} USD
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <div className="uppercase font-semibold text-[10px] text-[#0F172A]">
                                {aff.payoutMethodPreference || 'wise'}
                              </div>
                              <div className="text-[10px] text-[#78716C] font-mono truncate max-w-xs">
                                {aff.payoutAccountDetails || aff.email}
                              </div>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  setPreselectedPayoutAffiliateId(aff.id);
                                  setShowPayoutModal(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition-colors text-xs"
                              >
                                Disburse
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payout Transactions History Table */}
              <div className="space-y-3 pt-4 border-t border-[#E8E2D8]">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-[#0F172A]">
                    Historical Disbursement Records
                  </h4>
                  <span className="text-xs text-[#64748B] font-mono">
                    {payouts.length} Settled Transactions
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E8E2D8] text-[#78716C] uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Partner</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Method & Details</th>
                        <th className="py-2.5 px-3">Reference / Batch ID</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D8]/60">
                      {payouts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-3 px-3 font-mono text-[#64748B]">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>

                          <td className="py-3 px-3 font-semibold text-[#0F172A]">
                            {p.affiliateName}
                          </td>

                          <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                            ${p.amount.toLocaleString()} {p.currency}
                          </td>

                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-[#FAF3E3] text-[#7A5B20] border border-[#C59B4B]/30 uppercase text-[10px] font-bold">
                              {p.method.replace('_', ' ')}
                            </span>
                            <div className="text-[10px] text-[#78716C] font-mono mt-0.5 truncate max-w-xs">
                              {p.methodDetails}
                            </div>
                          </td>

                          <td className="py-3 px-3 font-mono text-[11px] text-[#0F172A]">
                            {p.referenceId}
                          </td>

                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono uppercase">
                              {p.status}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-[#526071] text-[11px]">
                            {p.notes || 'Honoraria settlement'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: ASTROLOGY WORKSPACE (UNRESTRICTED) */}
          {activeTab === 'astrology' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 shadow-sm flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-800 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Demo chart engine — external provider not connected</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                    Master Astrology Workspace (Local Calculation Engine)
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Executive inspection of client Sidereal Kundalis with constitutional temperament overlays.
                  </p>
                </div>

                <select
                  value={astrologyClientId}
                  onChange={(e) => setAstrologyClientId(e.target.value)}
                  className="p-2 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] text-xs font-semibold"
                >
                  {users
                    .filter((u) => u.role === 'client')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.birthCity})
                      </option>
                    ))}
                </select>
              </div>

              {chartRes?.success && chartRes.chart && (
                <div className="space-y-6">
                  <InteractiveKundali data={chartRes.chart} reducedMotion={reducedMotion} />
                  <PlanetaryMatrix
                    planets={chartRes.chart.planets}
                    ascendant={chartRes.chart.ascendant}
                    reducedMotion={reducedMotion}
                  />
                  <DashaTransitTimeline data={chartRes.chart} reducedMotion={reducedMotion} />
                </div>
              )}
            </div>
          )}

          {/* TAB 10: KNOWLEDGE CENTRE */}
          {activeTab === 'knowledge' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E8E2D8]">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                    Internal Shastric Library & Study Notes
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Study notes, reading templates, and clinical boundary manuals for internal practice use.
                  </p>
                </div>
              </div>

              {/* Add Study Note Form */}
              <form onSubmit={handleCreateKnowledgeNote} className="p-5 bg-[#FCFBF9] rounded-2xl border border-[#E8E2D8] space-y-3 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#A87F32] text-[10px] block">
                  Add New Study Note
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Treatise or Template Title..."
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="p-2 rounded-lg border border-[#E8E2D8] bg-white"
                  />
                  <select
                    value={newNoteCategory}
                    onChange={(e) => setNewNoteCategory(e.target.value as KnowledgeNote['category'])}
                    className="p-2 rounded-lg border border-[#E8E2D8] bg-white"
                  >
                    <option value="Medical Astrology Principles">Medical Astrology Principles</option>
                    <option value="Reading Templates">Reading Templates</option>
                    <option value="Ethical Guidelines">Ethical Guidelines</option>
                    <option value="Cartomancy Synergies">Cartomancy Synergies</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  placeholder="Record your research insights, planetary correlations, or reading script..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E8E2D8] bg-white"
                />
                <div className="text-right">
                  <button type="submit" className="px-4 py-2 bg-[#0F172A] text-white rounded-lg font-medium hover:bg-[#1E293B]">
                    Publish to Knowledge Centre
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {knowledgeNotes.map((kn) => (
                  <div key={kn.id} className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-[#A87F32] font-semibold">
                      <span>{kn.category}</span>
                      <span className="text-[#94A3B8] font-mono">{kn.updatedAt}</span>
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#0F172A]">{kn.title}</h4>
                    <p className="text-[#526071] leading-relaxed">{kn.content}</p>
                    <div className="text-[10px] text-[#94A3B8] pt-2 border-t border-[#E8E2D8]/60">
                      Author: {kn.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: RESEARCH WORKSPACE (ADMIN-ONLY & DE-IDENTIFIED) */}
          {activeTab === 'research' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              {/* Mandatory Research Screen Disclaimer */}
              <div className="p-5 rounded-2xl bg-[#0F172A] text-white border border-[#334155] space-y-2">
                <div className="flex items-center gap-2 text-[#C59B4B] font-bold text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>Research Regulatory Notice</span>
                </div>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  “Research use only. This workspace does not provide medical diagnosis, treatment recommendations, or clinical decision support.”
                </p>
              </div>

              {/* Study Protocol Card */}
              <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#A87F32] font-semibold">
                    Protocol: {researchStudy.protocolNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px]">
                    Status: {researchStudy.status}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-lg text-[#0F172A]">
                  {researchStudy.title}
                </h4>
                <p className="text-[#526071] leading-relaxed">
                  <strong>Hypothesis:</strong> {researchStudy.hypothesis}
                </p>
                <div className="text-[11px] text-[#78716C] pt-2 border-t border-[#E8E2D8]/60">
                  Lead Researcher: {researchStudy.leadResearcher} · Sample Size: {researchStudy.sampleSize} participants
                </div>
              </div>

              {/* De-identified Participants Table */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                  <h4 className="font-serif font-bold text-base text-[#0F172A]">
                    De-Identified Participant Records ({researchParticipants.filter(p => !p.withdrawn).length} Active)
                  </h4>

                  <button
                    onClick={handleExportResearchCSV}
                    className="px-3 py-1.5 bg-white border border-[#E8E2D8] hover:border-[#C59B4B] text-xs font-medium rounded-lg flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C59B4B]" />
                    <span>Export Anonymized CSV</span>
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {researchParticipants.map((rp) => (
                    <div
                      key={rp.id}
                      className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        rp.withdrawn ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-[#FCFBF9] border-[#E8E2D8]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0F172A]">{rp.deidentifiedId}</span>
                          <span className="text-[#78716C]">Intake: {rp.intakeDate}</span>
                          {rp.withdrawn && (
                            <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 px-1.5 rounded">
                              Consent Withdrawn
                            </span>
                          )}
                        </div>
                        <div className="text-[#526071] mt-1">
                          <strong>Astrological Variables:</strong> {rp.primaryAstrologicalSignatures.join(', ')}
                        </div>
                        <div className="text-[#526071] mt-0.5">
                          <strong>Outcome:</strong> {rp.verifiedOutcomeCategory} ({rp.outcomeSource})
                        </div>
                      </div>

                      {!rp.withdrawn && (
                        <button
                          onClick={() => handleWithdrawParticipant(rp.id)}
                          className="px-2.5 py-1 text-[11px] text-red-700 border border-red-200 hover:bg-red-50 rounded-lg shrink-0"
                        >
                          Withdraw Participant
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: SECURITY AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E8E2D8]">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                    Security Audit & Consent Event Stream
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Prototype activity record of demonstration logins, chart generations, and consent events (not an immutable audit log).
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search activity records..."
                    value={searchAudit}
                    onChange={(e) => setSearchAudit(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      log.isSensitive ? 'bg-[#FAF8F5] border-[#C59B4B]/40' : 'bg-[#FCFBF9] border-[#E8E2D8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#A87F32]">{log.action}</span>
                        <span className="font-semibold text-[#0F172A]">{log.actorName} ({log.actorRole})</span>
                        {log.isSensitive && (
                          <span className="text-[9px] bg-amber-50 text-amber-900 border border-amber-300 px-1 rounded">
                            Sensitive
                          </span>
                        )}
                      </div>
                      <p className="text-[#526071] mt-0.5">{log.details}</p>
                    </div>

                    <div className="text-right text-[10px] text-[#94A3B8] font-mono shrink-0">
                      <div>{new Date(log.timestamp).toLocaleString()}</div>
                      <div>IP: {log.ipAddress}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 13: SETTINGS & ADMIN PASSWORD */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8]">
                <div>
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#C59B4B]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#C59B4B] font-bold">
                      Director Credentials & Access Control
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#0F172A] mt-1">
                    Admin Security & Password Management
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Manage the executive credentials used to access the Purva Phalguni Director Suite.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 self-start sm:self-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Salted SHA-256 Active</span>
                </div>
              </div>

              {/* Cryptographic Architecture Card */}
              <div className="p-4 bg-[#FCFBF9] rounded-2xl border border-[#E8E2D8] space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                  <Lock className="w-4 h-4 text-[#C59B4B]" />
                  <span>How Passwords Are Protected</span>
                </div>
                <p className="text-[#526071] leading-relaxed">
                  Passwords in Purva Phalguni are never stored in plain text. Whenever you set or change a password, a <strong>128-bit cryptographically secure random salt</strong> is generated via <code className="bg-[#FAF3E3] text-[#7A5B20] px-1.5 py-0.5 rounded font-mono text-[11px]">crypto.getRandomValues</code>, combined with your password, and digested through <strong>SHA-256</strong>. Credential verifications utilize constant-time string comparisons to prevent timing attacks.
                </p>
              </div>

              {/* Success / Error Alerts */}
              {passwordSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Password Change Form */}
              <form onSubmit={handleUpdateAdminPassword} className="max-w-lg space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Current Admin Password
                  </label>
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder={import.meta.env.VITE_DEMO_MODE === 'true' ? `Enter current password (demo: ${import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD || 'SanctuaryAdmin2026!'})` : "Enter current password"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                      New Admin Password
                    </label>
                    <span className="text-[10px] text-[#94A3B8]">Minimum 8 characters</span>
                  </div>
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#0F172A] focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5"
                  >
                    {showPasswordText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPasswordText ? 'Hide password characters' : 'Show password characters'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#C59B4B] hover:text-[#0F172A] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{isUpdatingPassword ? 'Hashing & Saving...' : 'Update Admin Password'}</span>
                  </button>
                </div>
              </form>

              {/* Account Security Information Grid */}
              <div className="pt-6 border-t border-[#E8E2D8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Administrator Email</span>
                  <div className="font-semibold text-[#0F172A] mt-1">{admin.email}</div>
                  <span className="text-[10px] text-emerald-700">Root Executive Role</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Password Policy Status</span>
                  <div className="font-mono font-bold text-[#A87F32] mt-1">
                    {admin.passwordHash ? 'Custom Hash Saved' : import.meta.env.VITE_DEMO_MODE === 'true' ? 'Demo Seed Active' : 'Protected'}
                  </div>
                  <span className="text-[10px] text-[#78716C]">
                    {admin.passwordLastChanged ? `Changed: ${new Date(admin.passwordLastChanged).toLocaleDateString()}` : 'Initial state'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Digest Verification</span>
                  <div className="font-semibold text-emerald-800 mt-1">Salted SHA-256 Verified</div>
                  <span className="text-[10px] text-[#78716C]">Client-side zero knowledge</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#0F172A] text-white shadow-2xl border border-[#C59B4B]/40 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-[#C59B4B] shrink-0" />
          <span className="font-medium">{actionNotification}</span>
        </div>
      )}

      {/* Add Partner Modal */}
      <AddAffiliateModal
        isOpen={showAddAffiliateModal}
        onClose={() => setShowAddAffiliateModal(false)}
        onAdded={(newPartner) => {
          loadAllData();
          showToast(`Partner ${newPartner.name} onboarded successfully and synced to practice roster.`);
        }}
      />

      {/* Remove / Suspend Partner Modal */}
      <RemoveAffiliateModal
        isOpen={showRemoveAffiliateModal}
        affiliate={targetRemoveAffiliate}
        activeAffiliates={users.filter((u) => u.role === 'affiliate')}
        onClose={() => {
          setShowRemoveAffiliateModal(false);
          setTargetRemoveAffiliate(null);
        }}
        onRemoved={(res) => {
          loadAllData();
          showToast(
            res.reassignedCount > 0
              ? `Partner updated. ${res.reassignedCount} clients safely reassigned.`
              : `Partner status updated.`
          );
        }}
      />

      {/* Edit Partner Modal */}
      <EditAffiliateModal
        isOpen={showEditAffiliateModal}
        affiliate={editingAffiliate}
        onClose={() => {
          setShowEditAffiliateModal(false);
          setEditingAffiliate(null);
        }}
        onUpdated={() => {
          loadAllData();
          showToast('Partner credentials & commission rate updated.');
        }}
      />

      {/* Disburse Partner Payout Modal */}
      <PartnerPayoutModal
        isOpen={showPayoutModal}
        affiliates={users.filter((u) => u.role === 'affiliate')}
        preselectedAffiliateId={preselectedPayoutAffiliateId}
        onClose={() => {
          setShowPayoutModal(false);
          setPreselectedPayoutAffiliateId(undefined);
        }}
        onPayoutProcessed={(p) => {
          loadAllData();
          showToast(`Disbursed $${p.amount} USD to ${p.affiliateName} (Ref: ${p.referenceId}).`);
        }}
      />

      {/* Broadcast Practice Update Modal */}
      <PracticeBroadcastModal
        isOpen={showBroadcastModal}
        affiliates={users.filter((u) => u.role === 'affiliate')}
        onClose={() => setShowBroadcastModal(false)}
        onPublished={() => {
          loadAllData();
          showToast('Practice update broadcast live to all practitioner consoles.');
        }}
      />
    </div>
  );
};
