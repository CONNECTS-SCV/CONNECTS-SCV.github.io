"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export default function BackToListButton() {
  const { t } = useLanguage();

  return (
    <a
      href="/"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 hover:text-gray-900 font-medium"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
           xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
      </svg>
      {t('post.backToList')}
    </a>
  );
}
