import ParallaxBanner from "./components/Home/Banner/Banner";
import { StatsSection } from "./components/Home/Counts/Counts";
import { PartnersSection } from "./components/Home/Partners/Partners";
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
    </main>
  );
}
