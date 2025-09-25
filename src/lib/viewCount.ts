"use client";

// 조회수를 로컬스토리지에 저장하고 관리하는 유틸리티
const VIEW_COUNT_KEY = 'post_view_counts';
const VIEWED_POSTS_KEY = 'viewed_posts';

export interface ViewCount {
  [slug: string]: number;
}

// 조회수 가져오기
export function getViewCounts(): ViewCount {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(VIEW_COUNT_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// 특정 포스트의 조회수 가져오기
export function getPostViewCount(slug: string): number {
  const counts = getViewCounts();
  return counts[slug] || 0;
}

// 조회수 증가
export function incrementViewCount(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    // 이미 본 포스트인지 확인 (세션 기준)
    const viewedPosts = sessionStorage.getItem(VIEWED_POSTS_KEY);
    const viewed = viewedPosts ? JSON.parse(viewedPosts) : [];

    if (!viewed.includes(slug)) {
      // 조회수 증가
      const counts = getViewCounts();
      counts[slug] = (counts[slug] || 0) + 1;
      localStorage.setItem(VIEW_COUNT_KEY, JSON.stringify(counts));

      // 세션에 본 포스트로 기록
      viewed.push(slug);
      sessionStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify(viewed));
    }
  } catch (error) {
    console.error('Failed to increment view count:', error);
  }
}

// 인기 포스트 가져오기 (조회수 기준)
export function getPopularPosts<T extends { metadata: { slug: string } }>(
  posts: T[],
  limit: number = 3
): T[] {
  const counts = getViewCounts();

  // 조회수가 있는 포스트를 조회수 순으로 정렬
  const postsWithViews = posts
    .map(post => ({
      post,
      views: counts[post.metadata.slug] || 0
    }))
    .sort((a, b) => b.views - a.views);

  // 조회수가 있는 포스트가 limit보다 적으면 최신 포스트로 채움
  const popularPosts = postsWithViews
    .filter(item => item.views > 0)
    .slice(0, limit)
    .map(item => item.post);

  // 부족한 만큼 최신 포스트로 채우기
  if (popularPosts.length < limit) {
    const remainingCount = limit - popularPosts.length;
    const recentPosts = posts
      .filter(post => !popularPosts.includes(post))
      .slice(0, remainingCount);

    popularPosts.push(...recentPosts);
  }

  return popularPosts;
}

// 초기 더미 데이터 설정 (개발용)
export function initializeDummyViewCounts(posts: Array<{ metadata: { slug: string } }>): void {
  if (typeof window === 'undefined') return;

  const existingCounts = getViewCounts();
  const hasData = Object.keys(existingCounts).length > 0;

  // 이미 데이터가 있으면 초기화하지 않음
  if (hasData) return;

  // 더미 조회수 생성 (랜덤하게)
  const dummyCounts: ViewCount = {};
  posts.forEach((post, index) => {
    // 첫 몇 개 포스트에 높은 조회수 부여
    if (index < 3) {
      dummyCounts[post.metadata.slug] = Math.floor(Math.random() * 50) + 100;
    } else if (index < 10) {
      dummyCounts[post.metadata.slug] = Math.floor(Math.random() * 50) + 20;
    } else {
      dummyCounts[post.metadata.slug] = Math.floor(Math.random() * 20);
    }
  });

  localStorage.setItem(VIEW_COUNT_KEY, JSON.stringify(dummyCounts));
}