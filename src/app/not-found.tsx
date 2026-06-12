import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm font-semibold tracking-widest text-primary">
        ERROR 404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        La pelota se fue afuera
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        La página que buscás no existe o fue movida. Volvé al inicio y seguí
        jugando.
      </p>
      <Link href="/" className="mt-6">
        <Button size="lg">Volver al inicio</Button>
      </Link>
    </div>
  );
}
