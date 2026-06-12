import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Mis partidos",
  robots: { index: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
