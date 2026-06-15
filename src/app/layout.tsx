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
      <body className="antialiased">
        <AmbientBackground />
        <div className="fixed top-4 right-4 z-50">
          <AuthButton />
        </div>
        {children}
      </body>
    </html>
  );
}
