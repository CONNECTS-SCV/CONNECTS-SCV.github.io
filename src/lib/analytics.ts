"use client";

// Google Analytics 이벤트 전송
export function sendGAEvent(eventName: string, parameters: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters);
  }
}

// 페이지 조회 이벤트 전송
export function trackPageView(path: string, title: string) {
  sendGAEvent('page_view', {
    page_path: path,
    page_title: title,
  });
}

// 포스트 조회 이벤트 전송
export function trackPostView(slug: string, title: string, author: string) {
  sendGAEvent('post_view', {
    post_slug: slug,
    post_title: title,
    post_author: author,
    event_category: 'engagement',
    event_label: slug,
  });
}