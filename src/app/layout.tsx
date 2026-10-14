import { SITE_URL, SITE_NAME } from "@/lib/seo";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import WingBanner from "@/components/WingBanner";

const siteName = SITE_NAME;
const siteUrl = SITE_URL;

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;
const naverVerification = process.env.NEXT_PUBLIC_NAVER_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  title: {
    template: `%s | ${siteName}`,
    default: `${siteName} — 50부터 더 건강하게, 더 단단하게`,
  },
  description: "다이어트·혈당관리·건강식단·운동까지, 50대부터 지속 가능한 건강 습관을 전하는 중년 건강 매거진 단단한50",
  openGraph: {
    type: "website",
    siteName,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
  },
  ...(googleVerification || naverVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(naverVerification
            ? { other: { "naver-site-verification": naverVerification } }
            : {}),
        },
      }
    : {}),
  other: {
    "google-adsense-account": "ca-pub-4300133982902733",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ko" className="h-full">
      <head>
        {/* Pretendard — 디자인 기획서 §2 폰트 */}
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <SiteHeader />
        <div style={{ flex: 1 }}>{children}</div>
        <Footer />
        <WingBanner />
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {gaId && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
