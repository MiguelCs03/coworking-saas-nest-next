import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Coworking SaaS - Gestión Inteligente de Espacios",
  description: "Plataforma profesional para gestionar espacios de coworking. Reserva salas, gestiona usuarios y optimiza tu espacio de trabajo.",
  keywords: ["coworking", "saas", "gestión de espacios", "reservas", "oficinas compartidas"],
  authors: [{ name: "Coworking SaaS" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body suppressHydrationWarning className="flex min-h-screen flex-col">
        <Toaster position="top-right" richColors />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
