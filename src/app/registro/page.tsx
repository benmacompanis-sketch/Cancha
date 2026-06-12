import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div className="glass w-full max-w-md rounded-3xl p-8 shadow-premium-lg">
        <div className="text-center">
          <LogoMark className="mx-auto size-12 rounded-2xl" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Creá tu cuenta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reservá tu primera cancha en menos de un minuto.
          </p>
        </div>

        <form className="mt-6 space-y-3">
          <Input placeholder="Nombre y apellido" aria-label="Nombre" />
          <Input type="email" placeholder="tu@email.com" aria-label="Email" />
          <Input type="tel" placeholder="WhatsApp (para confirmaciones)" aria-label="WhatsApp" />
          <Input type="password" placeholder="Contraseña" aria-label="Contraseña" />
          <Button className="w-full" size="lg" type="submit">
            Crear cuenta
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
