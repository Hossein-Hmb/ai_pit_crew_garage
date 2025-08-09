import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ThemeClient from "@/components/ThemeClient";
import BackgroundDecor from "@/components/BackgroundDecor";

const titleFont = Orbitron({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});
const bodyFont = Exo_2({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Pit Crew Garage",
  description:
    "A childish, funny, cool AI garage with Supabase auth and OpenAI toys",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${titleFont.variable} ${bodyFont.variable} antialiased font-body`}>
        <div className="min-h-screen flex flex-col">
          <BackgroundDecor />
          <ThemeClient />
          <NavBar />
          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-5 py-8">
              <div className="rounded-3xl bg-white/70 dark:bg-black/30 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.10),0_20px_60px_rgba(0,0,0,0.08)] text-slate-800 dark:text-slate-200">
                {children}
              </div>
            </div>
          </main>
          <footer className="border-t border-black/10 dark:border-white/10 text-center text-xs py-6 opacity-70">
            Built with ❤️, rubber ducks, and too many stickers.
          </footer>
        </div>
      </body>
    </html>
  );
}
