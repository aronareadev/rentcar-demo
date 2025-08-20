'use client';

import { ThemeLayout } from '@/components/layout/ThemeLayout';
import { HeroSection } from '@/components/layout/HeroSection';
import { FeaturesSection } from '@/components/layout/FeaturesSection';
import { VehicleSection } from '@/components/layout/VehicleSection';
import { ReviewSection } from '@/components/layout/ReviewSection';
import { ConsultationBanner } from '@/components/layout/ConsultationBanner';
import { ContactSection } from '@/components/layout/ContactSection';

export default function Home() {
  return (
    <ThemeLayout>
      <HeroSection />
      <FeaturesSection />
      <VehicleSection />
      <ReviewSection />
      <ConsultationBanner />
      <ContactSection />
    </ThemeLayout>
  );
}
