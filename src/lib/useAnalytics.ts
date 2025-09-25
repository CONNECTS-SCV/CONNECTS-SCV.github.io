"use client";

import { useEffect, useState } from 'react';
import { fetchGoogleAnalyticsData, trackPageView } from './googleAnalytics';

export function useAnalyticsData() {
  const [viewData, setViewData] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Google Analytics API에서 데이터 가져오기
        const analyticsData = await fetchGoogleAnalyticsData(30);

        const viewMap = new Map<string, number>();
        analyticsData.forEach((item) => {
          // path에서 slug 추출 (/post/slug-name -> slug-name)
          const slug = item.path.replace('/post/', '');
          viewMap.set(slug, item.views);
        });

        setViewData(viewMap);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();

    // 5분마다 데이터 새로고침
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { viewData, loading };
}

// 페이지 조회수 추적
export function usePageTracking(path?: string, title?: string) {
  useEffect(() => {
    if (path) {
      trackPageView(path, title);
    }
  }, [path, title]);
}

export function getPopularPostsFromAnalytics<T extends { metadata: { slug: string } }>(
  posts: T[],
  viewData: Map<string, number>,
  limit: number = 3
): T[] {
  // 조회수 데이터가 있는 포스트를 조회수 순으로 정렬
  const postsWithViews = posts
    .map(post => ({
      post,
      views: viewData.get(post.metadata.slug) || 0
    }))
    .sort((a, b) => b.views - a.views);

  // 조회수가 있는 포스트 우선 선택
  const popularPosts = postsWithViews
    .filter(item => item.views > 0)
    .slice(0, limit)
    .map(item => item.post);

  // 부족한 경우 최신 포스트로 채우기
  if (popularPosts.length < limit) {
    const remainingCount = limit - popularPosts.length;
    const recentPosts = posts
      .filter(post => !popularPosts.includes(post))
      .slice(0, remainingCount);

    popularPosts.push(...recentPosts);
  }

  return popularPosts;
}