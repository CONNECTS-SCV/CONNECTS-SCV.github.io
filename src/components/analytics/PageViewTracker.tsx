'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/googleAnalytics';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view whenever the pathname changes
    trackPageView(pathname);
  }, [pathname]);

  return null;
}