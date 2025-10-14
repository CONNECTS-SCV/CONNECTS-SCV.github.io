"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '../ui/button/button';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className="font-bold text-sm px-3 py-2 hover:bg-gray-100 transition-colors"
      aria-label="Toggle language"
    >
      {language === 'ko' ? 'EN' : 'KO'}
    </Button>
  );
}
