import { Hero } from '@/components/Hero';
import { SocialProof } from '@/components/SocialProof';
import { Problem } from '@/components/Problem';
import { Solution } from '@/components/Solution';
import { HowItWorks } from '@/components/HowItWorks';
import { Features } from '@/components/Features';
import { UseCases } from '@/components/UseCases';
import { Comparison } from '@/components/Comparison';
import { Testimonials } from '@/components/Testimonials';
import { PricingTeaser } from '@/components/PricingTeaser';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/FinalCta';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <SocialProof />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <UseCases />
      <Comparison />
      <Testimonials />
      <PricingTeaser />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
