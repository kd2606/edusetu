import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
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
    <html lang="en" className={cn("dark font-sans", inter.variable)} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen bg-background text-on-surface">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AmbientBackground />
          <main className="flex-1 flex flex-col h-full w-full">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
