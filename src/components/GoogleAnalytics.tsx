'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    if (typeof window !== 'undefined') {
      console.warn('Google Analytics ID not found. NEXT_PUBLIC_GA_ID:', process.env.NEXT_PUBLIC_GA_ID);
    }
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Analytics script loaded with ID:', GA_MEASUREMENT_ID);
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
          console.log('Google Analytics initialized with ID: ${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}