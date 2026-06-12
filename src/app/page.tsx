import { Hero } from "@/components/landing/hero";
import { Benefits } from "@/components/landing/benefits";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturedVenues } from "@/components/landing/featured-venues";
import { CTA } from "@/components/landing/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <HowItWorks />
      <FeaturedVenues />
      <CTA />
    </>
  );
}
