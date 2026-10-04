import React, { useState, useEffect } from 'react';
import { UserProfile, BookingSession, ReadingSummary, DirectMessage, WebsiteSettings, ServicePlan } from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { MagneticButton } from '../MagneticButton';
import {
  Calendar,
  User,
  MessageSquare,
  FileText,
  Shield,
  Clock,
  Sparkles,
  Send,
  Download,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  XCircle,
  LogOut,
  MapPin,
  HeartPulse,
  Radio
} from 'lucide-react';
import { soundSynth } from '../../utils/soundAmbience';
import { NotAuthenticated } from '../common/NotAuthenticated';

interface ClientPortalProps {
  client: UserProfile;
  settings: WebsiteSettings;
  onExitPortal: () => void;
  reducedMotion?: boolean;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  client: initialClient,
  settings,
  onExitPortal,
  reducedMotion = false
}) => {
  if (!initialClient) {
    return (
      <NotAuthenticated
        requiredPortalName="Client Sanctuary"
        onSignIn={onExitPortal}
        onReturnHome={onExitPortal}
      />
    );
  }

  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'bookings' | 'messages' | 'summaries' | 'consent'>('dashboard');
  const [client, setClient] = useState<UserProfile>(initialClient);
  const [bookings, setBookings] = useState<BookingSession[]>([]);
  const [summaries, setSummaries] = useState<ReadingSummary[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [services, setServices] = useState<ServicePlan[]>(() => PracticeStore.getServices());
  const [rateUpdateBanner, setRateUpdateBanner] = useState<string | null>(null);

  // Editable Profile State
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone || '');
  const [birthDate, setBirthDate] = useState(client.birthDate || '');
  const [birthTime, setBirthTime] = useState(client.birthTime || '');
  const [birthCity, setBirthCity] = useState(client.birthCity || '');
  const [primaryIntention, setPrimaryIntention] = useState(client.primaryIntention || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Consent & Privacy state
  const [consentActive, setConsentActive] = useState(client.consentGiven && !client.consentWithdrawn);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [deletionConfirmed, setDeletionConfirmed] = useState(false);

  const assignedAffiliate =
    PracticeStore.getUsers().find((u) => u.id === client.assignedAffiliateId) ||
    PracticeStore.getUsers().find((u) => u.role === 'affiliate');

  useEffect(() => {
    // Load fresh data
    const allBookings = PracticeStore.getBookings().filter((b) => b.clientId === client.id);
    const allSummaries = PracticeStore.getSummaries().filter(
      (s) => s.clientId === client.id && s.isSharedWithClient
    );
    const allMessages = PracticeStore.getMessages().filter(
      (m) => m.senderId === client.id || m.recipientId === client.id
    );

    setBookings(allBookings);
    setSummaries(allSummaries);
    setMessages(allMessages);
    setServices(PracticeStore.getServices());

    // Register event listener for real-time SERVICES_UPDATED events
    const unsubServices = PracticeStore.addEventListener('SERVICES_UPDATED', (e) => {
      const freshServices = PracticeStore.getServices();
      setServices(freshServices);
      const updatedSvc = e.payload?.updatedService;
      if (updatedSvc) {
        setRateUpdateBanner(`Practice Rate Update: "${updatedSvc.name}" updated to ${updatedSvc.duration} ($${updatedSvc.price} USD).`);
      } else {
        setRateUpdateBanner('Practice Rate Update: Consultation catalog & durations updated in real time.');
      }
      setTimeout(() => setRateUpdateBanner(null), 6000);
    });

    // Register event listener for BOOKINGS_UPDATED
    const unsubBookings = PracticeStore.addEventListener('BOOKINGS_UPDATED', () => {
      setBookings(PracticeStore.getBookings().filter((b) => b.clientId === client.id));
    });

    return () => {
      unsubServices();
      unsubBookings();
    };
  }, [client.id]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundSynth.playSoftTap();

    const updatedClient: UserProfile = {
      ...client,
      name,
      phone,
      birthDate,
      birthTime,
      birthCity,
      primaryIntention
    };

    const allUsers = PracticeStore.getUsers().map((u) => (u.id === client.id ? updatedClient : u));
    PracticeStore.saveUsers(allUsers);
    setClient(updatedClient);

    PracticeStore.logAction(
      client.id,
      client.name,
      'client',
      'SETTINGS_CHANGED',
      'Client updated profile and birth coordinates.',
      true
    );

    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    soundSynth.playSoftTap();
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: client.id,
      senderName: client.name,
      senderRole: 'client',
      recipientId: client.assignedAffiliateId || 'user-affiliate-1',
      recipientName: assignedAffiliate?.name || 'Assigned Practitioner (Demo)',
      text: newMessageText.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updated = [...messages, newMsg];
    PracticeStore.saveMessages([...PracticeStore.getMessages(), newMsg]);
    setMessages(updated);
    setNewMessageText('');
  };

  const handleToggleConsent = () => {
    const nextState = !consentActive;
    setConsentActive(nextState);

    const updatedClient: UserProfile = {
      ...client,
      consentGiven: nextState,
      consentWithdrawn: !nextState
    };

    const allUsers = PracticeStore.getUsers().map((u) => (u.id === client.id ? updatedClient : u));
    PracticeStore.saveUsers(allUsers);
    setClient(updatedClient);

    PracticeStore.logAction(
      client.id,
      client.name,
      'client',
      'CONSENT_WITHDRAWN',
      nextState ? 'Client restored consent agreement.' : 'Client withdrew consent for chart generation.',
      true
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
    setBookings(updated);
    PracticeStore.saveBookings(
      PracticeStore.getBookings().map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
    soundSynth.playSoftTap();
  };

  const handleExportData = () => {
    const dataObj = {
      clientProfile: client,
      bookings,
      sharedSummaries: summaries,
      consentStatus: {
        active: consentActive,
        version: client.consentVersion,
        agreedDate: client.consentDate
      }
    };

    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Purva_Phalguni_ClientDossier_${client.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
            <span className="text-xs uppercase tracking-widest text-[#A87F32] font-semibold">
              Client Confidential Haven
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] mt-1">
            Welcome, {client.name}
          </h1>
          <p className="text-xs text-[#526071] mt-0.5">
            Your private repository for astrological consultation folios, message exchanges, and consent controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExitPortal}
            className="px-3 py-1.5 rounded-lg border border-[#E8E2D8] text-xs font-medium text-[#78716C] hover:text-[#0F172A] flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Portal</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar Tabs + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E8E2D8] p-3 shadow-xs space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'dashboard'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C59B4B]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'profile'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <User className="w-4 h-4 text-[#C59B4B]" />
            <span>My Profile & Birth Data</span>
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
            <span>My Bookings ({bookings.length})</span>
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
            onClick={() => setActiveTab('summaries')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'summaries'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#C59B4B]" />
            <span>Reading Summaries ({summaries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('consent')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all duration-200 transform cursor-pointer active:scale-95 ${
              activeTab === 'consent'
                ? 'bg-[#FAF3E3] text-[#0F172A] font-bold scale-[1.03] shadow-xs ring-1 ring-[#C59B4B]/40 translate-x-1'
                : 'text-[#64748B] hover:bg-[#FAF8F5] hover:text-[#0F172A] hover:scale-[1.015]'
            }`}
          >
            <Shield className="w-4 h-4 text-[#C59B4B]" />
            <span>Consent & Privacy</span>
          </button>
        </div>

        {/* Tab Content Panes with Smooth Entrance */}
        <div key={activeTab} className="lg:col-span-9 space-y-6 animate-fade-in-up">
          {/* Real-time Rate / Duration Update Alert */}
          {rateUpdateBanner && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span className="font-semibold">{rateUpdateBanner}</span>
              </div>
              <button
                onClick={() => setRateUpdateBanner(null)}
                className="text-amber-800 hover:text-black text-xs font-semibold px-2 py-0.5"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Upcoming Session Card */}
              {bookings.filter((b) => b.status === 'confirmed').length > 0 ? (
                <div className="bg-white rounded-3xl border border-[#C59B4B] p-6 sm:p-8 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs uppercase tracking-wider text-emerald-800 font-semibold">
                        Next Upcoming Session
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#78716C]">
                      {bookings.find((b) => b.status === 'confirmed')?.date}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-2xl font-serif font-bold text-[#0F172A]">
                      {bookings.find((b) => b.status === 'confirmed')?.serviceName}
                    </h3>
                    <p className="text-xs text-[#526071] mt-1">
                      Practitioner: <strong>{bookings.find((b) => b.status === 'confirmed')?.affiliateName}</strong> · Time: <strong>{bookings.find((b) => b.status === 'confirmed')?.timeSlot}</strong>
                    </p>
                    <p className="text-xs text-[#64748B] mt-2 italic">
                      "{bookings.find((b) => b.status === 'confirmed')?.clientIntention}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8E2D8] flex items-center justify-between">
                    <span className="text-[11px] text-[#78716C]">
                      Video link activates 10 minutes prior to session.
                    </span>
                    <a
                      href={bookings.find((b) => b.status === 'confirmed')?.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#0F172A] text-white rounded-lg text-xs font-medium hover:bg-[#1E293B]"
                    >
                      Enter Video Haven
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-[#E8E2D8] p-8 text-center">
                  <Calendar className="w-8 h-8 text-[#C59B4B] mx-auto mb-2 opacity-50" />
                  <h3 className="text-lg font-serif font-bold text-[#0F172A]">No Upcoming Sessions</h3>
                  <p className="text-xs text-[#526071] mt-1">
                    Ready to schedule your next reflective reading?
                  </p>
                </div>
              )}

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Assigned Practitioner</span>
                  <div className="text-base font-serif font-bold text-[#0F172A] mt-1">
                    {assignedAffiliate?.name || 'Demo Affiliate 1'}
                  </div>
                  <span className="text-[11px] text-[#A87F32]">
                    {assignedAffiliate?.specialty || 'Sidereal Astrological Consultant'}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Informed Consent</span>
                  <div className="text-base font-serif font-bold text-[#0F172A] mt-1">
                    {consentActive ? 'Active (v2.4)' : 'Withdrawn'}
                  </div>
                  <span className="text-[11px] text-emerald-700">Non-medical boundaries confirmed</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8]">
                  <span className="text-xs text-[#78716C]">Archived Summaries</span>
                  <div className="text-base font-serif font-bold text-[#0F172A] mt-1">
                    {summaries.length} Folios
                  </div>
                  <span className="text-[11px] text-[#78716C]">Temporary Demo Session</span>
                </div>
              </div>

              {/* Practice Consultation Schedule & Live Rates Card */}
              <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D8]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C59B4B]" />
                    <h4 className="text-lg font-serif font-bold text-[#0F172A]">
                      Sanctuary Consultation Schedule & Live Rates
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-mono text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-Time Practice Sync</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {services.filter((s) => s.isActive).map((s) => (
                    <div key={s.id} className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#A87F32] font-semibold">{s.code}</span>
                        <span className="font-serif font-bold text-sm text-[#0F172A]">${s.price} USD</span>
                      </div>
                      <h5 className="font-serif font-bold text-xs text-[#0F172A]">{s.name}</h5>
                      <div className="text-[11px] text-[#526071] flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#C59B4B]" />
                        <span>Session Duration: {s.duration}</span>
                      </div>
                      <p className="text-[10px] text-[#78716C] line-clamp-2">{s.shortDesc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & BIRTH DATA */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#0F172A] pb-3 border-b border-[#E8E2D8]">
                Personal Coordinates & Contact Profile
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Your birth details are held in temporary browser memory and utilized strictly by your assigned practitioner for sidereal calculations.
              </p>

              {profileSavedMsg && (
                <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile and birth coordinates updated for this session.</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Legal Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Birth Date (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Exact Minute of Birth (24h)
                    </label>
                    <input
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Birth City & Country
                    </label>
                    <input
                      type="text"
                      value={birthCity}
                      onChange={(e) => setBirthCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-[#0F172A] mb-1 text-[10px]">
                      Primary Reflective Intention
                    </label>
                    <textarea
                      rows={3}
                      value={primaryIntention}
                      onChange={(e) => setPrimaryIntention(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                    />
                  </div>
                </div>

                <div className="pt-4 text-right">
                  <MagneticButton type="submit" variant="primary" reducedMotion={reducedMotion}>
                    <span>Save Changes</span>
                  </MagneticButton>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#0F172A] pb-3 border-b border-[#E8E2D8]">
                Your Scheduled & Completed Sessions
              </h3>

              <div className="space-y-4">
                {bookings.map((b) => {
                  const svc = services.find((s) => s.id === b.serviceId || s.name === b.serviceName);
                  return (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#0F172A]">
                            {b.serviceName}
                          </span>
                          <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : b.status === 'completed'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#526071] mt-1">
                          Practitioner: {b.affiliateName} · {b.date} at {b.timeSlot}
                        </div>
                        <div className="text-[11px] text-[#A87F32] mt-0.5 font-medium flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>Standard Duration: {svc?.duration || '60 min'}</span>
                          <span>·</span>
                          <span>Current Practice Rate: ${svc?.price || b.amount} USD</span>
                        </div>
                        <p className="text-[11px] text-[#78716C] mt-1 italic">
                          "{b.clientIntention}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium"
                          >
                            Cancel / Reschedule
                          </button>
                        )}
                        <span className="font-serif font-bold text-base text-[#0F172A]">
                          ${b.amount} USD
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Consultation Rate Schedule Reference */}
              <div className="pt-6 border-t border-[#E8E2D8] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#0F172A]">
                    Practice Rate Schedule & Consultation Durations
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-time Synced</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {services.filter((s) => s.isActive).map((s) => (
                    <div key={s.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-xs space-y-1">
                      <div className="font-bold text-[#0F172A]">{s.name}</div>
                      <div className="text-[#64748B] flex items-center justify-between text-[11px]">
                        <span>{s.duration}</span>
                        <span className="font-mono font-bold text-[#0F172A]">${s.price} USD</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm flex flex-col h-[520px]">
              <div className="pb-3 border-b border-[#E8E2D8] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0F172A]">
                    Private Practitioner Exchange
                  </h3>
                  <p className="text-[11px] text-[#78716C]">
                    Prototype message view — server messaging not connected.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Confidential
                </span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const isMine = m.senderId === client.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMine
                            ? 'bg-[#0F172A] text-white rounded-tr-xs'
                            : 'bg-[#FAF8F5] border border-[#E8E2D8] text-[#0F172A] rounded-tl-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-[#94A3B8] mt-1 font-mono">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Send Form */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#E8E2D8] flex gap-2">
                <input
                  type="text"
                  placeholder="Share a reflection or post-session question..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs focus:outline-none focus:border-[#C59B4B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-medium hover:bg-[#1E293B] flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: READING SUMMARIES */}
          {activeTab === 'summaries' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#0F172A] pb-3 border-b border-[#E8E2D8]">
                Reading Summaries & Homework Folios
              </h3>
              <p className="text-xs text-[#64748B]">
                Only folios explicitly finalized and shared by your practitioner appear in this private sanctuary archive.
              </p>

              {summaries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#78716C] bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8]">
                  No reading summaries have been shared yet. Summaries are delivered following completed consultations.
                </div>
              ) : (
                <div className="space-y-6">
                  {summaries.map((s) => (
                    <div key={s.id} className="p-6 rounded-2xl bg-[#FCFBF9] border border-[#E8E2D8] space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]/60">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#A87F32] font-semibold">
                            Practitioner Folio · {s.authorName}
                          </span>
                          <h4 className="text-lg font-serif font-bold text-[#0F172A] mt-0.5">
                            {s.title}
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-[#78716C]">
                          {s.sharedAt?.slice(0, 10)}
                        </span>
                      </div>

                      <div className="space-y-3 text-xs text-[#526071] leading-relaxed">
                        <div>
                          <strong className="text-[#0F172A] block uppercase text-[10px] mb-1">
                            Core Astrological Chronos:
                          </strong>
                          <p className="bg-white p-3 rounded-xl border border-[#E8E2D8]">
                            {s.coreAstrologicalFocus}
                          </p>
                        </div>

                        <div>
                          <strong className="text-[#0F172A] block uppercase text-[10px] mb-1">
                            Cartomantic Spread Observations:
                          </strong>
                          <p className="bg-white p-3 rounded-xl border border-[#E8E2D8] whitespace-pre-wrap">
                            {s.cartomancySpreads}
                          </p>
                        </div>

                        <div>
                          <strong className="text-[#0F172A] block uppercase text-[10px] mb-1">
                            Somatic Pacing & Reflective Insights:
                          </strong>
                          <p className="bg-white p-3 rounded-xl border border-[#E8E2D8]">
                            {s.reflectiveInsights}
                          </p>
                        </div>

                        <div>
                          <strong className="text-[#0F172A] block uppercase text-[10px] mb-1">
                            Suggested Contemplative Inquiries:
                          </strong>
                          <ul className="list-disc pl-4 space-y-1">
                            {s.suggestedContemplations.map((c, idx) => (
                              <li key={idx}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CONSENT & PRIVACY SETTINGS */}
          {activeTab === 'consent' && (
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#0F172A] pb-3 border-b border-[#E8E2D8]">
                Consent Controls & Data Sovereignty
              </h3>

              {/* Consent Status Switch */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#0F172A]">
                    Astrological Chart Calculation Consent
                  </h4>
                  <p className="text-xs text-[#526071] mt-1 max-w-md">
                    Authorizes your assigned practitioner to calculate your Sidereal Lahiri Kundali via the local astrological engine (external JHora provider not connected). You can revoke this permission at any moment.
                  </p>
                  <span className="text-[10px] font-mono text-[#78716C] mt-2 block">
                    Consent Version: {client.consentVersion} · Agreed: {client.consentDate}
                  </span>
                </div>

                <button
                  onClick={handleToggleConsent}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                    consentActive
                      ? 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {consentActive ? 'Withdraw Consent' : 'Grant Consent'}
                </button>
              </div>

              {/* Non-Medical Notice Banner */}
              <div className="p-4 rounded-xl bg-[#FAF3E3] border border-[#EBDAB5] text-xs text-[#7A5B20] flex items-start gap-3">
                <HeartPulse className="w-4 h-4 text-[#C59B4B] shrink-0 mt-0.5" />
                <p>{settings.requiredDisclaimer}</p>
              </div>

              {/* Data Export & Account Deletion Actions */}
              <div className="pt-4 border-t border-[#E8E2D8] flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-white border border-[#E8E2D8] hover:border-[#C59B4B] text-[#0F172A] rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download My Complete Record (.json)</span>
                </button>

                <button
                  onClick={() => setShowDeletionModal(true)}
                  className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Request Account Deletion</span>
                </button>
              </div>

              {/* Deletion Modal */}
              {showDeletionModal && (
                <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#E8E2D8] shadow-2xl text-xs space-y-4">
                    <div className="flex items-center gap-2 text-red-600 font-serif font-bold text-lg">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Confirm Complete Data Deletion</span>
                    </div>
                    <p className="text-[#526071] leading-relaxed">
                      This action will permanently purge your birth records, session notes, and archived summaries in accordance with privacy laws. This cannot be undone.
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E2D8]">
                      <button
                        onClick={() => setShowDeletionModal(false)}
                        className="px-3.5 py-2 rounded-lg border border-[#E8E2D8] text-[#78716C]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowDeletionModal(false);
                          setDeletionConfirmed(true);
                          PracticeStore.logAction(
                            client.id,
                            client.name,
                            'client',
                            'SETTINGS_CHANGED',
                            'Client submitted complete account deletion request.',
                            true
                          );
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                      >
                        Confirm Deletion Request
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {deletionConfirmed && (
                <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs">
                  Your deletion request has been logged. An automated security purge will erase all birth records within 24 hours.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
