'use client';

import { useEffect } from 'react';
import { trackPostView } from '@/lib/googleAnalytics';

interface PostViewTrackerProps {
  slug: string;
  title: string;
  author?: string;
}

export default function PostViewTracker({ slug, title, author }: PostViewTrackerProps) {
  useEffect(() => {
    // Track the post view when the component mounts
    trackPostView(slug, title, author);
  }, [slug, title, author]);

  // This component doesn't render anything
  return null;
}