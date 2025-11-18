import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Immobilienbewertung | Professionelle Immobilienbewertung",
  description: "Automatisierte Immobilienbewertung nach ImmoWertV 2021 mit Ertragswertverfahren, umgekehrtem Ertragswertverfahren und Vergleichswertverfahren",
  keywords: "Immobilienbewertung, Ertragswertverfahren, Bodenrichtwert, BORIS, Immobiliengutachten, ImmoWertV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
