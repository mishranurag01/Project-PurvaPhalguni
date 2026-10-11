import React, { useState } from 'react';
import { PracticeProvider, usePractice } from './context/PracticeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DevRolePreview } from './components/common/DevRolePreview';
import { SignInModal } from './components/public/SignInModal';
import { PublicHeader } from './components/public/PublicHeader';
import { HeroSection } from './components/public/HeroSection';
import { ObservatorySystemSection } from './components/public/ObservatorySystemSection';
import { AboutSection } from './components/public/AboutSection';
import { ServicesSection } from './components/public/ServicesSection';
import { HowItWorksSection } from './components/public/HowItWorksSection';
import { ReviewsSection } from './components/public/ReviewsSection';
import { FaqSection } from './components/public/FaqSection';
import { PublicFooter } from './components/public/PublicFooter';
import { ServicesPage } from './components/public/ServicesPage';
import { AboutPage } from './components/public/AboutPage';
import { BookingWizard } from './components/public/BookingWizard';
import { ClientPortal } from './components/client/ClientPortal';
import { AffiliatePortal } from './components/affiliate/AffiliatePortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { CursorSpotlight } from './components/CursorSpotlight';
import { CelestialBackdrop } from './components/CelestialOrb';
import { IntroSequence } from './components/intro/IntroSequence';
import { ServicePlan, UserRole } from './types/practice';

function MainSanctuaryLayout() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInRoleChoice, setSignInRoleChoice] = useState<'client' | 'affiliate' | 'admin'>('client');

  const {
    currentRole,
    currentUser,
    publicTab,
    settings,
    services,
    users,
    reviews,
    preselectedService,
    reducedMotion,
    setRole,
    setPublicTab,
    selectServiceForBooking,
    updateSettings
  } = usePractice();

  const handleBookService = (service: ServicePlan) => {
    selectServiceForBooking(service);
  };

  // Derive users for portals safely
  const currentClient = users.find((u) => u.id === 'user-client-1') || users[3];
  const currentAffiliate = users.find((u) => u.id === 'user-affiliate-1') || users[1];
  const currentAdmin = users.find((u) => u.id === 'user-admin-1') || users[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] relative selection:bg-[#EBDAB5] selection:text-[#0F172A]">
      {/* Soft Ambient Cursor Spotlight */}
      <CursorSpotlight reducedMotion={reducedMotion} />

      {/* Subtle Celestial Geometry Backdrop */}
      <CelestialBackdrop reducedMotion={reducedMotion} />

      {/* 1. PUBLIC WEBSITE EXPERIENCE */}
      {currentRole === 'public' && (
        <div className="relative z-10 flex flex-col min-h-screen">
          <PublicHeader
            settings={settings}
            activeTab={publicTab}
            onNavigate={(tab) => setPublicTab(tab)}
            onOpenSignIn={() => {
              setSignInRoleChoice('client');
              setIsSignInOpen(true);
            }}
            onReplayIntro={() => setShowIntro(true)}
            reducedMotion={reducedMotion}
          />

          <main className="flex-1 animate-fade-in-up" key={publicTab}>
            {/* PUBLIC HOME PAGE SCROLL SEQUENCE */}
            {publicTab === 'home' && (
              <>
                {/* 1. Hero Section */}
                <HeroSection
                  settings={settings}
                  onBookClick={() => setPublicTab('booking')}
                  onExploreServices={() => {
                    const el = document.getElementById('observatory');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      setPublicTab('services');
                    }
                  }}
                  onReplayIntro={() => setShowIntro(true)}
                  reducedMotion={reducedMotion}
                />

                {/* 2. Observatory Instruments & Systems */}
                <ObservatorySystemSection
                  onEnterObservatory={() => setPublicTab('booking')}
                  reducedMotion={reducedMotion}
                />

                {/* 3. Curated Consultation Plans (M+A, M+C, M+A+C) */}
                <ServicesSection
                  services={services}
                  onBookService={handleBookService}
                  reducedMotion={reducedMotion}
                />

                {/* 4. How It Works */}
                <HowItWorksSection />

                {/* 5. Client Reviews */}
                <ReviewsSection reviews={reviews} />

                {/* 6. FAQ */}
                <FaqSection />
              </>
            )}

            {/* SERVICES PAGE */}
            {publicTab === 'services' && (
              <ServicesPage
                services={services}
                settings={settings}
                onBookService={handleBookService}
                reducedMotion={reducedMotion}
              />
            )}

            {/* ABOUT PAGE */}
            {publicTab === 'about' && (
              <AboutPage settings={settings} />
            )}

            {/* BOOKING PAGE / WIZARD (9 Steps) */}
            {publicTab === 'booking' && (
              <BookingWizard
                services={services}
                practitioners={users.filter((u) => u.role === 'affiliate')}
                settings={settings}
                preselectedService={preselectedService}
                onBookingCompleted={() => {
                  // Handled via PracticeStore listener
                }}
                onCancel={() => setPublicTab('home')}
                reducedMotion={reducedMotion}
              />
            )}
          </main>

          {/* 7. Footer */}
          <PublicFooter
            settings={settings}
            onOpenSignIn={() => {
              setSignInRoleChoice('client');
              setIsSignInOpen(true);
            }}
            onNavigate={(tab) => setPublicTab(tab)}
          />
        </div>
      )}

      {/* 2. CLIENT PORTAL */}
      {currentRole === 'client' && (
        <div className="relative z-10">
          <ClientPortal
            client={currentClient}
            settings={settings}
            onExitPortal={() => setRole('public')}
            reducedMotion={reducedMotion}
          />
        </div>
      )}

      {/* 3. AFFILIATE (PRACTITIONER) PORTAL */}
      {currentRole === 'affiliate' && (
        <div className="relative z-10">
          <AffiliatePortal
            affiliate={currentAffiliate}
            settings={settings}
            onExitPortal={() => setRole('public')}
            reducedMotion={reducedMotion}
          />
        </div>
      )}

      {/* 4. ADMIN PORTAL */}
      {currentRole === 'admin' && (
        <div className="relative z-10">
          <AdminPortal
            admin={currentAdmin}
            settings={settings}
            onUpdateSettings={updateSettings}
            onExitPortal={() => setRole('public')}
            reducedMotion={reducedMotion}
          />
        </div>
      )}

      {/* Demonstration Authentication Screen */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        initialRoleChoice={signInRoleChoice}
        onSuccess={(role: UserRole) => {
          setRole(role);
        }}
      />

      {/* Fixed bottom-corner development-only role preview switcher */}
      <DevRolePreview
        currentRole={currentRole}
        onRoleChange={setRole}
      />

      {/* Cinematic Celestial Ignition Opening Sequence */}
      {showIntro && (
        <IntroSequence
          onComplete={() => setShowIntro(false)}
          reducedMotion={reducedMotion}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary context="Purva Phalguni Application Root">
      <PracticeProvider>
        <MainSanctuaryLayout />
      </PracticeProvider>
    </ErrorBoundary>
  );
}
