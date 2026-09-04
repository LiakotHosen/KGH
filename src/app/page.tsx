import { Hero } from "@/components/home/Hero";
import { DepartmentGrid } from "@/components/home/DepartmentGrid";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { DoctorPreview } from "@/components/home/DoctorPreview";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <DoctorPreview />
      <DepartmentGrid />
      <WhyChooseUs />
      <GoogleReviews />
      <CtaBanner />
    </div>
  );
}
