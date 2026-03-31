import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

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
      <body className={`${geist.variable} antialiased`}>
        {/* O Header foi removido daqui para ser controlado individualmente pelas páginas */}
        {children}
      </body>
    </html>
  );
}