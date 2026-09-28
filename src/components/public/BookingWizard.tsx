import React, { useState } from 'react';
import { ServicePlan, UserProfile, BookingSession, WebsiteSettings } from '../../types/practice';
import { PracticeStore } from '../../services/store';
import { MagneticButton } from '../MagneticButton';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CreditCard,
  Download,
  Mail,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  HeartPulse,
  MapPin,
  Lock,
  AlertCircle
} from 'lucide-react';
import { soundSynth } from '../../utils/soundAmbience';

interface BookingWizardProps {
  services: ServicePlan[];
  practitioners: UserProfile[];
  settings: WebsiteSettings;
  preselectedService?: ServicePlan | null;
  onBookingCompleted: (booking: BookingSession) => void;
  onCancel: () => void;
  reducedMotion?: boolean;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  services,
  practitioners,
  settings,
  preselectedService = null,
  onBookingCompleted,
  onCancel,
  reducedMotion = false
}) => {
  // Step 1 to 9
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<ServicePlan>(preselectedService || services[0]);
  const [selectedPractitioner, setSelectedPractitioner] = useState<UserProfile>(practitioners[0] || null);
  const [bookingDate, setBookingDate] = useState<string>('2026-10-18');
  const [bookingTime, setBookingTime] = useState<string>('14:00 GMT');

  // Account / Client info (Fictional Demo Defaults)
  const [clientName, setClientName] = useState<string>('Demo Client');
  const [clientEmail, setClientEmail] = useState<string>('demo.client@example.com');
  const [clientPhone, setClientPhone] = useState<string>('+1 (555) 010-0099');

  // Birth details (Fictional Demo Coordinates)
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [birthTime, setBirthTime] = useState<string>('12:00');
  const [birthCity, setBirthCity] = useState<string>('Example City');
  const [birthLat, setBirthLat] = useState<number>(37.7749);
  const [birthLon, setBirthLon] = useState<number>(-122.4194);

  // Question/Intention
  const [clientIntention, setClientIntention] = useState<string>(
    'Inquiring into seasonal vitality rhythms and grounding my creative studio deliverables during autumn.'
  );

  // Consent
  const [consentAcknowledged, setConsentAcknowledged] = useState<boolean>(false);
  const [nonMedicalConfirmed, setNonMedicalConfirmed] = useState<boolean>(false);

  // Payment mock (Fictional Demo Placeholders)
  const [cardNumber, setCardNumber] = useState<string>('0000 0000 0000 0000');
  const [cardExp, setCardExp] = useState<string>('00/00');
  const [cardCvc, setCardCvc] = useState<string>('000');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Completed booking reference
  const [createdBooking, setCreatedBooking] = useState<BookingSession | null>(null);

  const availableTimeSlots = [
    '09:30 GMT (Morning Quiet)',
    '11:00 GMT (Solar Ascent)',
    '14:00 GMT (Midday Zenith)',
    '16:30 GMT (Twilight Pacing)',
    '19:00 GMT (Evening Haven)'
  ];

  const handleNext = () => {
    soundSynth.playSoftTap();
    setCurrentStep((prev) => Math.min(prev + 1, 9));
  };

  const handleBack = () => {
    soundSynth.playSoftTap();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    soundSynth.playCelestialChime();

    setTimeout(() => {
      const newBooking: BookingSession = {
        id: `book-${Date.now()}`,
        clientId: 'user-client-1',
        clientName,
        clientEmail,
        affiliateId: selectedPractitioner.id,
        affiliateName: selectedPractitioner.name,
        serviceId: selectedService.id,
        serviceCode: selectedService.code,
        serviceName: selectedService.name,
        date: bookingDate,
        timeSlot: bookingTime,
        status: 'confirmed',
        paymentStatus: 'paid',
        amount: selectedService.price,
        clientIntention,
        birthDetailsSnapshot: {
          date: birthDate,
          time: birthTime,
          city: birthCity,
          latitude: birthLat,
          longitude: birthLon
        },
        consentSnapshot: {
          agreedAt: new Date().toISOString(),
          version: 'v2.4',
          disclaimerAcknowledged: true
        },
        meetingUrl: `https://example.com/demo-sanctuary-room-${Date.now()}`,
        hasSummaryShared: false,
        createdAt: new Date().toISOString()
      };

      const existingBookings = PracticeStore.getBookings();
      PracticeStore.saveBookings([newBooking, ...existingBookings]);

      // Audit Log
      PracticeStore.logAction(
        'user-client-1',
        clientName,
        'client',
        'LOGIN',
        `Booked session ${selectedService.name} with ${selectedPractitioner.name} for ${bookingDate}.`,
        false
      );

      setCreatedBooking(newBooking);
      setIsProcessingPayment(false);
      setCurrentStep(9);
      onBookingCompleted(newBooking);
    }, 1200);
  };

  const handleDownloadCalendarIcs = () => {
    if (!createdBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${settings.brandName}//Medical Astrology Session//EN
BEGIN:VEVENT
SUMMARY:${createdBooking.serviceName} - ${settings.brandName}
DESCRIPTION:${createdBooking.clientIntention} \\nSanctuary Link: ${createdBooking.meetingUrl}
DTSTART:20261018T140000Z
DTEND:20261018T153000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Sanctuary_Reading_${createdBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Wizard Header Progress */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
              Reservation Flow
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A] mt-0.5">
              Book a Confidential Consultation
            </h2>
          </div>
          <div className="text-xs font-mono text-[#78716C] bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E8E2D8]">
            Step {currentStep} of 9
          </div>
        </div>

        {/* 9 Step Progress Bar */}
        <div className="mt-4 grid grid-cols-9 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep >= step ? 'bg-[#C59B4B]' : 'bg-[#E8E2D8]'
              }`}
            />
          ))}
        </div>

        {/* Prototype Warning Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span><strong>Prototype mode:</strong> do not enter real personal, birth, health, or payment information. All demo data is held in temporary memory.</span>
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-10 shadow-sm relative">
        {/* Step 1: Select Service */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              1. Select Your Reading Modality
            </h3>
            <p className="text-xs sm:text-sm text-[#526071]">
              Choose the depth of celestial chronobiology and cartomantic inquiry that serves your current inquiry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.filter(s => s.isActive).map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedService.id === s.id
                      ? 'bg-[#FAF3E3] border-[#C59B4B] ring-1 ring-[#C59B4B]'
                      : 'bg-[#FCFBF9] border-[#E8E2D8] hover:border-[#C59B4B]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#A87F32] font-semibold">{s.code}</span>
                    <span className="text-lg font-serif font-bold text-[#0F172A]">${s.price}</span>
                  </div>
                  <h4 className="text-base font-serif font-semibold text-[#0F172A] mt-2">{s.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-[#78716C] mt-2">
                    <Clock className="w-3 h-3 text-[#C59B4B]" />
                    <span>{s.duration}</span>
                  </div>
                  <p className="text-xs text-[#526071] mt-3 line-clamp-3 leading-relaxed">
                    {s.shortDesc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-end">
              <MagneticButton variant="primary" onClick={handleNext} reducedMotion={reducedMotion}>
                <span>Continue to Practitioner Selection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>
          </div>
        )}

        {/* Step 2: Select Practitioner */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              2. Select Assigned Practitioner
            </h3>
            <p className="text-xs sm:text-sm text-[#526071]">
              Our practitioners are bound by ethical non-diagnostic pledges and trained in Parashari Jyotish and Hermetic Cartomancy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practitioners.map((practitioner) => (
                <div
                  key={practitioner.id}
                  onClick={() => setSelectedPractitioner(practitioner)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    selectedPractitioner?.id === practitioner.id
                      ? 'bg-[#FAF3E3] border-[#C59B4B] ring-1 ring-[#C59B4B]'
                      : 'bg-[#FCFBF9] border-[#E8E2D8] hover:border-[#C59B4B]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center text-[#C59B4B]">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#0F172A]">
                        {practitioner.name}
                      </h4>
                      <p className="text-xs text-[#A87F32] font-medium">{practitioner.specialty}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#526071] mt-3 leading-relaxed">{practitioner.bio}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 flex items-center justify-between">
              <MagneticButton variant="ghost" onClick={handleBack} reducedMotion={reducedMotion}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </MagneticButton>
              <MagneticButton variant="primary" onClick={handleNext} reducedMotion={reducedMotion}>
                <span>Select Calendar Window</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              3. Select Date & Time Slot
            </h3>
            <p className="text-xs sm:text-sm text-[#526071]">
              Consultations are conducted in our private video sanctuary. Choose your preferred arrival time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-2 text-[10px]">
                  Preferred Calendar Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs font-mono focus:border-[#C59B4B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-2 text-[10px]">
                  Available Sanctuary Slot
                </label>
                <div className="space-y-2">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingTime(slot)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                        bookingTime === slot
                          ? 'bg-[#FAF3E3] border-[#C59B4B] font-semibold text-[#0F172A]'
                          : 'bg-[#FCFBF9] border-[#E8E2D8] hover:bg-white text-[#526071]'
                      }`}
                    >
                      <span>{slot}</span>
                      {bookingTime === slot && <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B4B]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <MagneticButton variant="ghost" onClick={handleBack} reducedMotion={reducedMotion}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </MagneticButton>
              <MagneticButton variant="primary" onClick={handleNext} reducedMotion={reducedMotion}>
                <span>Account & Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>
          </div>
        )}

        {/* Step 4: Account / Authentication */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              4. Create Your Account or Sign In
            </h3>
            <p className="text-xs sm:text-sm text-[#526071]">
              Your demonstration account will store temporary consultation summaries for this browser session.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                  Confidential Email
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                  Phone (Optional for SMS reminders)
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                  Portal Password
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <MagneticButton variant="ghost" onClick={handleBack} reducedMotion={reducedMotion}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </MagneticButton>
              <MagneticButton variant="primary" onClick={handleNext} reducedMotion={reducedMotion}>
                <span>Enter Birth Coordinates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>
          </div>
        )}

        {/* Step 5: Birth Details */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              5. Enter Exact Birth Coordinates
            </h3>
            <p className="text-xs sm:text-sm text-[#526071]">
              Required for Sidereal Lahiri astronomical ephemeris calculation. Please reference your birth certificate for exact minute.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                  Exact Minute of Birth (24h)
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                  City & Country of Birth
                </label>
                <input
                  type="text"
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] focus:outline-none focus:border-[#C59B4B]"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FCFBF9] border border-[#E8E2D8] text-xs text-[#64748B]">
              <strong className="text-[#0F172A]">Coordinate Resolution:</strong> {birthCity} ({birthLat.toFixed(2)}° N, {birthLon.toFixed(2)}° E). Timezone automatically aligned.
            </div>

            <div className="pt-6 flex items-center justify-between">
              <MagneticButton variant="ghost" onClick={handleBack} reducedMotion={reducedMotion}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </MagneticButton>
              <MagneticButton variant="primary" onClick={handleNext} reducedMotion={reducedMotion}>
                <span>Reading Intention</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>
          </div>
        )}

        {/* Step 6: Question or Intention */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              6. Your Question or Reflective Intention
            </h3>
            <p className="text-xs sm:text-sm text-[#526071]">
              What questions or life themes are asking for your attention? Please note: this is a spiritual inquiry, not a symptom diagnostic.
            </p>

            <textarea
              rows={5}
              value={clientIntention}
              onChange={(e) => setClientIntention(e.target.value)}
              placeholder="e.g. Exploring mental hypervigilance, creative pacing, or preparing for an upcoming vocational transition..."
              className="w-full p-4 rounded-2xl border border-[#E8E2D8] bg-[#FCFBF9] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#C59B4B] leading-relaxed"
            />

            <div className="pt-6 flex items-center justify-between">
              <MagneticButton variant="ghost" onClick={handleBack} reducedMotion={reducedMotion}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </MagneticButton>
              <MagneticButton variant="primary" onClick={handleNext} reducedMotion={reducedMotion}>
                <span>Review Ethical Consent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>
          </div>
        )}

        {/* Step 7: Review Consent */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              7. Informed Consent & Ethical Acknowledgment
            </h3>
            <p className="text-xs sm:text-sm text-[#526071]">
              Please review and check our ethical boundaries before proceeding to payment.
            </p>

            <div className="p-5 rounded-2xl bg-[#FAF3E3] border border-[#EBDAB5] text-xs text-[#7A5B20] leading-relaxed">
              <div className="flex items-center gap-2 font-bold mb-1">
                <HeartPulse className="w-4 h-4 text-[#C59B4B]" />
                <span>Mandatory Legal Policy:</span>
              </div>
              <p>{settings.requiredDisclaimer}</p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={nonMedicalConfirmed}
                  onChange={(e) => setNonMedicalConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-[#E8E2D8] text-[#C59B4B] focus:ring-[#C59B4B]"
                />
                <span>
                  I understand that this reading is for spiritual and educational reflection only and does not provide medical, diagnostic, or therapeutic advice.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={consentAcknowledged}
                  onChange={(e) => setConsentAcknowledged(e.target.checked)}
                  className="mt-0.5 rounded border-[#E8E2D8] text-[#C59B4B] focus:ring-[#C59B4B]"
                />
                <span>
                  I give consent for my birth details to be calculated via the Sidereal Lahiri astronomical engine and stored in my client sanctuary. I retain the right to withdraw consent at any time.
                </span>
              </label>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <MagneticButton variant="ghost" onClick={handleBack} reducedMotion={reducedMotion}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </MagneticButton>
              <MagneticButton
                variant="primary"
                onClick={handleNext}
                disabled={!consentAcknowledged || !nonMedicalConfirmed}
                className={!consentAcknowledged || !nonMedicalConfirmed ? 'opacity-50 cursor-not-allowed' : ''}
                reducedMotion={reducedMotion}
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </div>
          </div>
        )}

        {/* Step 8: Payment */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#0F172A]">
                  8. Complete Payment
                </h3>
                <p className="text-xs text-[#64748B]">Demonstration checkout — no real payment card is charged.</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#78716C]">Total Due:</span>
                <div className="text-2xl font-serif font-bold text-[#0F172A]">
                  ${selectedService.price} USD
                </div>
              </div>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D8] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Service:</span>
                <span className="font-semibold text-[#0F172A]">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Practitioner:</span>
                <span className="font-semibold text-[#0F172A]">{selectedPractitioner.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Date & Slot:</span>
                <span className="font-semibold text-[#0F172A]">{bookingDate} at {bookingTime}</span>
              </div>
            </div>

            {/* Mock Card Form */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-mono focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-mono focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#0F172A] mb-1 text-[10px]">
                    CVC Code
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FCFBF9] font-mono focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <MagneticButton variant="ghost" onClick={handleBack} reducedMotion={reducedMotion}>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </MagneticButton>
              <MagneticButton
                variant="gold"
                onClick={handleProcessPayment}
                disabled={isProcessingPayment}
                reducedMotion={reducedMotion}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isProcessingPayment ? 'Recording Demo Booking...' : `Complete Demo Booking ($${selectedService.price} USD)`}</span>
              </MagneticButton>
            </div>
          </div>
        )}

        {/* Step 9: Confirmation & Calendar Reminder */}
        {currentStep === 9 && createdBooking && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF3E3] border border-[#C59B4B] flex items-center justify-center text-[#C59B4B]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#C59B4B] font-semibold">
                Session Confirmed
              </span>
              <h3 className="text-3xl font-serif font-bold text-[#0F172A] mt-1">
                Your Sanctuary Reservation Is Confirmed
              </h3>
              <p className="text-xs sm:text-sm text-[#526071] mt-2 max-w-md mx-auto leading-relaxed">
                Confirmation receipt and calendar invitation dispatched to <strong>{createdBooking.clientEmail}</strong>.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8E2D8] text-left text-xs max-w-lg mx-auto space-y-2.5">
              <div className="flex justify-between border-b border-[#E8E2D8]/60 pb-2">
                <span className="text-[#64748B]">Booking Ref:</span>
                <span className="font-mono font-semibold text-[#0F172A]">{createdBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Service:</span>
                <span className="font-semibold text-[#0F172A]">{createdBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Practitioner:</span>
                <span className="font-semibold text-[#0F172A]">{createdBooking.affiliateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Date & Time:</span>
                <span className="font-semibold text-[#0F172A]">{createdBooking.date} at {createdBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8E2D8]/60">
                <span className="text-[#64748B]">Video Haven:</span>
                <span className="text-[#C59B4B] font-mono truncate max-w-xs">{createdBooking.meetingUrl}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <MagneticButton
                variant="secondary"
                onClick={handleDownloadCalendarIcs}
                reducedMotion={reducedMotion}
              >
                <Download className="w-3.5 h-3.5 text-[#C59B4B]" />
                <span>Add to Calendar (.ics)</span>
              </MagneticButton>

              <MagneticButton
                variant="primary"
                onClick={onCancel}
                reducedMotion={reducedMotion}
              >
                <span>Return to Sanctuary</span>
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
