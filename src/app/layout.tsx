import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: {
    template: '%s | CONNECTS',
    default: 'CONNECTS Tech Blog',
  },
  description: 'AI 기반 구조 생물학 분석 플랫폼 CONNECTS의 기술 블로그',
  metadataBase: new URL('https://connects-scv.github.io'),
  applicationName: 'CONNECTS Blog',
  referrer: 'origin-when-cross-origin',
  keywords: ['AI', '구조생물학', '단백질', '약물발견', 'AlphaFold', 'Curie', 'Twin', 'Pensive', 'CONNECTS'],
  authors: [{ name: 'CONNECTS Team' }],
  creator: 'CONNECTS',
  publisher: 'CONNECTS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSans.variable}>
      <head>
        <link rel="icon" href="/image/favicon.ico" />
        <link rel="apple-touch-icon" href="/image/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
      </head>
      <body className={notoSans.className}>
        <GoogleAnalytics />
        <PageViewTracker />
        <div className="w-full fixed top-0 z-50 bg-white">
          <div className="w-full max-w-[1140px] mx-auto">
            <Header />
          </div>
        </div>
        <div className="w-full h-full min-h-screen mx-auto flex flex-col items-center pt-[60px]">
          <div className="w-full max-w-[1140px] px-4">{children}</div>
        </div>
        {/*<Footer />*/}
      </body>
    </html>
  );
}
