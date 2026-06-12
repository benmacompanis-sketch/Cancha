"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { adminLogin, isAdminLoggedIn, DEMO_ADMIN } from "@/lib/admin-auth";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    if (isAdminLoggedIn()) router.replace("/admin");
  }, [router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    setPending(true);
    // Pequeña latencia para que el feedback se sienta real
    setTimeout(() => {
      if (adminLogin(email, password)) {
        router.replace("/admin");
      } else {
        setError(true);
        setPending(false);
      }
    }, 450);
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div className="glass w-full max-w-md rounded-3xl p-8 shadow-premium-lg">
        <div className="text-center">
          <LogoMark className="mx-auto size-12 rounded-2xl" />
          <h1 className="mt-4 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight">
            <Lock className="size-5 text-primary" />
            Panel de administración
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acceso exclusivo para el staff del complejo.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <Input
            type="email"
            placeholder="Email del staff"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            autoComplete="username"
            required
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Contraseña"
            autoComplete="current-password"
            required
          />
          {error && (
            <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400">
              Email o contraseña incorrectos.
            </p>
          )}
          <Button className="w-full" size="lg" type="submit" disabled={pending}>
            {pending ? "Verificando…" : "Ingresar al panel"}
          </Button>
        </form>

        <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/50 p-3.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Credenciales del demo
          </p>
          <p className="mt-1 font-mono">
            {DEMO_ADMIN.email} · {DEMO_ADMIN.password}
          </p>
        </div>
      </div>
    </div>
  );
}
