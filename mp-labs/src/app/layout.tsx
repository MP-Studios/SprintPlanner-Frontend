import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoggedInNavBar from "./navbar/LoggedInNavBar";
import LoggedOutNavBar from "./navbar/LoggedOutNavBar";
import { Inter } from 'next/font/google';
import { createClient } from '@/utils/supabase/server';
import { Providers } from './providers';
import { ClassProvider } from './context/ClassContext';

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'], 
  variable: '--font-sans', 
  display: 'swap' 
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sprint-Planner",
  description: "Organize your Homework",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;

  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <ClassProvider>
            {/* Show different NavBar based on login status */}
            {user ? <LoggedInNavBar user={user} /> : <LoggedOutNavBar />}
            <main className="p-4">{children}</main>
          </ClassProvider>
        </Providers>
      </body>
    </html>
  );
}