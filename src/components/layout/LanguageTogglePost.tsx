"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LanguageTogglePostProps {
  pairedPost?: string;
  currentSlug: string;
}

export default function LanguageTogglePost({ pairedPost, currentSlug }: LanguageTogglePostProps) {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const toggleLanguage = async () => {
    setIsLoading(true);
    const newLanguage = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLanguage);
    
    if (pairedPost) {
      // 대응하는 언어 버전 글이 있으면 해당 페이지로 이동 (히스토리 대체)
      router.replace(`/post/${pairedPost}`);
    } else {
      // 대응하는 언어 버전 글이 없으면 메인 페이지로 이동 (히스토리 대체)
      router.replace('/');
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isLoading}
      className="font-bold text-sm px-3 py-2 hover:bg-gray-100 transition-colors rounded-md disabled:opacity-50"
      aria-label="Toggle language"
    >
      {isLoading ? '...' : (language === 'ko' ? 'EN' : 'KO')}
    </button>
  );
}