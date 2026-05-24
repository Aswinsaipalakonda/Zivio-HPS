import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Zivio",
  description: "Daily task tracking and team management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}