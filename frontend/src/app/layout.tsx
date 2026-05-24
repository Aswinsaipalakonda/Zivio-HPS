import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "../providers/QueryProvider";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Zivio",
  description: "Daily task tracking for teams",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zivio",
  },
};

export const viewport: Viewport = {
  themeColor: "#3A9DE9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // prevents zoom on focus on iOS
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`h-full antialiased ${inter.variable}`}>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        </head>
        <body className="min-h-full flex flex-col bg-surface text-text font-sans">
          <QueryProvider>
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}