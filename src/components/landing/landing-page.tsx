'use client';

import React from 'react';

import CTA from './cta';
import FAQ from './faq';
import Hero from './hero';
import Metrics from './metrics';
import Pricing from './pricing';
import Testimonials from './testimonials';
import WhyWingman from './why-wingman';

export default function LandingPage() {
  return (
    <div className='relative min-h-screen overflow-hidden'>
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Metrics Section */}
        <Metrics />

        {/* Why Wingman Section */}
        <WhyWingman />

        {/* Pricing Section */}
        <Pricing />

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <CTA />
      </main>
    </div>
  );
}
