"use client";

import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';

interface HeaderWithLanguageToggleProps {
  pairedPost?: string;
}

export default function HeaderWithLanguageToggle({ pairedPost }: HeaderWithLanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageToggle = () => {
    console.log('Language toggle clicked');
    console.log('Current language:', language);
    console.log('Paired post:', pairedPost);
    
    const newLanguage = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLanguage);
    
    if (pairedPost) {
      // 대응하는 언어 버전 글이 있으면 해당 페이지로 이동 (히스토리 대체)
      console.log('Replacing with:', `/post/${pairedPost}`);
      router.replace(`/post/${pairedPost}`);
    } else {
      // 대응하는 언어 버전 글이 없으면 메인 페이지로 이동 (히스토리 대체)
      console.log('No paired post, replacing with home');
      router.replace('/');
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleLanguageToggle}
        className="bg-white shadow-lg rounded-lg px-4 py-2 text-sm font-bold hover:shadow-xl transition-shadow"
        aria-label="Toggle language"
      >
        {language === 'ko' ? 'EN' : 'KO'}
      </button>
    </div>
  );
}