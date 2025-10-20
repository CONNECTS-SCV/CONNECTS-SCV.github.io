"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur(); // 클릭 후 포커스 제거
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="font-bold text-sm px-3 py-2 hover:bg-gray-100 transition-colors rounded-md select-none focus:outline-none"
      aria-label="Toggle language"
    >
      {language === 'ko' ? 'EN' : 'KO'}
    </button>
  );
}
