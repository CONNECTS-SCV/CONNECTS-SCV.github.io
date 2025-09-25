// Google Analytics 클라이언트 사이드 구현
// GitHub Pages에서 사용 가능한 클라이언트 전용 버전

export interface PageViewData {
  path: string;
  views: number;
  title?: string;
}

// Google Analytics 4 초기화
export function initGoogleAnalytics(measurementId: string) {
  if (typeof window !== 'undefined' && !(window as any).gtag) {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_path: window.location.pathname,
      });
    `;
    document.head.appendChild(script2);
  }
}

// 페이지뷰 추적 (클라이언트 사이드)
export function trackPageView(path: string, title?: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }
}

// 커스텀 이벤트 추적
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Google Analytics Reporting API를 사용한 데이터 가져오기
// 주의: GitHub Pages에서 실제 GA4 데이터를 가져오려면 다음 방법 중 하나를 사용해야 합니다:
// 1. Google Analytics Embed API (OAuth 필요)
// 2. 외부 API 서버 구축 (Vercel, Netlify Functions 등)
// 3. GitHub Actions를 통한 정기적인 데이터 업데이트
export async function fetchGoogleAnalyticsData(
  days: number = 30
): Promise<PageViewData[]> {
  try {
    // Google Analytics Data를 가져오는 외부 API 엔드포인트
    // 실제 구현 시 여기에 외부 API URL을 설정하세요
    const API_ENDPOINT = process.env.NEXT_PUBLIC_GA_API_ENDPOINT;

    if (!API_ENDPOINT) {
      console.log('Google Analytics API endpoint not configured');
      return getDefaultData();
    }

    const response = await fetch(`${API_ENDPOINT}?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`GA API Error: ${response.status}`);
      return getDefaultData();
    }

    const data = await response.json();
    return data.data || getDefaultData();
  } catch (error) {
    console.error('Failed to fetch Google Analytics data:', error);
    return getDefaultData();
  }
}

// 기본 데이터 (GA 데이터를 가져올 수 없을 때)
function getDefaultData(): PageViewData[] {
  // 실제 포스트가 있으므로 빈 배열 반환
  // 조회수는 GA에서 직접 추적되고 있음
  return [];
}

// Google Analytics Embed API 초기화 (OAuth 방식)
export function initGoogleAnalyticsEmbedAPI(clientId: string, viewId: string) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject('Window is not defined');
      return;
    }

    // Load the embed API
    const script = document.createElement('script');
    script.src = 'https://www.google-analytics.com/analytics.js';
    script.onload = () => {
      // Load platform.js
      const platformScript = document.createElement('script');
      platformScript.src = 'https://apis.google.com/js/platform.js';
      platformScript.onload = () => {
        if ((window as any).gapi) {
          (window as any).gapi.analytics.ready(() => {
            // Authorize the user
            (window as any).gapi.analytics.auth.authorize({
              container: 'ga-auth',
              clientid: clientId,
            });

            resolve(true);
          });
        }
      };
      document.head.appendChild(platformScript);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 포스트 조회 이벤트 추적
export function trackPostView(slug: string, title: string, author?: string) {
  trackEvent('post_view', 'engagement', slug);

  // Enhanced e-commerce tracking for GA4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'view_item', {
      currency: 'KRW',
      value: 1,
      items: [{
        item_id: slug,
        item_name: title,
        item_category: 'post',
        item_brand: author || 'CONNECTS',
        quantity: 1
      }]
    });
  }
}

// 검색 이벤트 추적
export function trackSearch(searchTerm: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'search', {
      search_term: searchTerm
    });
  }
}

// 공유 이벤트 추적
export function trackShare(method: string, contentId: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'share', {
      method: method,
      content_type: 'post',
      item_id: contentId
    });
  }
}