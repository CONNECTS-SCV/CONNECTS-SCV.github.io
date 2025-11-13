"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Save, X,
  ChevronUp, ChevronDown, Palette, Type, Image as ImageIcon,
  Monitor, Smartphone, Copy, Check, ArrowLeft, LogOut,
  Megaphone, TrendingUp, Clock, AlertCircle
} from "lucide-react";
import type { AdBanner, BannerFormData } from "@/types/banner";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from "@/lib/supabase-banners";

// 미리 정의된 그라데이션 색상
const predefinedGradients = [
  { name: "Purple Pink", value: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { name: "Blue Cyan", value: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  { name: "Green Emerald", value: "bg-gradient-to-br from-green-500 to-emerald-500" },
  { name: "Orange Red", value: "bg-gradient-to-br from-orange-500 to-red-500" },
  { name: "Indigo Purple", value: "bg-gradient-to-br from-indigo-500 to-purple-500" },
  { name: "Gray Dark", value: "bg-gradient-to-br from-gray-600 to-gray-900" },
  { name: "Teal Cyan", value: "bg-gradient-to-br from-teal-500 to-cyan-500" },
  { name: "Rose Pink", value: "bg-gradient-to-br from-rose-500 to-pink-500" },
  { name: "Yellow Orange", value: "bg-gradient-to-br from-yellow-400 to-orange-500" },
  { name: "Pink Red", value: "bg-gradient-to-br from-pink-500 to-red-500" },
  { name: "Blue Purple", value: "bg-gradient-to-br from-blue-600 to-purple-600" },
  { name: "Emerald Teal", value: "bg-gradient-to-br from-emerald-500 to-teal-600" },
];

// 단색 배경
const solidColors = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Gray", value: "bg-gray-700" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Pink", value: "bg-pink-500" },
];

// 텍스트 색상
const textColors = [
  { name: "White", value: "text-white" },
  { name: "Black", value: "text-gray-900" },
  { name: "Gray", value: "text-gray-700" },
];

// CTA 버튼 스타일
const ctaStyles = [
  { name: "자세히 보기", nameEn: "Learn More", icon: "arrow" },
  { name: "지금 신청", nameEn: "Apply Now", icon: "none" },
  { name: "더 알아보기", nameEn: "Discover More", icon: "arrow" },
  { name: "참여하기", nameEn: "Join Now", icon: "none" },
  { name: "시작하기", nameEn: "Get Started", icon: "arrow" },
];

export function BannerManager() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [editingBanner, setEditingBanner] = useState<AdBanner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showCopied, setShowCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'settings'>('content');
  const [ctaText, setCtaText] = useState(ctaStyles[0]);
  const [backgroundType, setBackgroundType] = useState<'gradient' | 'solid' | 'custom'>('gradient');
  const [customBackground, setCustomBackground] = useState('');

  const [formData, setFormData] = useState<BannerFormData>({
    title: "",
    titleEn: "",
    subtitle: "",
    subtitleEn: "",
    backgroundColor: predefinedGradients[0].value,
    textColor: "text-white",
    link: "",
    linkTarget: "_blank",
    isActive: true,
    priority: 1,
    position: "both",
  });

  // 통계 계산
  const stats = {
    total: banners.length,
    active: banners.filter(b => b.isActive).length,
    scheduled: banners.filter(b => {
      if (!b.startDate) return false;
      return new Date(b.startDate) > new Date();
    }).length,
    expired: banners.filter(b => {
      if (!b.endDate) return false;
      return new Date(b.endDate) < new Date();
    }).length,
  };

  // 배너 데이터 로드
  useEffect(() => {
    loadBanners();
  }, []);

  // 실시간 업데이트를 위한 이벤트 리스너
  useEffect(() => {
    const handleUpdate = () => {
      loadBanners();
    };

    window.addEventListener('bannersUpdated', handleUpdate);
    return () => {
      window.removeEventListener('bannersUpdated', handleUpdate);
    };
  }, []);

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 배너 저장 (실시간 업데이트)
  const saveBanner = async (banner: AdBanner | Omit<AdBanner, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if ('id' in banner && banner.id) {
        // 수정
        const { id, createdAt, updatedAt, ...updates } = banner;
        await updateBanner(id, updates);
      } else {
        // 생성
        await createBanner(banner);
      }
      await loadBanners();
      window.dispatchEvent(new Event('bannersUpdated'));
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  // 배너 생성/수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalBackground = backgroundType === 'custom' && customBackground
      ? customBackground
      : formData.backgroundColor;

    if (editingBanner) {
      // 수정
      await saveBanner({
        ...editingBanner,
        ...formData,
        backgroundColor: finalBackground,
      });
      setEditingBanner(null);
    } else {
      // 생성
      await saveBanner({
        ...formData,
        backgroundColor: finalBackground,
      });
    }

    setIsCreating(false);
    resetForm();
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      title: "",
      titleEn: "",
      subtitle: "",
      subtitleEn: "",
      backgroundColor: predefinedGradients[0].value,
      textColor: "text-white",
      link: "",
      linkTarget: "_blank",
      isActive: true,
      priority: banners.length + 1,
      position: "both",
    });
    setActiveTab('content');
    setBackgroundType('gradient');
    setCustomBackground('');
    setCtaText(ctaStyles[0]);
  };

  // 배너 삭제
  const handleDelete = async (bannerId: string) => {
    if (confirm(language === 'ko' ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete?')) {
      try {
        await deleteBanner(bannerId);
        await loadBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  // 배너 활성화/비활성화 토글
  const toggleActive = async (banner: AdBanner) => {
    await saveBanner({
      ...banner,
      isActive: !banner.isActive,
    });
  };

  // 우선순위 변경
  const changePriority = async (banner: AdBanner, direction: 'up' | 'down') => {
    const newPriority = direction === 'up'
      ? Math.max(1, banner.priority - 1)
      : banner.priority + 1;

    // 해당 우선순위를 가진 다른 배너 찾기
    const otherBanner = banners.find(b => b.id !== banner.id && b.priority === newPriority);

    if (otherBanner) {
      // 두 배너의 우선순위 교체
      await saveBanner({ ...banner, priority: newPriority });
      await saveBanner({ ...otherBanner, priority: banner.priority });
    } else {
      await saveBanner({ ...banner, priority: newPriority });
    }
  };

  // 편집 시작
  const startEdit = (banner: AdBanner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      titleEn: banner.titleEn,
      subtitle: banner.subtitle,
      subtitleEn: banner.subtitleEn,
      backgroundColor: banner.backgroundColor,
      textColor: banner.textColor,
      link: banner.link,
      linkTarget: banner.linkTarget,
      startDate: banner.startDate,
      endDate: banner.endDate,
      isActive: banner.isActive,
      priority: banner.priority,
      position: banner.position,
      imageUrl: banner.imageUrl,
    });

    // 배경 타입 감지
    if (banner.backgroundColor.includes('gradient')) {
      setBackgroundType('gradient');
    } else if (solidColors.some(c => c.value === banner.backgroundColor)) {
      setBackgroundType('solid');
    } else {
      setBackgroundType('custom');
      setCustomBackground(banner.backgroundColor);
    }

    setIsCreating(true);
  };

  // 배너 복제
  const duplicateBanner = async (banner: AdBanner) => {
    const { id, createdAt, updatedAt, ...bannerData } = banner;
    await saveBanner({
      ...bannerData,
      title: `${banner.title} (복사본)`,
      titleEn: `${banner.titleEn} (Copy)`,
      priority: banners.length + 1,
    });
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // 취소
  const handleCancel = () => {
    setIsCreating(false);
    setEditingBanner(null);
    resetForm();
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_auth_time");
    router.push("/");
  };

  // 실시간 미리보기 배너 데이터
  const previewBanner = {
    ...formData,
    backgroundColor: backgroundType === 'custom' && customBackground
      ? customBackground
      : formData.backgroundColor,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 통계 카드 */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <Megaphone className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                Total
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500 mt-1">
              {language === 'ko' ? '전체 배너' : 'Total Banners'}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                Active
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
            <div className="text-sm text-gray-500 mt-1">
              {language === 'ko' ? '활성 배너' : 'Active Banners'}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Scheduled
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.scheduled}</div>
            <div className="text-sm text-gray-500 mt-1">
              {language === 'ko' ? '예약됨' : 'Scheduled'}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                Expired
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.expired}</div>
            <div className="text-sm text-gray-500 mt-1">
              {language === 'ko' ? '만료됨' : 'Expired'}
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div>
          {/* 상단 액션 바 */}
          <div className="flex justify-between items-center mb-6">
            {showCopied && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                <Check className="w-4 h-4" />
                {language === 'ko' ? '복사됨' : 'Copied'}
              </div>
            )}
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                {language === 'ko' ? '새 배너 추가' : 'Add New Banner'}
              </button>
            )}
          </div>

          {/* 배너 생성/수정 폼 */}
          {isCreating && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <div className="flex">
                {/* 폼 섹션 */}
                <div className="flex-1 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    {editingBanner
                      ? (language === 'ko' ? '배너 수정' : 'Edit Banner')
                      : (language === 'ko' ? '새 배너 추가' : 'Add New Banner')
                    }
                  </h3>

                  {/* 탭 네비게이션 */}
                  <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('content')}
                      className={`px-4 py-3 font-medium transition-all ${
                        activeTab === 'content'
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Type className="w-4 h-4 inline mr-2" />
                      {language === 'ko' ? '콘텐츠' : 'Content'}
                    </button>
                    <button
                      onClick={() => setActiveTab('design')}
                      className={`px-4 py-3 font-medium transition-all ${
                        activeTab === 'design'
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Palette className="w-4 h-4 inline mr-2" />
                      {language === 'ko' ? '디자인' : 'Design'}
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`px-4 py-3 font-medium transition-all ${
                        activeTab === 'settings'
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {language === 'ko' ? '설정' : 'Settings'}
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 콘텐츠 탭 */}
                    {activeTab === 'content' && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                          {/* 한국어 제목 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              한국어 제목 *
                            </label>
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="예: 2025 AI 공모전"
                              required
                            />
                          </div>

                          {/* 영어 제목 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              English Title *
                            </label>
                            <input
                              type="text"
                              value={formData.titleEn}
                              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="e.g. 2025 AI Contest"
                              required
                            />
                          </div>

                          {/* 한국어 부제목 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              한국어 부제목 *
                            </label>
                            <input
                              type="text"
                              value={formData.subtitle}
                              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="예: 총 상금 5천만원"
                              required
                            />
                          </div>

                          {/* 영어 부제목 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              English Subtitle *
                            </label>
                            <input
                              type="text"
                              value={formData.subtitleEn}
                              onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="e.g. Total Prize: 50M KRW"
                              required
                            />
                          </div>
                        </div>

                        {/* 링크 */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            링크 URL *
                          </label>
                          <input
                            type="url"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="https://..."
                            required
                          />
                        </div>

                        {/* 이미지 URL */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <ImageIcon className="w-4 h-4 inline mr-1" />
                            이미지 URL (선택)
                          </label>
                          <input
                            type="url"
                            value={formData.imageUrl || ''}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="https://... (선택사항)"
                          />
                        </div>

                        {/* CTA 버튼 텍스트 선택 */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            CTA 버튼 텍스트
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {ctaStyles.map((cta) => (
                              <button
                                key={cta.name}
                                type="button"
                                onClick={() => setCtaText(cta)}
                                className={`px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all ${
                                  ctaText.name === cta.name
                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                              >
                                {language === 'ko' ? cta.name : cta.nameEn}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 디자인 탭 */}
                    {activeTab === 'design' && (
                      <div className="space-y-6">
                        {/* 배경 타입 선택 */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            배경 스타일
                          </label>
                          <div className="flex gap-3 mb-5">
                            <button
                              type="button"
                              onClick={() => setBackgroundType('gradient')}
                              className={`px-5 py-2.5 rounded-xl font-medium border-2 transition-all ${
                                backgroundType === 'gradient'
                                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                            >
                              그라데이션
                            </button>
                            <button
                              type="button"
                              onClick={() => setBackgroundType('solid')}
                              className={`px-5 py-2.5 rounded-xl font-medium border-2 transition-all ${
                                backgroundType === 'solid'
                                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                            >
                              단색
                            </button>
                            <button
                              type="button"
                              onClick={() => setBackgroundType('custom')}
                              className={`px-5 py-2.5 rounded-xl font-medium border-2 transition-all ${
                                backgroundType === 'custom'
                                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                            >
                              커스텀
                            </button>
                          </div>

                          {/* 그라데이션 선택 */}
                          {backgroundType === 'gradient' && (
                            <div className="grid grid-cols-4 gap-3">
                              {predefinedGradients.map(gradient => (
                                <button
                                  key={gradient.value}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, backgroundColor: gradient.value })}
                                  className={`h-20 rounded-xl ${gradient.value} relative transition-all ${
                                    formData.backgroundColor === gradient.value
                                      ? 'ring-2 ring-purple-500 ring-offset-2'
                                      : 'hover:scale-105'
                                  }`}
                                >
                                  {formData.backgroundColor === gradient.value && (
                                    <Check className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* 단색 선택 */}
                          {backgroundType === 'solid' && (
                            <div className="grid grid-cols-4 gap-3">
                              {solidColors.map(color => (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, backgroundColor: color.value })}
                                  className={`h-20 rounded-xl ${color.value} relative transition-all ${
                                    formData.backgroundColor === color.value
                                      ? 'ring-2 ring-purple-500 ring-offset-2'
                                      : 'hover:scale-105'
                                  }`}
                                >
                                  {formData.backgroundColor === color.value && (
                                    <Check className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* 커스텀 CSS */}
                          {backgroundType === 'custom' && (
                            <div>
                              <input
                                type="text"
                                value={customBackground}
                                onChange={(e) => setCustomBackground(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="예: bg-gradient-to-r from-cyan-500 to-blue-500"
                              />
                              <p className="mt-2 text-xs text-gray-500">
                                Tailwind CSS 클래스를 입력하세요
                              </p>
                            </div>
                          )}
                        </div>

                        {/* 텍스트 색상 */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            텍스트 색상
                          </label>
                          <div className="flex gap-3">
                            {textColors.map(color => (
                              <button
                                key={color.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, textColor: color.value })}
                                className={`px-5 py-2.5 rounded-xl font-medium border-2 transition-all ${
                                  formData.textColor === color.value
                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {color.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 설정 탭 */}
                    {activeTab === 'settings' && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                          {/* 위치 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              표시 위치
                            </label>
                            <select
                              value={formData.position}
                              onChange={(e) => setFormData({ ...formData, position: e.target.value as 'left' | 'right' | 'both' })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                              <option value="both">양쪽 모두</option>
                              <option value="left">왼쪽만</option>
                              <option value="right">오른쪽만</option>
                            </select>
                          </div>

                          {/* 링크 타겟 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              링크 타겟
                            </label>
                            <select
                              value={formData.linkTarget}
                              onChange={(e) => setFormData({ ...formData, linkTarget: e.target.value as '_blank' | '_self' })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                              <option value="_blank">새 탭에서 열기</option>
                              <option value="_self">현재 탭에서 열기</option>
                            </select>
                          </div>

                          {/* 시작일 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              시작일 (선택)
                            </label>
                            <input
                              type="date"
                              value={formData.startDate || ''}
                              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                          </div>

                          {/* 종료일 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              종료일 (선택)
                            </label>
                            <input
                              type="date"
                              value={formData.endDate || ''}
                              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                          </div>

                          {/* 우선순위 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              우선순위
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={formData.priority}
                              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              required
                            />
                            <p className="mt-1 text-xs text-gray-500">낮을수록 먼저 표시</p>
                          </div>
                        </div>

                        {/* 활성화 체크박스 */}
                        <div className="flex items-center gap-3 pt-2">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-5 h-5 text-purple-500 focus:ring-purple-500 rounded"
                          />
                          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            {language === 'ko' ? '배너 활성화' : 'Active Banner'}
                          </label>
                        </div>
                      </div>
                    )}

                    {/* 버튼 */}
                    <div className="flex gap-3 pt-6 border-t border-gray-100">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
                      >
                        <Save className="w-4 h-4" />
                        {language === 'ko' ? '저장' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                      >
                        <X className="w-4 h-4" />
                        {language === 'ko' ? '취소' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* 실시간 미리보기 섹션 */}
                <div className="w-96 p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-gray-900">
                      {language === 'ko' ? '실시간 미리보기' : 'Live Preview'}
                    </h4>
                    <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
                      <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-2 rounded transition-all ${
                          previewMode === 'desktop' 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Monitor className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-2 rounded transition-all ${
                          previewMode === 'mobile' 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Smartphone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 데스크톱 미리보기 */}
                  {previewMode === 'desktop' && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <p className="text-xs text-gray-500 mb-4">데스크톱 사이드 배너 (160px)</p>
                      <div style={{ width: '160px' }} className="mx-auto">
                        <div className={`relative rounded-xl overflow-hidden shadow-lg ${previewBanner.backgroundColor}`}>
                          {/* AD 뱃지 */}
                          <div className="absolute top-2 right-2 z-10">
                            <X className="w-3 h-3 text-white/70" />
                          </div>

                          <div className={`p-4 ${previewBanner.textColor || 'text-white'}`}>
                            {/* 이미지 */}
                            {previewBanner.imageUrl && (
                              <div className="w-full h-20 bg-white/20 rounded-lg mb-3 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-white/50" />
                              </div>
                            )}

                            {/* 제목 */}
                            <h3 className="font-bold text-sm mb-1 leading-tight">
                              {(language === 'ko' ? previewBanner.title : previewBanner.titleEn) ||
                               (language === 'ko' ? '제목을 입력하세요' : 'Enter title')}
                            </h3>

                            {/* 부제목 */}
                            <p className="text-xs opacity-90 mb-3">
                              {(language === 'ko' ? previewBanner.subtitle : previewBanner.subtitleEn) ||
                               (language === 'ko' ? '부제목을 입력하세요' : 'Enter subtitle')}
                            </p>

                            {/* 날짜 */}
                            {previewBanner.endDate && (
                              <div className="text-xs opacity-80 mb-3">
                                {language === 'ko' ? '마감: ' : 'Until: '}
                                {new Date(previewBanner.endDate).toLocaleDateString()}
                              </div>
                            )}

                            {/* CTA 버튼 */}
                            <div className="mt-4">
                              <span className="inline-flex items-center justify-center w-full py-2 px-3 text-xs font-medium bg-black/20 backdrop-blur-sm rounded-lg">
                                {language === 'ko' ? ctaText.name : ctaText.nameEn}
                                {ctaText.icon === 'arrow' && (
                                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 모바일 미리보기 */}
                  {previewMode === 'mobile' && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <p className="text-xs text-gray-500 mb-4">모바일 하단 배너</p>
                      <div className="w-full">
                        <div className={`relative ${previewBanner.backgroundColor} p-3 rounded-lg`}>
                          {/* 닫기 버튼 */}
                          <div className="absolute top-2 right-2 z-10">
                            <X className="w-4 h-4 text-white/70" />
                          </div>

                          <div className={`flex items-center gap-3 ${previewBanner.textColor || 'text-white'}`}>
                            {/* 내용 */}
                            <div className="flex-1">
                              <h3 className="font-bold text-sm">
                                {(language === 'ko' ? previewBanner.title : previewBanner.titleEn) ||
                                 (language === 'ko' ? '제목' : 'Title')}
                              </h3>
                              <p className="text-xs opacity-90">
                                {(language === 'ko' ? previewBanner.subtitle : previewBanner.subtitleEn) ||
                                 (language === 'ko' ? '부제목' : 'Subtitle')}
                              </p>
                            </div>

                            {/* CTA 버튼 */}
                            <span className="px-3 py-1.5 text-xs font-medium bg-black/20 backdrop-blur-sm rounded-lg whitespace-nowrap">
                              {language === 'ko' ? '자세히' : 'More'}
                              <svg className="inline-block ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 배너 목록 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'ko' ? '배너 목록' : 'Banner List'}
              <span className="ml-3 text-sm font-normal text-gray-500">
                ({banners.filter(b => b.isActive).length} / {banners.length} {language === 'ko' ? '활성' : 'active'})
              </span>
            </h3>

            {banners.length === 0 ? (
              <div className="text-center py-12">
                <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === 'ko' ? '등록된 배너가 없습니다.' : 'No banners registered.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {banners.sort((a, b) => a.priority - b.priority).map((banner) => (
                  <div
                    key={banner.id}
                    className={`border rounded-xl p-5 transition-all ${
                      banner.isActive 
                        ? 'border-gray-200 bg-white hover:shadow-md hover:border-purple-200' 
                        : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="font-semibold text-gray-900">
                            {language === 'ko' ? banner.title : banner.titleEn}
                          </h4>
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            banner.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {banner.isActive
                              ? (language === 'ko' ? '활성' : 'Active')
                              : (language === 'ko' ? '비활성' : 'Inactive')
                            }
                          </span>
                          <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            우선순위: {banner.priority}
                          </span>
                          <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                            {banner.position === 'both' ? '양쪽' : banner.position === 'left' ? '왼쪽' : '오른쪽'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {language === 'ko' ? banner.subtitle : banner.subtitleEn}
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>링크: <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 hover:underline">{banner.link}</a></p>
                          {banner.startDate && <p>시작일: {new Date(banner.startDate).toLocaleDateString()}</p>}
                          {banner.endDate && <p>종료일: {new Date(banner.endDate).toLocaleDateString()}</p>}
                        </div>
                      </div>

                      {/* 액션 버튼들 */}
                      <div className="flex items-center gap-1">
                        {/* 우선순위 변경 */}
                        <div className="flex flex-col">
                          <button
                            onClick={() => changePriority(banner, 'up')}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={banner.priority === 1}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => changePriority(banner, 'down')}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 활성화 토글 */}
                        <button
                          onClick={() => toggleActive(banner)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                          title={banner.isActive ? '비활성화' : '활성화'}
                        >
                          {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        {/* 복제 */}
                        <button
                          onClick={() => duplicateBanner(banner)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                          title="복제"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* 수정 */}
                        <button
                          onClick={() => startEdit(banner)}
                          className="p-2 text-blue-600 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* 삭제 */}
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 text-red-600 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
