import Container from "@/components/layout/container";
import Faq from "@/components/section/landing-page/faq";
import FullValueProp from "@/components/section/landing-page/full-value-prop";
import Hero from "@/components/section/landing-page/hero";
import PlanPrice from "@/components/section/landing-page/plan-price";
import PopularNow from "@/components/section/landing-page/popular-now";

export default function LandingPage() {
  return (
    <Container className="w-full h-full space-y-20">
      <Hero />
      <PopularNow />
      <PlanPrice />
      <FullValueProp />
      <Faq />
    </Container>
  );
}
