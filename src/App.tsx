import React, { useState, useEffect } from 'react';
import { PracticeProvider, usePractice } from './context/PracticeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DevRolePreview } from './components/common/DevRolePreview';
import { UnifiedLoginPage } from './components/auth/UnifiedLoginPage';
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
import { NotAuthenticated } from './components/common/NotAuthenticated';
import { PermissionDenied } from './components/common/PermissionDenied';
import { CursorSpotlight } from './components/CursorSpotlight';
import { CelestialBackdrop } from './components/CelestialOrb';
import { IntroSequence } from './components/intro/IntroSequence';
import { ServicePlan } from './types/practice';

function MainSanctuaryLayout() {
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const {
    currentRole,
    currentUser,
    currentRoute,
    publicTab,
    settings,
    services,
    users,
    reviews,
    preselectedService,
    reducedMotion,
    navigateTo,
    setRole,
    signOut,
    setPublicTab,
    selectServiceForBooking,
    updateSettings
  } = usePractice();

  // If authenticated user visits /login, redirect automatically to their portal
  useEffect(() => {
    if (currentRoute === '/login' && currentUser && currentRole !== 'public') {
      if (currentRole === 'client') navigateTo('/client');
      else if (currentRole === 'affiliate') navigateTo('/affiliate');
      else if (currentRole === 'admin') navigateTo('/admin');
    }
  }, [currentRoute, currentUser, currentRole, navigateTo]);

  const handleBookService = (service: ServicePlan) => {
    selectServiceForBooking(service);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] relative selection:bg-[#EBDAB5] selection:text-[#0F172A]">
      {/* Soft Ambient Cursor Spotlight */}
      <CursorSpotlight reducedMotion={reducedMotion} />

      {/* Subtle Celestial Geometry Backdrop */}
      <CelestialBackdrop reducedMotion={reducedMotion} />

      {/* 1. UNIFIED LOGIN ROUTE (/login) */}
      {currentRoute === '/login' && (
        <div className="relative z-10 flex flex-col min-h-screen">
          <PublicHeader
            settings={settings}
            activeTab={publicTab}
            onNavigate={(tab) => {
              navigateTo('/');
              setPublicTab(tab);
            }}
            onOpenSignIn={() => navigateTo('/login')}
            onReplayIntro={() => setShowIntro(true)}
            reducedMotion={reducedMotion}
          />
          <main className="flex-1 flex items-center justify-center p-4">
            <UnifiedLoginPage
              onSuccessRedirect={(role) => {
                if (role === 'admin') navigateTo('/admin');
                else if (role === 'affiliate') navigateTo('/affiliate');
                else navigateTo('/client');
              }}
              onCancel={() => navigateTo('/')}
            />
          </main>
          <PublicFooter
            settings={settings}
            onOpenSignIn={() => navigateTo('/login')}
            onNavigate={(tab) => {
              navigateTo('/');
              setPublicTab(tab);
            }}
          />
        </div>
      )}

      {/* 2. PUBLIC WEBSITE EXPERIENCE (/) */}
      {currentRoute === '/' && (
        <div className="relative z-10 flex flex-col min-h-screen">
          <PublicHeader
            settings={settings}
            activeTab={publicTab}
            onNavigate={(tab) => setPublicTab(tab)}
            onOpenSignIn={() => navigateTo('/login')}
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

            {/* BOOKING PAGE / WIZARD */}
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

          {/* Footer */}
          <PublicFooter
            settings={settings}
            onOpenSignIn={() => navigateTo('/login')}
            onNavigate={(tab) => setPublicTab(tab)}
          />
        </div>
      )}

      {/* 3. CLIENT PORTAL DESTINATION ROUTE (/client) — Identity-based authorization */}
      {currentRoute === '/client' && (
        <div className="relative z-10">
          {currentUser && currentUser.role === 'client' ? (
            currentUser.activeStatus === 'deactivated' || currentUser.activeStatus === 'suspended' ? (
              <PermissionDenied
                requiredRoleName="Active Clients"
                customMessage="Your client account is currently suspended or deactivated. Please contact the sanctuary administration."
                onReturnHome={() => signOut()}
                onSwitchAccount={() => navigateTo('/login')}
              />
            ) : (
              <ClientPortal
                client={currentUser}
                settings={settings}
                onExitPortal={() => signOut()}
                reducedMotion={reducedMotion}
              />
            )
          ) : currentUser && currentUser.role !== 'client' ? (
            <PermissionDenied
              requiredRoleName="Active Clients"
              customMessage="This sanctuary section is reserved for clients. You are currently authenticated with a different role."
              onReturnHome={() => navigateTo('/')}
              onSwitchAccount={() => navigateTo('/login')}
            />
          ) : (
            <NotAuthenticated
              requiredPortalName="Client Health Portal"
              onSignIn={() => navigateTo('/login')}
              onReturnHome={() => navigateTo('/')}
            />
          )}
        </div>
      )}

      {/* 4. AFFILIATE PRACTITIONER PORTAL DESTINATION ROUTE (/affiliate) — Identity-based authorization */}
      {currentRoute === '/affiliate' && (
        <div className="relative z-10">
          {currentUser && currentUser.role === 'affiliate' ? (
            currentUser.activeStatus === 'deactivated' || currentUser.activeStatus === 'suspended' ? (
              <PermissionDenied
                requiredRoleName="Active Practitioners"
                customMessage={`This affiliate practitioner account is currently ${currentUser.activeStatus}. Protected clinical folio and client chart tools are restricted.`}
                onReturnHome={() => signOut()}
                onSwitchAccount={() => navigateTo('/login')}
              />
            ) : (
              <AffiliatePortal
                affiliate={currentUser}
                settings={settings}
                onExitPortal={() => signOut()}
                reducedMotion={reducedMotion}
              />
            )
          ) : currentUser && currentUser.role !== 'affiliate' ? (
            <PermissionDenied
              requiredRoleName="Active Practitioners"
              customMessage="This clinical desk is reserved for affiliated practitioner partners. You do not have practitioner privileges."
              onReturnHome={() => navigateTo('/')}
              onSwitchAccount={() => navigateTo('/login')}
            />
          ) : (
            <NotAuthenticated
              requiredPortalName="Affiliate Practitioner Desk"
              onSignIn={() => navigateTo('/login')}
              onReturnHome={() => navigateTo('/')}
            />
          )}
        </div>
      )}

      {/* 5. ADMIN PORTAL DESTINATION ROUTE (/admin) — Identity-based authorization */}
      {currentRoute === '/admin' && (
        <div className="relative z-10">
          {currentUser && currentUser.role === 'admin' ? (
            <AdminPortal
              admin={currentUser}
              settings={settings}
              onUpdateSettings={updateSettings}
              onExitPortal={() => signOut()}
              reducedMotion={reducedMotion}
            />
          ) : currentUser && currentUser.role !== 'admin' ? (
            <PermissionDenied
              requiredRoleName="Practice Administrators"
              customMessage="Only verified practice administrators with an active administrative session have permission to access the Executive Admin Suite."
              onReturnHome={() => navigateTo('/')}
              onSwitchAccount={() => navigateTo('/login')}
            />
          ) : (
            <NotAuthenticated
              requiredPortalName="Executive Admin Suite"
              onSignIn={() => navigateTo('/login')}
              onReturnHome={() => navigateTo('/')}
            />
          )}
        </div>
      )}

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
