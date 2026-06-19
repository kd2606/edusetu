import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth-button";
import { AmbientBackground } from "@/components/ambient-background";

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const metadata: Metadata = {
  title: "EduSetu | Your Learning Navigator",
  description: "Every goal deserves a clear path. AI-driven learning roadmaps for students, aspirants, and builders.",
  icons: {
    icon: "/edusetu-icon.svg",
  },
  openGraph: {
    title: "EduSetu | Your Learning Navigator",
    description: "Every goal deserves a clear path. AI-driven learning roadmaps for students, aspirants, and builders.",
    type: "website",
    url: "https://edusetu-six.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduSetu | Your Learning Navigator",
    description: "Every goal deserves a clear path. AI-driven learning roadmaps for students, aspirants, and builders.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans", inter.variable)}>
      <body className="antialiased flex flex-col min-h-screen">
        <AmbientBackground />
        <header className="absolute top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b border-white/[0.05] bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">E</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">EduSetu</span>
          </div>
          <AuthButton />
        </header>
        <main className="flex-1 flex flex-col pt-[73px]">
          {children}
        </main>
      </body>
    </html>
  );
}
