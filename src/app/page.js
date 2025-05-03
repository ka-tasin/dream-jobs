import ParallaxBanner from "./components/Banner/Banner";
import { TopJobsSection } from "./components/TopJobs/TopJobsSection";

export default function Home() {
  return (
    <main>
      <ParallaxBanner />
      <TopJobsSection />
    </main>
  );
}
