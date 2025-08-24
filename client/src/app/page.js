// import ParallaxBanner from "./components/Home/Banner/Banner";
import InteractiveBanner from "@/custom-components/Home/Banner/Banner";
import { TopJobsSection } from "@/custom-components/Home/TopJobs/TopJobsSection";
import { StatsSection } from "@/custom-components/Home/Counts/Counts";
import { WhatWeOffer } from "@/custom-components/Home/WeOffer/WeOffer";
import { PartnersSection } from "@/custom-components/Home/Partners/Partners";
import { TestimonialSlider } from "@/custom-components/Home/Testimonials/TestimonialSlider";
import EmailSubscription from "@/custom-components/Home/EmailSubscription/EmailSubscription";
import { FAQSection } from "@/custom-components/Home/FAQ/FAQ";

export default function Home() {
  return (
    <main>
      <InteractiveBanner />
      <TopJobsSection />
      <StatsSection />
      <WhatWeOffer />
      <PartnersSection />
      <TestimonialSlider />
      <EmailSubscription />
      <FAQSection />
    </main>
  );
}
