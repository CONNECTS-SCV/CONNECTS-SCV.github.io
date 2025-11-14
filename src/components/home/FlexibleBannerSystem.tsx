"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { AdBanner } from "@/types/banner";
import { getBanners, subscribeToBanners, unsubscribeFromBanners } from "@/lib/supabase-banners";
import { BannerSlot } from "./BannerSlot";

interface FlexibleBannerSystemProps {
    position: "left" | "right";
}

export function FlexibleBannerSystem({ position }: FlexibleBannerSystemProps) {
    const [banners, setBanners] = useState<AdBanner[]>([]);
    const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0);
    const [isMobileHovered, setIsMobileHovered] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const allBanners = await getBanners();
                
                // 해당 위치의 활성 배너만 필터링
                const activeBanners = allBanners
                    .filter(b => b.isActive && (b.position === position || b.position === 'both'))
                    .filter(b => {
                        const now = new Date();
                        if (b.startDate && new Date(b.startDate) > now) return false;
                        if (b.endDate && new Date(b.endDate) < now) return false;
                        return true;
                    })
                    .sort((a, b) => {
                        // 먼저 slotIndex로 정렬, 같으면 priority로 정렬
                        if (a.slotIndex !== undefined && b.slotIndex !== undefined) {
                            if (a.slotIndex !== b.slotIndex) {
                                return a.slotIndex - b.slotIndex;
                            }
                        }
                        return a.priority - b.priority;
                    });

                console.log('Loaded banners for', position, ':', activeBanners.map(b => ({
                    title: b.title,
                    slotIndex: b.slotIndex,
                    isStatic: b.isStatic,
                    rotationInterval: b.rotationInterval
                })));

                setBanners(activeBanners);
            } catch (error) {
                console.error('Error loading banners:', error);
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
                .sort((a, b) => {
                    if (a.slotIndex !== undefined && b.slotIndex !== undefined) {
                        if (a.slotIndex !== b.slotIndex) {
                            return a.slotIndex - b.slotIndex;
                        }
                    }
                    return a.priority - b.priority;
                });

            setBanners(activeBanners);
        });

        return () => {
            if (subscription) {
                unsubscribeFromBanners(subscription);
            }
        };
    }, [position]);

    // 모바일 배너 로테이션 (하단에 표시되는 모든 활성 배너)
    useEffect(() => {
        if (position !== "left" || banners.length <= 1) return;
        
        if (!isMobileHovered) {
            const interval = setInterval(() => {
                setMobileCurrentIndex((prev) => (prev + 1) % banners.length);
            }, 5000); // 5초마다 로테이션
            return () => clearInterval(interval);
        }
    }, [isMobileHovered, banners.length, position]);

    // 배너를 슬롯별로 그룹화 (위치+슬롯이 같으면 같은 그룹)
    const bannersBySlot = banners.reduce((acc, banner) => {
        const slot = banner.slotIndex ?? 0;
        
        if (!acc[slot]) {
            acc[slot] = [];
        }
        acc[slot].push(banner);

        return acc;
    }, {} as Record<number, AdBanner[]>);

    console.log('Banners by slot for', position, ':', 
        Object.entries(bannersBySlot).map(([slot, banners]) => ({
            slot: parseInt(slot),
            count: banners.length,
            isStatic: banners[0]?.isStatic,
            rotationInterval: banners[0]?.rotationInterval
        }))
    );

    // 모바일에 표시할 현재 배너
    const currentMobileBanner = banners.length > 0 ? banners[mobileCurrentIndex % banners.length] : null;

    return (
        <>
            {/* 데스크톱 배너 슬롯들 - 세로로 배치 */}
            <div className="hidden 2xl:block">
                {Object.entries(bannersBySlot)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b)) // 슬롯 인덱스 순서대로 정렬
                    .map(([slotIndex, slotBanners]) => {
                        const slot = parseInt(slotIndex);
                        
                        if (!slotBanners || slotBanners.length === 0) return null;

                        return (
                            <BannerSlot
                                key={`slot-${slot}-${position}`}
                                banners={slotBanners}
                                slotIndex={slot}
                                position={position}
                            />
                        );
                    })
                }
            </div>

            {/* 모바일 하단 배너 - 모든 활성 배너 로테이션 */}
            {position === "left" && currentMobileBanner && (
                <div 
                    className="2xl:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 shadow-lg"
                    onMouseEnter={() => setIsMobileHovered(true)}
                    onMouseLeave={() => setIsMobileHovered(false)}
                >
                    <div className={`relative ${currentMobileBanner.backgroundColor} p-3`}>
                        <a
                            href={currentMobileBanner.link}
                            target={currentMobileBanner.linkTarget || "_blank"}
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 ${currentMobileBanner.textColor || 'text-white'}`}
                        >
                            <div className="flex-1">
                                <h3 className="font-bold text-sm">
                                    {language === "ko" ? currentMobileBanner.title : currentMobileBanner.titleEn}
                                </h3>
                                <p className="text-xs opacity-90">
                                    {language === "ko" ? currentMobileBanner.subtitle : currentMobileBanner.subtitleEn}
                                </p>
                            </div>

                            <span className={`px-3 py-1.5 text-xs font-medium ${currentMobileBanner.buttonColor || 'bg-black/20'} backdrop-blur-sm rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap`}>
                                {language === "ko" ? (currentMobileBanner.buttonText || "자세히") : (currentMobileBanner.buttonTextEn || "More")}
                                <svg className="inline-block ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </a>
                        
                        {/* 모바일 배너 인디케이터 */}
                        {banners.length > 1 && (
                            <div className="absolute top-1/2 right-2 -translate-y-1/2 flex flex-col gap-1">
                                {banners.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setMobileCurrentIndex(index);
                                        }}
                                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                                            index === mobileCurrentIndex ? "h-4 bg-white" : "bg-white/40"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}