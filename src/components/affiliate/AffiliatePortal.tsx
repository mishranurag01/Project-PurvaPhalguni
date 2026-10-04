import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  BookingSession,
  ReadingSummary,
  PractitionerNote,
  DirectMessage,
  WebsiteSettings,
  AdminBulletin,
  PartnerPayout,
  ServicePlan
} from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { JHoraService, JHoraServiceResponse } from '../../services/jhoraService';
import { InteractiveKundali } from '../InteractiveKundali';
import { PlanetaryMatrix } from '../PlanetaryMatrix';
import { DashaTransitTimeline } from '../DashaTransitTimeline';
import { MagneticButton } from '../MagneticButton';
import { NotAuthenticated } from '../common/NotAuthenticated';
import { PermissionDenied } from '../common/PermissionDenied';
import {
  Users,
  Calendar,
  Sparkles,
  MessageSquare,
  FileText,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  Lock,
  Share2,
  Bookmark,
  ShieldAlert,
  Clock,
  Eye,
  LogOut,
  HeartPulse,
  Radio,
  Bell,
  CreditCard,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { soundSynth } from '../../utils/soundAmbience';

interface AffiliatePortalProps {
  affiliate: UserProfile;
  settings: WebsiteSettings;
  onExitPortal: () => void;
  reducedMotion?: boolean;
}

export const AffiliatePortal: React.FC<AffiliatePortalProps> = ({
  affiliate,
  settings,
  onExitPortal,
  reducedMotion = false
}) => {
  if (!affiliate) {
    return (
      <NotAuthenticated
        requiredPortalName="Affiliate Practitioner Desk"
        onSignIn={onExitPortal}
        onReturnHome={onExitPortal}
      />
    );
  }

  if (affiliate.activeStatus === 'deactivated') {
    return (
      <PermissionDenied
        requiredRoleName="Active Practitioners"
        customMessage="This affiliate account is currently deactivated or on sabbatical."
        onReturnHome={onExitPortal}
        onSwitchAccount={onExitPortal}
      />
    );
  }

  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'calendar' | 'messages' | 'astrology' | 'referrals' | 'profile'>('dashboard');

  // Assigned Clients only
  const [assignedClients, setAssignedClients] = useState<UserProfile[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<UserProfile | null>(null);

  // Affiliate's Bookings
  const [bookings, setBookings] = useState<BookingSession[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [activeChatClient, setActiveChatClient] = useState<UserProfile | null>(null);
  const [chatInput, setChatInput] = useState('');

  // Live Admin Bulletins & Partner Payouts
  const [bulletins, setBulletins] = useState<AdminBulletin[]>([]);
  const [payouts, setPayouts] = useState<PartnerPayout[]>([]);
  const [ackToast, setAckToast] = useState<string | null>(null);
  const [services, setServices] = useState<ServicePlan[]>(() => PracticeStore.getServices());
  const [serviceNotice, setServiceNotice] = useState<string | null>(null);

  // JHora Chart State for Selected Client
  const [chartCalculation, setChartCalculation] = useState<JHoraServiceResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Private Practitioner Notes
  const [clientNotes, setClientNotes] = useState<PractitionerNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [noteCategory, setNoteCategory] = useState<PractitionerNote['category']>('Constitutional Tendencies');

  // Client-Facing Summary State
  const [summaryTitle, setSummaryTitle] = useState('Constitutional Vitality Folio');
  const [summaryAstrology, setSummaryAstrology] = useState('');
  const [summaryCartomancy, setSummaryCartomancy] = useState('');
  const [summaryInsights, setSummaryInsights] = useState('');
  const [summaryShared, setSummaryShared] = useState(false);
  const [summarySavedMsg, setSummarySavedMsg] = useState(false);

  const loadAffiliateData = () => {
    // Strictly load ONLY clients assigned to this affiliate
    const allUsers = PracticeStore.getUsers();
    const myClients = allUsers.filter(
      (u) => u.role === 'client' && u.assignedAffiliateId === affiliate.id
    );
    setAssignedClients(myClients);
    if (myClients.length > 0 && !selectedClient) {
      setSelectedClient(myClients[0]);
    }

    // Load bookings for this affiliate
    const allBookings = PracticeStore.getBookings().filter((b) => b.affiliateId === affiliate.id);
    setBookings(allBookings);

    // Messages
    const myMsgs = PracticeStore.getMessages().filter(
      (m) => m.senderId === affiliate.id || m.recipientId === affiliate.id
    );
    setMessages(myMsgs);

    // Practice Bulletins targeted to all or this affiliate
    const allBulletins = PracticeStore.getBulletins().filter(
      (b) => b.targetAffiliateId === 'all' || b.targetAffiliateId === affiliate.id
    );
    setBulletins(allBulletins);

    // Disbursed Payouts
    const myPayouts = PracticeStore.getPayouts().filter((p) => p.affiliateId === affiliate.id);
    setPayouts(myPayouts);

    // Services Catalog
    setServices(PracticeStore.getServices());
  };

  useEffect(() => {
    loadAffiliateData();

    // Live subscription to Admin changes, broadcasts, client reassignments & payouts
    const unsubscribe = PracticeStore.subscribe((event) => {
      loadAffiliateData();
      if (event.type === 'SERVICES_UPDATED') {
        const fresh = PracticeStore.getServices();
        setServices(fresh);
        const updated = event.payload?.updatedService;
        if (updated) {
          setServiceNotice(
            `Director Update: Service "${updated.name}" updated to ${updated.duration} ($${updated.price} USD · Your Honorarium: $${Math.round(updated.price * (affiliate.payoutSplitPercentage || 60) / 100)} USD).`
          );
        } else {
          setServiceNotice('Director Update: Consultation catalog & rates updated in real time.');
        }
        setTimeout(() => setServiceNotice(null), 7000);
      } else if (event.type === 'BULLETIN_ADDED' || event.type === 'PAYOUT_SENT') {
        soundSynth.playCelestialChime();
      }
    });

    return () => unsubscribe();
  }, [affiliate.id]);

  const handleAcknowledgeBulletin = (bulletinId: string) => {
    soundSynth.playSoftTap();
    PracticeStore.acknowledgeBulletin(bulletinId, affiliate.id);
    loadAffiliateData();
    setAckToast('Bulletin marked as acknowledged and synced with Admin.');
    setTimeout(() => setAckToast(null), 3000);
  };

  // Dynamic Workload & Financial Calculations
  const completedConsultations = bookings.filter((b) => b.status === 'completed');
  const earnedHonoraria = Math.round(
    completedConsultations.reduce((sum, b) => sum + b.amount, 0) * (affiliate.commissionRate || 0.25)
  );
  const totalPaidOut = payouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayout = Math.max(0, earnedHonoraria - totalPaidOut);

  const pendingSessions = bookings.filter((b) => b.status === 'confirmed');
  const pendingSummaries = bookings.filter((b) => b.status === 'completed' && !b.hasSummaryShared);
  const deliveredSummaries = bookings.filter((b) => b.hasSummaryShared);
  const unreadClientMsgs = messages.filter((m) => !m.isRead && m.senderRole === 'client');

  const pendingWorksCount = pendingSessions.length + pendingSummaries.length + unreadClientMsgs.length;
  const completedWorksCount = completedConsultations.length + deliveredSummaries.length;
  const totalWorksCount = pendingWorksCount + completedWorksCount;
  const completionRate = totalWorksCount > 0 ? Math.round((completedWorksCount / totalWorksCount) * 100) : 100;

  const unacknowledgedBulletins = bulletins.filter((b) => !b.acknowledgedBy.includes(affiliate.id));

  // Load client-specific data when selectedClient changes
  useEffect(() => {
    if (!selectedClient) return;

    // Load notes
    const notes = PracticeStore.getNotes().filter((n) => n.clientId === selectedClient.id);
    setClientNotes(notes);

    // Load summary draft if any
    const existingSummary = PracticeStore.getSummaries().find(
      (s) => s.clientId === selectedClient.id
    );
    if (existingSummary) {
      setSummaryTitle(existingSummary.title);
      setSummaryAstrology(existingSummary.coreAstrologicalFocus);
      setSummaryCartomancy(existingSummary.cartomancySpreads);
      setSummaryInsights(existingSummary.reflectiveInsights);
      setSummaryShared(existingSummary.isSharedWithClient);
    } else {
      setSummaryTitle(`Constitutional Vitality Folio - ${selectedClient.name}`);
      setSummaryAstrology(
        `Lagna Analysis: Sidereal examination of vitality rhythms for ${selectedClient.name}. Constitutional humor shows active Pitta-Vata balance requiring evening grounding.`
      );
      setSummaryCartomancy(
        `Three of Pentacles + Temperance: Sustained collaborative output grounded by rhythmic restoration.`
      );
      setSummaryInsights(
        `Pace demanding creative tasks in the forenoon hours. Establish uninterrupted quiet following digital correspondence.`
      );
      setSummaryShared(false);
    }

    // Auto-calculate JHora chart if consent is valid
    if (selectedClient.consentGiven && !selectedClient.consentWithdrawn) {
      setIsCalculating(true);
      const res = JHoraService.calculateClientChart(selectedClient, {
        id: affiliate.id,
        name: affiliate.name,
        role: 'affiliate'
      });
      setChartCalculation(res);
      setIsCalculating(false);
    } else {
      setChartCalculation({
        success: false,
        error: 'Client has not provided active consent for astrology chart generation.',
        provider: 'AstrologyCalculationProvider (Local Demo Engine)',
        isExternalProviderConnected: false,
        providerNotice: 'Prototype demonstration engine.'
      });
    }
  }, [selectedClient?.id, affiliate]);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newNoteText.trim()) return;

    soundSynth.playSoftTap();
    const newNote: PractitionerNote = {
      id: `note-${Date.now()}`,
      clientId: selectedClient.id,
      authorId: affiliate.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: noteCategory,
      text: newNoteText.trim(),
      isPrivate: true // NEVER shared with client
    };

    const updated = [newNote, ...clientNotes];
    setClientNotes(updated);
    PracticeStore.saveNotes([...PracticeStore.getNotes(), newNote]);
    setNewNoteText('');

    PracticeStore.logAction(
      affiliate.id,
      affiliate.name,
      'affiliate',
      'PRACTITIONER_NOTE_EDIT',
      `Added private practitioner note for client ${selectedClient.name}`,
      true
    );
  };

  const handleSaveSummary = (shareWithClientNow: boolean) => {
    if (!selectedClient) return;

    soundSynth.playCelestialChime();
    const existing = PracticeStore.getSummaries();
    const otherSummaries = existing.filter((s) => s.clientId !== selectedClient.id);

    const updatedSummary: ReadingSummary = {
      id: `sum-${Date.now()}`,
      bookingId: bookings[0]?.id || `book-${Date.now()}`,
      clientId: selectedClient.id,
      authorId: affiliate.id,
      authorName: affiliate.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: summaryTitle,
      coreAstrologicalFocus: summaryAstrology,
      cartomancySpreads: summaryCartomancy,
      reflectiveInsights: summaryInsights,
      suggestedContemplations: [
        'Practice 20 minutes of silent contemplation upon rising.',
        'Sip warm infusion of chamomile and fennel during demanding weeks.',
        'Respect seasonal solstices with scheduled studio pauses.'
      ],
      isSharedWithClient: shareWithClientNow,
      sharedAt: shareWithClientNow ? new Date().toISOString() : undefined
    };

    PracticeStore.saveSummaries([...otherSummaries, updatedSummary]);
    setSummaryShared(shareWithClientNow);
    setSummarySavedMsg(true);
    setTimeout(() => setSummarySavedMsg(false), 2500);

    PracticeStore.logAction(
      affiliate.id,
      affiliate.name,
      'affiliate',
      shareWithClientNow ? 'SUMMARY_SHARED' : 'PRACTITIONER_NOTE_EDIT',
      `${shareWithClientNow ? 'Shared' : 'Saved draft of'} reading summary for ${selectedClient.name}`,
      true
    );
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatClient || !chatInput.trim()) return;

    soundSynth.playSoftTap();
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: affiliate.id,
      senderName: affiliate.name,
      senderRole: 'affiliate',
      recipientId: activeChatClient.id,
      recipientName: activeChatClient.name,
      text: chatInput.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updated = [...messages, newMsg];
    PracticeStore.saveMessages([...PracticeStore.getMessages(), newMsg]);
    setMessages(updated);
    setChatInput('');
  };

  const filteredClients = assignedClients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const referralUrl = `https://practice.org/reserve?ref=${affiliate.affiliateCode || 'CROFT20'}`;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C59B4B]" />
            <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
              Practitioner Enclave (Affiliate)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] mt-1">
            {affiliate.name}
          </h1>
          <p className="text-xs text-[#526071] mt-0.5">
            {affiliate.specialty} · Assigned Clients Only
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#FAF8F5] border border-[#E8E2D8] px-3 py-1.5 rounded-lg text-xs font-mono text-[#0F172A]">
            Commission Rate: {((affiliate.commissionRate || 0.25) * 100).toFixed(0)}%
          </div>
          <button
            onClick={onExitPortal}
            className="px-3 py-1.5 rounded-lg border border-[#E8E2D8] text-xs font-medium text-[#78716C] hover:text-[#0F172A] flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Portal</span>
          </button>
        </div>
      </div>

      {/* Unacknowledged Bulletin Alert Banner from Admin */}
      {unacknowledgedBulletins.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Radio className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="font-bold text-amber-900 flex items-center gap-2">
                <span>Synchronized Practice Update from Director</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold uppercase">
                  {unacknowledgedBulletins[0].priority}
                </span>
              </div>
              <div className="text-amber-800 font-semibold mt-0.5">{unacknowledgedBulletins[0].title}</div>
              <p className="text-amber-700 text-[11px] mt-0.5 line-clamp-2">
                {unacknowledgedBulletins[0].content}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAcknowledgeBulletin(unacknowledgedBulletins[0].id)}
            className="px-3.5 py-2 rounded-xl bg-amber-800 text-white font-semibold hover:bg-amber-900 transition-colors shrink-0 text-xs flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Acknowledge Update</span>
          </button>
        </div>
      )}

      {/* Acknowledgment Confirmation Toast */}
      {ackToast && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{ackToast}</span>
        </div>
      )}

      {/* Main Grid: Sidebar + Tabs */}
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
            onClick={() => setActiveTab('clients')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'clients'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Users className="w-4 h-4 text-[#C59B4B]" />
            <span>My Assigned Clients ({assignedClients.length})</span>
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
            <span>Astrology Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'calendar'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#C59B4B]" />
            <span>My Calendar ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'messages'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#C59B4B]" />
            <span>Messages ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'referrals'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#C59B4B]" />
            <span>Referrals & Honoraria</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Live Real-time Service Rates Notice */}
          {serviceNotice && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span className="font-semibold">{serviceNotice}</span>
              </div>
              <button
                onClick={() => setServiceNotice(null)}
                className="text-amber-800 hover:text-black text-xs font-semibold px-2 py-0.5"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Workload Progression & Tasks Checklist Card */}
              <div className="p-6 bg-white rounded-3xl border border-[#E8E2D8] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D8]">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#C59B4B] font-bold">
                      Practitioner Caseload Tracker
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#0F172A]">
                      My Workload Progression (Pending vs Done)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                      {completionRate}% Completed
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8]">
                    <div className="flex items-center justify-between text-[#78716C]">
                      <span>Pending Works</span>
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-amber-800 mt-1">
                      {pendingWorksCount}
                    </div>
                    <div className="text-[11px] text-[#78716C] mt-0.5">
                      {pendingSessions.length} sessions, {pendingSummaries.length} summaries, {unreadClientMsgs.length} msgs
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8]">
                    <div className="flex items-center justify-between text-[#78716C]">
                      <span>Completed Works</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
                      {completedWorksCount}
                    </div>
                    <div className="text-[11px] text-[#78716C] mt-0.5">
                      {completedConsultations.length} conducted, {deliveredSummaries.length} delivered
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8]">
                    <div className="flex items-center justify-between text-[#78716C]">
                      <span>Unpaid Balance Due</span>
                      <DollarSign className="w-4 h-4 text-[#A87F32]" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1 font-mono">
                      ${pendingPayout.toLocaleString()} USD
                    </div>
                    <div className="text-[11px] text-[#78716C] mt-0.5">
                      Total earned: ${earnedHonoraria} USD
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#78716C] mb-1 font-mono">
                    <span>Task Progression Rate</span>
                    <span>{completedWorksCount} / {totalWorksCount} tasks</span>
                  </div>
                  <div className="w-full bg-[#E8E2D8] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C59B4B] h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Live Practice Bulletins & Admin Updates Section */}
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#C59B4B]" />
                    <h3 className="text-lg font-serif font-bold text-[#0F172A]">
                      Practice Bulletins & Live Updates from Sanctuary Director
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Synced</span>
                  </span>
                </div>

                <div className="space-y-3">
                  {bulletins.map((b) => {
                    const isAcked = b.acknowledgedBy.includes(affiliate.id);
                    return (
                      <div
                        key={b.id}
                        className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                          !isAcked
                            ? 'bg-[#FAF3E3]/40 border-[#C59B4B]/60 ring-1 ring-[#C59B4B]/30'
                            : 'bg-[#FCFBF9] border-[#E8E2D8]'
                        }`}
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

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#78716C]">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                            {isAcked ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono">
                                ✓ Acknowledged
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAcknowledgeBulletin(b.id)}
                                className="px-2.5 py-1 rounded bg-[#0F172A] text-white hover:bg-[#C59B4B] hover:text-[#0F172A] transition-colors text-[10px] font-bold"
                              >
                                Mark Acknowledged
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-[#526071] leading-relaxed">{b.content}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Assigned Clients</span>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    {assignedClients.length}
                  </div>
                  <span className="text-[11px] text-emerald-700">Strictly isolated dossier</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Upcoming Sessions</span>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    {bookings.filter((b) => b.status === 'confirmed').length}
                  </div>
                  <span className="text-[11px] text-[#A87F32]">Next session on calendar</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Unread Client Messages</span>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    {messages.filter((m) => !m.isRead && m.senderRole === 'client').length}
                  </div>
                  <span className="text-[11px] text-[#78716C]">Confidential inquiries</span>
                </div>
              </div>

              {/* Upcoming Session List */}
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-[#0F172A] pb-3 border-b border-[#E8E2D8]">
                  Upcoming Assigned Consultations
                </h3>
                <div className="mt-4 space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl bg-[#FCFBF9] border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-[#0F172A] text-sm">{b.clientName}</div>
                        <div className="text-[#526071]">
                          {b.serviceName} · {b.date} at {b.timeSlot}
                        </div>
                        <p className="text-[11px] text-[#78716C] italic mt-1">
                          Intention: "{b.clientIntention}"
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const clientObj = assignedClients.find((c) => c.id === b.clientId);
                          if (clientObj) {
                            setSelectedClient(clientObj);
                            setActiveTab('astrology');
                          }
                        }}
                        className="px-3 py-1.5 bg-[#0F172A] text-white rounded-lg text-xs font-medium hover:bg-[#1E293B]"
                      >
                        Launch Astrology Workspace
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practice Service Protocols & Honorarium Schedule */}
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D8]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C59B4B]" />
                    <h3 className="text-lg font-serif font-bold text-[#0F172A]">
                      Practice Consultation Protocols & Honorarium Schedule
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-mono text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-Time Practice Sync</span>
                  </span>
                </div>

                <p className="text-xs text-[#64748B]">
                  Official practice session durations and honorarium compensation per consultation (Split: {affiliate.payoutSplitPercentage || 60}%).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {services.filter((s) => s.isActive).map((s) => {
                    const splitPct = affiliate.payoutSplitPercentage || 60;
                    const honorariumAmount = Math.round((s.price * splitPct) / 100);
                    return (
                      <div key={s.id} className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#A87F32] font-semibold">{s.code}</span>
                          <span className="font-mono text-xs text-[#0F172A] font-bold">Client Fee: ${s.price}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#0F172A]">{s.name}</h4>
                        <div className="text-xs text-[#526071] flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#C59B4B]" />
                          <span>Session Duration: {s.duration}</span>
                        </div>
                        <div className="pt-2 border-t border-[#E8E2D8]/60 flex items-center justify-between text-[11px]">
                          <span className="text-[#64748B]">Your Honorarium ({splitPct}%):</span>
                          <span className="font-mono font-bold text-emerald-700">${honorariumAmount} USD</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY CLIENTS */}
          {activeTab === 'clients' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E8E2D8]">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                    Assigned Client Dossiers
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    You have access strictly to clients assigned to your practice by the Director.
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search assigned clients..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredClients.map((c) => {
                  const isSelected = selectedClient?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedClient(c)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FAF3E3] border-[#C59B4B] ring-1 ring-[#C59B4B]'
                          : 'bg-[#FCFBF9] border-[#E8E2D8] hover:border-[#C59B4B]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-base text-[#0F172A]">{c.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                          c.consentGiven && !c.consentWithdrawn
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                          {c.consentGiven && !c.consentWithdrawn ? 'Consent Active' : 'No Consent'}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">{c.email} · {c.phone}</p>
                      
                      <div className="mt-3 pt-3 border-t border-[#E8E2D8]/60 text-xs text-[#526071] space-y-1">
                        <div>
                          <strong>Birth Data:</strong> {c.birthDate} at {c.birthTime} ({c.birthCity})
                        </div>
                        <div className="truncate">
                          <strong>Intention:</strong> {c.primaryIntention}
                        </div>
                      </div>

                      <div className="mt-4 pt-2 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClient(c);
                            setActiveTab('astrology');
                          }}
                          className="text-xs text-[#0F172A] font-semibold hover:text-[#C59B4B] flex items-center gap-1"
                        >
                          <span>Open Chart & Notes</span>
                          <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ASTROLOGY WORKSPACE (LOCAL CALCULATION ENGINE) */}
          {activeTab === 'astrology' && selectedClient && (
            <div className="space-y-6">
              {/* Workspace Header */}
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-800 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Demo chart engine — external provider not connected</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#C59B4B] font-semibold">
                      Sidereal Calculation Desk (AstrologyCalculationProvider)
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#0F172A] mt-0.5">
                    {selectedClient.name} · {selectedClient.birthCity}
                  </h3>
                  <div className="text-xs text-[#64748B] mt-1">
                    Birth: {selectedClient.birthDate} {selectedClient.birthTime} · Lahiri Ayanamsa (Parashari)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedClient.id}
                    onChange={(e) => {
                      const found = assignedClients.find((c) => c.id === e.target.value);
                      if (found) setSelectedClient(found);
                    }}
                    className="text-xs p-2 rounded-lg border border-[#E8E2D8] bg-[#FCFBF9]"
                  >
                    {assignedClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        Switch Client: {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Strict Non-Medical Banner */}
              <div className="p-4 rounded-2xl bg-[#FAF3E3] border border-[#EBDAB5] text-xs text-[#7A5B20] flex items-start gap-3">
                <HeartPulse className="w-5 h-5 text-[#C59B4B] shrink-0 mt-0.5" />
                <p>
                  <strong>Practitioner Guideline:</strong> Astrological humor balances (Pitta, Vata, Kapha) and 6th/8th Bhava indicators reflect spiritual chronobiology and somatic pacing. Do not provide clinical diagnosis or therapeutic medical advice.
                </p>
              </div>

              {/* Chart Display if calculation succeeded */}
              {chartCalculation?.success && chartCalculation.chart && (
                <div className="space-y-6">
                  {/* Constitutional Temperaments */}
                  {chartCalculation.constitutional && (
                    <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                        <h4 className="text-lg font-serif font-bold text-[#0F172A]">
                          Constitutional Temperaments (Iatromathematics)
                        </h4>
                        <span className="text-xs font-mono font-semibold text-[#A87F32] bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#E8E2D8]">
                          {chartCalculation.constitutional.dominantTemperament}
                        </span>
                      </div>

                      {/* Dosha Progress Bar */}
                      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]">
                          <span className="font-semibold block">Pitta (Fire/Choleric)</span>
                          <span className="text-lg font-bold font-mono">
                            {chartCalculation.constitutional.doshaDistribution.pitta}%
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#E0E7FF] border border-[#C7D2FE] text-[#3730A3]">
                          <span className="font-semibold block">Vata (Air/Nervous)</span>
                          <span className="text-lg font-bold font-mono">
                            {chartCalculation.constitutional.doshaDistribution.vata}%
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534]">
                          <span className="font-semibold block">Kapha (Water/Earth)</span>
                          <span className="text-lg font-bold font-mono">
                            {chartCalculation.constitutional.doshaDistribution.kapha}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-[#526071] space-y-2">
                        <p><strong>6th Bhava:</strong> {chartCalculation.constitutional.sixthHouseTheme}</p>
                        <p><strong>8th Bhava:</strong> {chartCalculation.constitutional.eighthHouseTheme}</p>
                        <p className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8]">
                          <strong>Somatic Pacing Principle:</strong> {chartCalculation.constitutional.vitalityPreservationNote}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Interactive North/South Kundali */}
                  <InteractiveKundali data={chartCalculation.chart} reducedMotion={reducedMotion} />

                  {/* Planetary Positions & Aspects */}
                  <PlanetaryMatrix
                    planets={chartCalculation.chart.planets}
                    ascendant={chartCalculation.chart.ascendant}
                    reducedMotion={reducedMotion}
                  />

                  {/* Dasha & Transits */}
                  <DashaTransitTimeline data={chartCalculation.chart} reducedMotion={reducedMotion} />
                </div>
              )}

              {/* Error or Consent Warning */}
              {!chartCalculation?.success && (
                <div className="bg-white rounded-3xl border border-red-200 p-8 text-center text-xs text-red-700 space-y-2">
                  <ShieldAlert className="w-8 h-8 mx-auto text-red-500" />
                  <h4 className="text-base font-serif font-bold text-red-900">
                    Astrology Calculation Restricted
                  </h4>
                  <p>{chartCalculation?.error || 'Unable to generate chart.'}</p>
                </div>
              )}

              {/* Private Practitioner Notes (Never shared with client) */}
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-[#0F172A] flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#C59B4B]" />
                      Private Practitioner Notes
                    </h4>
                    <p className="text-[11px] text-[#78716C]">
                      These reflective observations are strictly internal and temporary for this session.
                    </p>
                  </div>
                  <span className="text-[10px] text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-mono">
                    Practitioner Eyes Only
                  </span>
                </div>

                <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
                  <div className="flex gap-2">
                    <select
                      value={noteCategory}
                      onChange={(e) => setNoteCategory(e.target.value as PractitionerNote['category'])}
                      className="p-2 rounded-lg border border-[#E8E2D8] bg-[#FCFBF9]"
                    >
                      <option value="Constitutional Tendencies">Constitutional Tendencies</option>
                      <option value="Dasha Dynamics">Dasha Dynamics</option>
                      <option value="Cartomancy Reflections">Cartomancy Reflections</option>
                      <option value="General">General</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Add an internal observation regarding dasha timing, humors, or session pacing..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 p-2 rounded-lg border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0F172A] text-white rounded-lg font-medium hover:bg-[#1E293B]"
                    >
                      Save Note
                    </button>
                  </div>
                </form>

                <div className="space-y-2 pt-2">
                  {clientNotes.map((n) => (
                    <div key={n.id} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] text-xs">
                      <div className="flex items-center justify-between text-[10px] text-[#78716C] mb-1">
                        <span className="font-semibold text-[#A87F32]">{n.category}</span>
                        <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[#0F172A] leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client-Facing Reading Summary Folio Editor */}
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-[#0F172A] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C59B4B]" />
                      Client-Facing Reading Summary Folio
                    </h4>
                    <p className="text-[11px] text-[#78716C]">
                      Draft the post-session insights. Toggle "Share with Client" to publish to their private portal.
                    </p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-md border font-semibold ${
                    summaryShared ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {summaryShared ? 'Shared With Client' : 'Private Draft'}
                  </span>
                </div>

                {summarySavedMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Summary folio saved successfully.</span>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                      Folio Title
                    </label>
                    <input
                      type="text"
                      value={summaryTitle}
                      onChange={(e) => setSummaryTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                      Core Astrological Chronos (Lagna, Dasha, Transits)
                    </label>
                    <textarea
                      rows={3}
                      value={summaryAstrology}
                      onChange={(e) => setSummaryAstrology(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                      Cartomancy Spread & Archetypal Medicines
                    </label>
                    <textarea
                      rows={3}
                      value={summaryCartomancy}
                      onChange={(e) => setSummaryCartomancy(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                      Somatic Pacing & Reflective Insights
                    </label>
                    <textarea
                      rows={3}
                      value={summaryInsights}
                      onChange={(e) => setSummaryInsights(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between">
                  <button
                    onClick={() => handleSaveSummary(false)}
                    className="px-4 py-2 border border-[#E8E2D8] rounded-xl text-xs text-[#0F172A] hover:bg-[#FAF8F5]"
                  >
                    Save Internal Draft
                  </button>

                  <MagneticButton
                    variant="primary"
                    onClick={() => handleSaveSummary(true)}
                    reducedMotion={reducedMotion}
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#C59B4B]" />
                    <span>Publish & Share With Client</span>
                  </MagneticButton>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D8]">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                    Personal Practitioner Calendar
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Assigned readings with real-time session duration guidelines and compensation splits.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Practice Rates Synced</span>
                </span>
              </div>

              <div className="space-y-3">
                {bookings.map((b) => {
                  const matchingSvc = services.find((s) => s.id === b.serviceId || s.name === b.serviceName);
                  const splitPct = affiliate.payoutSplitPercentage || 60;
                  const estimatedHonorarium = Math.round((b.amount * splitPct) / 100);

                  return (
                    <div key={b.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-semibold text-[#0F172A] text-sm">{b.date} · {b.timeSlot}</div>
                        <div className="text-[#526071]">{b.clientName} · {b.serviceName}</div>
                        <div className="text-[11px] text-[#A87F32] mt-1 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Paced Duration: {matchingSvc?.duration || '60 min'}</span>
                          </span>
                          <span>·</span>
                          <span>Client Fee: ${b.amount} USD</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-semibold font-mono">
                            Your Honorarium ({splitPct}%): ${estimatedHonorarium} USD
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded font-semibold self-start sm:self-auto">
                        {b.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm flex flex-col h-[520px]">
              <div className="pb-3 border-b border-[#E8E2D8] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0F172A]">
                    Client Dialogue Channel
                  </h3>
                  <p className="text-[11px] text-[#78716C]">
                    Confidential communications with your assigned clients.
                  </p>
                </div>

                <select
                  value={activeChatClient?.id || ''}
                  onChange={(e) => {
                    const found = assignedClients.find((c) => c.id === e.target.value);
                    if (found) setActiveChatClient(found);
                  }}
                  className="p-1.5 rounded-lg border border-[#E8E2D8] text-xs bg-[#FAF8F5]"
                >
                  <option value="">Select Client to Chat</option>
                  {assignedClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const isMine = m.senderId === affiliate.id;
                  return (
                    <div key={m.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMine
                            ? 'bg-[#0F172A] text-white rounded-tr-xs'
                            : 'bg-[#FAF8F5] border border-[#E8E2D8] text-[#0F172A] rounded-tl-xs'
                        }`}
                      >
                        <span className="text-[9px] block text-[#94A3B8] mb-1 font-mono">{m.senderName}</span>
                        {m.text}
                      </div>
                      <span className="text-[9px] text-[#94A3B8] mt-1 font-mono">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-[#E8E2D8] flex gap-2">
                <input
                  type="text"
                  placeholder={activeChatClient ? `Message ${activeChatClient.name}...` : 'Select a client above to chat...'}
                  disabled={!activeChatClient}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs focus:outline-none focus:border-[#C59B4B]"
                />
                <button
                  type="submit"
                  disabled={!activeChatClient}
                  className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-medium hover:bg-[#1E293B]"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: REFERRALS & HONORARIA */}
          {activeTab === 'referrals' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#0F172A] pb-3 border-b border-[#E8E2D8]">
                Referral Link & Honorarium Ledger
              </h3>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#A87F32] font-semibold">
                  Personal Referral Conduit
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    className="flex-1 p-2.5 rounded-xl border border-[#E8E2D8] bg-white text-xs font-mono text-[#0F172A]"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(referralUrl);
                      soundSynth.playSoftTap();
                    }}
                    className="px-3.5 py-2.5 bg-[#0F172A] text-white rounded-xl text-xs font-medium hover:bg-[#1E293B]"
                  >
                    Copy Link
                  </button>
                </div>
                <p className="text-[11px] text-[#78716C]">
                  Direct inquiries through this link attribute the client to your roster and accrue your {((affiliate.commissionRate || 0.2) * 100).toFixed(0)}% honorarium.
                </p>
              </div>

              {/* Commission Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#FCFBF9] rounded-2xl border border-[#E8E2D8]">
                  <span className="text-[#64748B]">Accumulated Honoraria</span>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1 font-mono">
                    ${earnedHonoraria.toLocaleString()} USD
                  </div>
                  <span className="text-[11px] text-emerald-700">From completed consultations</span>
                </div>

                <div className="p-4 bg-[#FCFBF9] rounded-2xl border border-[#E8E2D8]">
                  <span className="text-[#64748B]">Disbursed Payouts</span>
                  <div className="text-2xl font-serif font-bold text-emerald-700 mt-1 font-mono">
                    ${totalPaidOut.toLocaleString()} USD
                  </div>
                  <span className="text-[11px] text-[#78716C]">{payouts.length} Settled disbursements</span>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 text-xs">
                  <span className="text-amber-900 font-semibold">Pending Next Disbursement</span>
                  <div className="text-2xl font-serif font-bold text-amber-900 mt-1 font-mono">
                    ${pendingPayout.toLocaleString()} USD
                  </div>
                  <span className="text-[11px] text-amber-700">Processed bi-monthly by Admin</span>
                </div>
              </div>

              {/* Verified Payouts History Ledger */}
              <div className="space-y-3 pt-4 border-t border-[#E8E2D8]">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-[#0F172A]">
                    My Payout & Disbursement Records
                  </h4>
                  <span className="text-xs text-[#64748B] font-mono">
                    Preferred: {affiliate.payoutMethodPreference?.toUpperCase() || 'WISE'}
                  </span>
                </div>

                {payouts.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] text-center text-xs text-[#78716C]">
                    No disbursements logged yet. Once Admin executes a payout, transaction receipts will appear here in real time.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#E8E2D8] text-[#78716C] uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-3">Date</th>
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

                            <td className="py-3 px-3 font-mono font-bold text-emerald-800 text-sm">
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
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono uppercase font-bold">
                                ✓ {p.status}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-[#526071] text-[11px]">
                              {p.notes || 'Consultation honoraria'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
