import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";


import Header from "../app/components/layout/Header";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "AgroClimate-Intelligence",
  description: "Monitoramento de impacto agrícola e ambiental",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} antialiased bg-slate-50`}>
        
        <Header />

       
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}