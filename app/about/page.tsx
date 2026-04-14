import { Metadata } from "next";
import AboutPageClient from "@/components/AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | ElesWoodDesigns",
  description: "Learn more about ElesWoodDesigns and our passion for woodworking.",
  alternates: {
    canonical: "/about/",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
