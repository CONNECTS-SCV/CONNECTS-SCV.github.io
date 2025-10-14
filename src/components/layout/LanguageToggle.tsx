"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="font-bold text-sm px-3 py-2 hover:bg-gray-100 transition-colors rounded-md"
      aria-label="Toggle language"
    >
      {language === 'ko' ? 'EN' : 'KO'}
    </button>
  );
}
