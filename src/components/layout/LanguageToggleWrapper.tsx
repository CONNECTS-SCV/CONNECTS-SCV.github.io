"use client";

import { usePathname } from 'next/navigation';
import LanguageToggle from './LanguageToggle';
import LanguageTogglePost from './LanguageTogglePost';

interface LanguageToggleWrapperProps {
  pairedPost?: string;
  currentSlug?: string;
}

export default function LanguageToggleWrapper({ pairedPost, currentSlug }: LanguageToggleWrapperProps) {
  const pathname = usePathname();
  
  // 포스트 페이지인지 확인
  const isPostPage = pathname.startsWith('/post/');
  
  if (isPostPage && currentSlug) {
    return <LanguageTogglePost pairedPost={pairedPost} currentSlug={currentSlug} />;
  }
  
  return <LanguageToggle />;
}