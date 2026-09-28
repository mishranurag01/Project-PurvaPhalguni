import React, { useState, useEffect } from 'react';
import { UserRole, WebsiteSettings, ServicePlan, UserProfile } from './types/practice';
import { PracticeStore } from './services/store';
import { DevRolePreview } from './components/common/DevRolePreview';
import { SignInModal } from './components/public/SignInModal';
import { PublicHeader } from './components/public/PublicHeader';
import { HeroSection } from './components/public/HeroSection';
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

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => PracticeStore.getActiveRole());
  const [publicTab, setPublicTab] = useState<'home' | 'services' | 'about' | 'booking'>('home');
  const [settings, setSettings] = useState<WebsiteSettings>(() => PracticeStore.getSettings());
  const [services, setServices] = useState<ServicePlan[]>(() => PracticeStore.getServices());
  const [users, setUsers] = useState<UserProfile[]>(() => PracticeStore.getUsers());
  const [reviews, setReviews] = useState(() => PracticeStore.getReviews());
  const [preselectedService, setPreselectedService] = useState<ServicePlan | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInRoleChoice, setSignInRoleChoice] = useState<'client' | 'affiliate' | 'admin'>('client');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setReducedMotion(true);
      }
    }

    const unsubscribe = PracticeStore.subscribe(() => {
      setUsers(PracticeStore.getUsers());
      setSettings(PracticeStore.getSettings());
      setServices(PracticeStore.getServices());
      setReviews(PracticeStore.getReviews());
    });
    return () => unsubscribe();
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
  };

  const handleBookService = (service: ServicePlan) => {
    setPreselectedService(service);
    setPublicTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active users for portals
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
            onNavigate={(tab) => {
              setPublicTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSignIn={() => {
              setSignInRoleChoice('client');
              setIsSignInOpen(true);
            }}
            reducedMotion={reducedMotion}
          />

          <main className="flex-1">
            {/* PUBLIC HOME PAGE SCROLL SEQUENCE */}
            {publicTab === 'home' && (
              <>
                {/* 1. Hero Section */}
                <HeroSection
                  settings={settings}
                  onBookClick={() => {
                    setPublicTab('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onExploreServices={() => {
                    setPublicTab('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  reducedMotion={reducedMotion}
                />

                {/* 2. About the Practice */}
                <AboutSection
                  settings={settings}
                  onReadMore={() => {
                    setPublicTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />

                {/* 3. Services and Plans (M+A, M+C, M+A+C) */}
                <ServicesSection
                  services={services}
                  onBookService={handleBookService}
                  reducedMotion={reducedMotion}
                />

                {/* 4. How It Works (5 Steps) */}
                <HowItWorksSection />

                {/* 5. Client Reviews (Approved only, no medical claims) */}
                <ReviewsSection reviews={reviews} />

                {/* 6. FAQ (5 Key Questions) */}
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
                  // After booking, refresh bookings
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
            onNavigate={(tab) => {
              setPublicTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* 2. CLIENT PORTAL */}
      {currentRole === 'client' && (
        <div className="relative z-10">
          <ClientPortal
            client={currentClient}
            settings={settings}
            onExitPortal={() => setCurrentRole('public')}
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
            onExitPortal={() => setCurrentRole('public')}
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
            onUpdateSettings={(newSettings) => setSettings(newSettings)}
            onExitPortal={() => setCurrentRole('public')}
            reducedMotion={reducedMotion}
          />
        </div>
      )}

      {/* Demonstration Authentication Screen (Modal with Client / Affiliate / Admin choices) */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        initialRoleChoice={signInRoleChoice}
        onSuccess={(role) => {
          handleRoleChange(role);
        }}
      />

      {/* Fixed bottom-corner development-only role preview switcher (active only when VITE_DEMO_MODE=true) */}
      <DevRolePreview
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
}
