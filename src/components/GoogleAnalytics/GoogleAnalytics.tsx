"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname instead of useRouter
import Script from 'next/script';
import * as gtag from '../../hooks/gtag';

const isProduction = process.env.NODE_ENV === 'production';

const GoogleAnalytics = () => {
  const pathname = usePathname(); // Get the current path from next/navigation

  useEffect(() => {
    if (!isProduction) return;

    // Trigger pageview tracking whenever the pathname changes
    gtag.pageview(pathname);
  }, [pathname]);

  if (!isProduction) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
