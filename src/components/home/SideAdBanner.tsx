"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { AdBanner } from "@/types/banner";
import { getBanners, subscribeToBanners, unsubscribeFromBanners } from "@/lib/supabase-banners";

export function SideAdBanner({ position }: { position: "left" | "right" }) {
  const { language } = useLanguage();
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hiddenBanners, setHiddenBanners] = useState<Set<string>>(new Set());

  // 배너 데이터 로드 (데이터베이스 우선, localStorage 폴백)
  useEffect(() => {
    const loadBanners = async () => {
      try {
        // 데이터베이스에서 배너 가져오기
        const allBanners = await getBanners();

        const activeBanners = allBanners
          .filter(b => b.isActive && (b.position === position || b.position === 'both'))
          .filter(b => {
            // 날짜 필터링
            const now = new Date();
            if (b.startDate && new Date(b.startDate) > now) return false;
            if (b.endDate && new Date(b.endDate) < now) return false;
            return true;
          })
          .sort((a, b) => a.priority - b.priority);

        setBanners(activeBanners);
      } catch (error) {
        console.error('Error loading banners:', error);
        // 오류 시 빈 배열 사용
        setBanners([]);
      }
    };

    loadBanners();

    // 실시간 업데이트 구독
    const subscription = subscribeToBanners((updatedBanners) => {
      const activeBanners = updatedBanners
        .filter(b => b.isActive && (b.position === position || b.position === 'both'))
        .filter(b => {
          const now = new Date();
          if (b.startDate && new Date(b.startDate) > now) return false;
          if (b.endDate && new Date(b.endDate) < now) return false;
          return true;
        })
        .sort((a, b) => a.priority - b.priority);

      setBanners(activeBanners);
    });

    // localStorage 변경 감지 (폴백)
    const handleStorageChange = () => {
      loadBanners();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bannersUpdated', handleStorageChange);

    return () => {
      if (subscription) {
        unsubscribeFromBanners(subscription);
      }
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bannersUpdated', handleStorageChange);
    };
  }, [position]);

  // 숨긴 배너 저장
  useEffect(() => {
    const hidden = localStorage.getItem('hiddenAdBanners');
    if (hidden) {
      setHiddenBanners(new Set(JSON.parse(hidden)));
    }
  }, []);

  // 광고 로테이션 (10초마다)
  useEffect(() => {
    if (!isHovered && banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % banners.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isHovered, banners.length]);

  // 표시할 배너 필터링
  const visibleBanners = banners.filter(b => !hiddenBanners.has(b.id));

  if (visibleBanners.length === 0 || !isVisible) return null;

  // 다른 위치에서는 다른 광고 보여주기
  const adjustedIndex = position === "right"
    ? (currentAdIndex + Math.floor(visibleBanners.length / 2)) % visibleBanners.length
    : currentAdIndex % visibleBanners.length;

  const currentAd = visibleBanners[adjustedIndex];
  if (!currentAd) return null;

  return (
    <>
      {/* 데스크톱 사이드 배너 (1536px 이상) */}
      <div
        className="fixed hidden 2xl:block"
        style={{
          [position]: "20px",
          top: "280px",
          width: "160px",
          zIndex: 10,
        }}
      >
        <div
          className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${currentAd.backgroundColor}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 광고 내용 */}
          <a
            href={currentAd.link}
            target={currentAd.linkTarget || "_blank"}
            rel="noopener noreferrer"
            className={`block p-4 ${currentAd.textColor || 'text-white'}`}
          >
            {/* 이미지 (있는 경우) */}
            {currentAd.imageUrl && (
              <img
                src={currentAd.imageUrl}
                alt={language === "ko" ? currentAd.title : currentAd.titleEn}
                className="w-full h-20 object-contain rounded-lg mb-3"
              />
            )}

            {/* 제목 */}
            <h3 className="font-bold text-sm mb-1 leading-tight">
              {language === "ko" ? currentAd.title : currentAd.titleEn}
            </h3>

            {/* 부제목 */}
            <p className="text-xs opacity-90 mb-3">
              {language === "ko" ? currentAd.subtitle : currentAd.subtitleEn}
            </p>

            {/* 마감일 */}
            {currentAd.endDate && (
              <div className="text-xs opacity-80 mb-3">
                {language === "ko" ? "마감: " : "Until: "}
                {new Date(currentAd.endDate).toLocaleDateString()}
              </div>
            )}

            {/* CTA 버튼 */}
            <div className="mt-4">
              <span className={`inline-flex items-center justify-center w-full py-2 px-3 text-xs font-medium ${currentAd.buttonColor || 'bg-black/20'} backdrop-blur-sm rounded-lg hover:opacity-80 transition-opacity`}>
                {language === "ko" ? (currentAd.buttonText || "자세히 보기") : (currentAd.buttonTextEn || "Learn More")}
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </a>

          {/* 인디케이터 */}
          {visibleBanners.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {visibleBanners.map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-1 rounded-full transition-all ${
                    index === adjustedIndex ? "w-3 bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 태블릿/모바일 하단 배너 (1536px 미만) */}
      {position === "left" && isVisible && ( // 중복 방지를 위해 left 포지션일 때만 렌더링
        <div className="2xl:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 shadow-lg">
          <div className={`relative ${currentAd.backgroundColor} p-3`}>
            <a
              href={currentAd.link}
              target={currentAd.linkTarget || "_blank"}
              rel="noopener noreferrer"
              className={`flex items-center gap-3 ${currentAd.textColor || 'text-white'}`}
            >
              {/* 내용 */}
              <div className="flex-1">
                <h3 className="font-bold text-sm">
                  {language === "ko" ? currentAd.title : currentAd.titleEn}
                </h3>
                <p className="text-xs opacity-90">
                  {language === "ko" ? currentAd.subtitle : currentAd.subtitleEn}
                </p>
              </div>

              {/* CTA 버튼 */}
              <span className={`px-3 py-1.5 text-xs font-medium ${currentAd.buttonColor || 'bg-black/20'} backdrop-blur-sm rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap`}>
                {language === "ko" ? (currentAd.buttonText || "자세히") : (currentAd.buttonTextEn || "More")}
                <svg className="inline-block ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
