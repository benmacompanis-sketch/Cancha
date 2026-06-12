import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Acceso al panel",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
