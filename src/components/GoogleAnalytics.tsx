'use client';

import { useEffect } from 'react';
import { initGoogleAnalytics } from '@/lib/googleAnalytics';

export function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      initGoogleAnalytics(GA_MEASUREMENT_ID);
    }
  }, [GA_MEASUREMENT_ID]);

  return null;
}