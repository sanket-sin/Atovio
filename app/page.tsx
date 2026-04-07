import type { Metadata } from "next";
import { LandingExperience } from "@/components/landing";

export const metadata: Metadata = {
  title: "BeyondAQI · Real-Time India Air Quality Index, News & Hyperlocal Data",
  description:
    "Real-time Mumbai AQI data from BeyondAQI's hyperlocal sensor network. PM2.5, PM10, O3, NO2, SO2, CO — zero API smoothing, 30-minute refresh.",
};

export default function Home() {
  return <LandingExperience />;
}
