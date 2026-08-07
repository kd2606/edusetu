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
        <header
          className="sticky top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b border-[hsl(var(--stroke-subtle))] bg-[hsl(var(--bg-glass)/0.72)] backdrop-blur-xl shadow-rim"
          style={{ height: 'var(--header-h)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-rim" style={{ background: 'var(--grad-btn)' }}>
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-[hsl(var(--text-primary))] font-semibold text-lg tracking-tight">EduSetu</span>
          </div>
          <AuthButton />
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
