import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RadiX — Enterprise AI Radiology PACS Workstation & Multi-Agent Co-Pilot",
  description:
    "Next.js App Router + Gemini 2.5 Flash Multi-Agent Radiology PACS Workstation with In-Memory Clinical Knowledge Graph and Trilingual Patient Empathy Co-Pilot.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
