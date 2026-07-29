import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import Header from "./components/layout/Header";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: {
    default: "AgroClimate Intelligence",
    template: "%s · AgroClimate Intelligence",
  },
  description:
    "Painel de inteligência agroclimática que cruza alertas de desmatamento do MapBiomas com dados oficiais de produção agrícola do IBGE.",
  keywords: [
    "agroclimate",
    "agronegócio",
    "sustentabilidade",
    "MapBiomas",
    "IBGE",
    "impacto ambiental",
    "dashboard agrícola",
  ],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "AgroClimate Intelligence",
    description:
      "Monitoramento de impacto agrícola e ambiental cruzando dados de satélite e estatísticas oficiais de produção.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} font-sans antialiased bg-slate-50`}>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  );
}