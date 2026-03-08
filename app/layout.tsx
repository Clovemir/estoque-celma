import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Celma Construções - Catálogo",
  description: "Catálogo de materiais de construção Celma Construções",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-secondary">
              Celma Construções - Catálogo
            </h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

