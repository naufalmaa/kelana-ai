import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { AskAiProvider } from "@/context/AskAiContext";
import { AskAiFloatingWidget } from "@/components/AskAiFloatingWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KelanaAI - AI Travel Planner & Personalized Itinerary Architect",
  description: "Generate tailored travel itineraries with smart budget breakdowns and local guides powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <AskAiProvider>
            {children}
            <AuthModal />
            <AskAiFloatingWidget />
          </AskAiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
