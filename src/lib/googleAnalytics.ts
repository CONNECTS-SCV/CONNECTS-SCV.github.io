// Google Analytics 클라이언트 사이드 구현
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics 4 초기화
export function initGoogleAnalytics(measurementId: string) {
  if (typeof window === 'undefined') return;

  // 이미 초기화되었는지 확인
  if (typeof window.gtag === 'function') return;

  // Google Analytics 스크립트 로드
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // gtag 함수 정의
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // 수동으로 페이지뷰를 관리
  });
}

// 페이지뷰 이벤트 전송
export function trackPageView(path?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path || window.location.pathname,
    page_location: window.location.href,
    page_title: document.title,
  });
}

// 사용자 정의 이벤트 전송
export function trackEvent(
  eventName: string,
  parameters?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  }
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    event_category: parameters?.category,
    event_label: parameters?.label,
    value: parameters?.value,
    ...parameters,
  });
}