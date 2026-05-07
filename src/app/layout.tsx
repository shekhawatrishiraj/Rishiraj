import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { FeedbackFab } from "@/components/feedback-fab";
import { PersonaSwitcher } from "@/components/persona-switcher";
import { AnnotationOverlay } from "@/components/annotation-overlay";
import { AnnotationsProvider } from "@/hooks/use-annotations";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Design Prototype",
    template: "%s | Prototype",
  },
  description: "Rapid design prototyping environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {(process.env.NODE_ENV === "development" ||
          process.env.NEXT_PUBLIC_ENABLE_REACT_GRAB === "true") && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          {children}
          <Suspense>
            <AnnotationsProvider>
              <PersonaSwitcher />
              <AnnotationOverlay />
            </AnnotationsProvider>
          </Suspense>
          <FeedbackFab />
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
