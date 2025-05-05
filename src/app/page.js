import ParallaxBanner from "./components/Home/Banner/Banner";
import { StatsSection } from "./components/Home/Counts/Counts";
import EmailSubscription from "./components/Home/EmailSubscription/EmailSubscription";
import { PartnersSection } from "./components/Home/Partners/Partners";
import { TestimonialSlider } from "./components/Home/Testimonials/TestimonialSlider";
import { TopJobsSection } from "./components/Home/TopJobs/TopJobsSection";
import { WhatWeOffer } from "./components/Home/WeOffer/WeOffer";

export default function Home() {
  return (
    <main>
      <ParallaxBanner />
      <TopJobsSection />
      <StatsSection />
      <WhatWeOffer />
      <PartnersSection />
      <TestimonialSlider />
      <EmailSubscription />
    </main>
  );
}
