"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import type { AdBanner } from "@/types/banner";

interface BannerSlotProps {
    banners: AdBanner[];
    slotIndex: number;
    position: "left" | "right";
}

export function BannerSlot({ banners, slotIndex, position }: BannerSlotProps) {
    const { language } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
    
    // 배너 리스트가 변경되면 인덱스 리셋
    useEffect(() => {
        setCurrentIndex(0);
    }, [banners.length]);

    // Portal 타겟 설정 - 컨테이너로 변경
    useEffect(() => {
        const targetId = position === "left" ? "left-banner-container" : "right-banner-container";
        const target = document.getElementById(targetId);
        setPortalTarget(target);
    }, [position]);

    // 로테이션 설정 (isStatic이 false인 경우만)
    useEffect(() => {
        if (banners.length <= 1 || banners[0]?.isStatic) {
            console.log(`Slot ${slotIndex}: 로테이션 안함 (배너 수: ${banners.length}, isStatic: ${banners[0]?.isStatic})`);
            return;
        }

        // 슬롯의 첫 번째 배너의 rotationInterval을 사용 (슬롯 단위 통일)
        const interval = banners[0]?.rotationInterval || 10000; // 기본 10초
        console.log(`Slot ${slotIndex}: 로테이션 시작 (간격: ${interval}ms, 배너 수: ${banners.length}, 현재: ${currentIndex})`);

        if (!isHovered) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => {
                    const next = (prev + 1) % banners.length;
                    console.log(`Slot ${slotIndex}: 배너 전환 ${prev} → ${next}`);
                    return next;
                });
            }, interval);
            return () => {
                console.log(`Slot ${slotIndex}: 타이머 정리`);
                clearInterval(timer);
            };
        }
    }, [isHovered, banners.length, slotIndex]);  // banners 전체가 아닌 length만 의존성에 추가

    if (!banners || banners.length === 0) return null;

    const currentBanner = banners[currentIndex];
    if (!currentBanner) return null;

    // flex 컨테이너에 직접 배치되므로 별도 위치 계산 불필요
    const bannerContent = (
        <div className="w-[160px] p-2">
            <div
                className={`relative rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${currentBanner.backgroundColor}`}
                style={{ overflow: 'visible' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* 배너 내용 */}
                <a
                    href={currentBanner.link}
                    target={currentBanner.linkTarget || "_blank"}
                    rel="noopener noreferrer"
                    className={`block p-4 ${currentBanner.textColor || 'text-white'}`}
                >
                    {/* 이미지 */}
                    {currentBanner.imageUrl && (
                        <img
                            src={currentBanner.imageUrl}
                            alt={language === "ko" ? currentBanner.title : currentBanner.titleEn}
                            className="w-full h-20 object-contain rounded-lg mb-3"
                        />
                    )}

                    {/* 제목 */}
                    <h3 className="font-bold text-sm mb-1 leading-tight">
                        {language === "ko" ? currentBanner.title : currentBanner.titleEn}
                    </h3>

                    {/* 부제목 */}
                    <p className="text-xs opacity-90 mb-3">
                        {language === "ko" ? currentBanner.subtitle : currentBanner.subtitleEn}
                    </p>

                    {/* 마감일 */}
                    {currentBanner.endDate && (
                        <div className="text-xs opacity-80 mb-3">
                            {language === "ko" ? "마감: " : "Until: "}
                            {new Date(currentBanner.endDate).toLocaleDateString()}
                        </div>
                    )}

                    {/* CTA 버튼 */}
                    <div className="mt-4">
                        <span className={`inline-flex items-center justify-center w-full py-2 px-3 text-xs font-medium ${currentBanner.buttonColor || 'bg-black/20'} backdrop-blur-sm rounded-lg hover:opacity-80 transition-opacity`}>
                            {language === "ko" ? (currentBanner.buttonText || "자세히 보기") : (currentBanner.buttonTextEn || "Learn More")}
                            <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </a>

                {/* 인디케이터 (로테이션이 있는 경우만) */}
                {banners.length > 1 && !banners[0]?.isStatic && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentIndex(index);
                                }}
                                className={`w-1 h-1 rounded-full transition-all ${
                                    index === currentIndex ? "w-3 bg-white" : "bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Portal로 렌더링
    return portalTarget ? createPortal(bannerContent, portalTarget) : null;
}
