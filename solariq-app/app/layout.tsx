import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolariQ | Adaptive Solar & Edge-AI IoT Canal–Agri Framework",
  description:
    "SolariQ (solariq.world) - Universal Smart Water-Energy-Food Nexus Framework: Modular canal-top solar PV, precision AWD rice irrigation, and dynamic grid bypass across Bangladesh BWDB canal reaches (Active Demonstration: Kurigram Pilot 01).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Asul:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#fbfbfa] text-stone-900 selection:bg-emerald-700/15 selection:text-emerald-950" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
