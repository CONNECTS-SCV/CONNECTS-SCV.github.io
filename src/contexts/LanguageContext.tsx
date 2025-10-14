"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('ko');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount, or detect from browser
  useEffect(() => {
    let finalLanguage: Language = 'ko';

    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'ko' || savedLanguage === 'en') {
      finalLanguage = savedLanguage;
    } else {
      // Detect language from browser
      const browserLang = navigator.language.toLowerCase();
      finalLanguage = browserLang.startsWith('ko') ? 'ko' : 'en';
      localStorage.setItem('language', finalLanguage);
    }

    setLanguageState(finalLanguage);
    document.documentElement.lang = finalLanguage;
    setMounted(true);
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // Update html lang attribute
    document.documentElement.lang = lang;
  };

  // Translation function with parameter support
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language]?.[key] || key;

    // Replace parameters like {count} with actual values
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, String(params[param]));
      });
    }

    return translation;
  };

  // Don't render children until mounted to prevent flash of incorrect language content
  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translations object
const translations: Record<Language, Record<string, string>> = {
  ko: {
    // Header
    'header.curie': 'CURIE',
    'header.about': 'About Us',
    'header.subscribe': '구독하기',
    'header.recruit': '채용 바로가기',

    // Navigation
    'nav.home': '홈',
    'nav.analysis': '분석',
    'nav.release': '릴리즈',
    'nav.about': '소개',

    // Categories
    'category.all': '전체',
    'category.protein': '단백질',
    'category.ligand': '리간드',
    'category.interaction': '상호작용',
    'category.docking': '도킹',
    'category.prediction': '예측',
    'category.analysis': '분석 모델',
    'category.updates': '업데이트',
    'category.features': '기능',
    'category.feature': '기능 개선',
    'category.announcements': '공지',
    'category.release': '릴리즈 노트',
    'category.academic': '학술',

    // Post
    'post.readMore': '더 읽기',
    'post.author': '작성자',
    'post.date': '날짜',
    'post.tags': '태그',
    'post.tag': '태그',
    'post.categories': '카테고리',
    'post.category': '카테고리',
    'post.relatedPosts': '관련 포스트',
    'post.noPostsFound': '포스트를 찾을 수 없습니다',
    'post.backToList': '목록으로 돌아가기',
    'post.tryItOut': '아래 버튼을 통해 직접 사용해보세요.',
    'post.goToTool': '사용하러 가기',
    'post.totalPosts': '총 {count}개의 포스트',
    'post.noPosts': '해당 카테고리에 포스트가 없습니다.',

    // Sorting
    'sort.latest': '최신순',
    'sort.oldest': '오래된순',
    'sort.titleAsc': '제목순 (ㄱ-ㅎ)',
    'sort.titleDesc': '제목순 (ㅎ-ㄱ)',
    'sort.authorAsc': '작성자순 (ㄱ-ㅎ)',
    'sort.authorDesc': '작성자순 (ㅎ-ㄱ)',

    // Sidebar
    'sidebar.tags': '태그',
    'sidebar.allTags': '모든 태그',

    // Comments
    'comments.title': '댓글',
    'comments.writeComment': '댓글을 작성해주세요',
    'comments.submit': '댓글 작성',
    'comments.submitReply': '답글 작성',
    'comments.submitting': '전송 중...',
    'comments.cancel': '취소',
    'comments.reply': '답글',
    'comments.replyTo': '답글 달기',
    'comments.replyingTo': '님에게 답글 작성 중',
    'comments.edit': '수정',
    'comments.delete': '삭제',
    'comments.noComments': '첫 번째 댓글을 남겨보세요!',
    'comments.placeholder': '댓글을 작성해주세요... (Ctrl+Enter로 전송)',
    'comments.placeholderReply': '답글을 작성해주세요... (Ctrl+Enter로 전송)',
    'comments.authorNickname': '작성자 닉네임',
    'comments.changeName': '다시 뽑기',
    'comments.warning': '⚠️ 작성된 댓글은 수정/삭제가 불가능합니다',
    'comments.loading': '댓글을 불러오는 중...',
    'comments.localMode': '로컬 모드로 작동 중 (다른 사용자와 공유되지 않음)',
    'comments.justNow': '방금 전',
    'comments.minutesAgo': '분 전',
    'comments.hoursAgo': '시간 전',
    'comments.daysAgo': '일 전',
    'comments.replyBadge': '답글',
    'comments.errorLoading': '댓글을 불러오는데 실패했습니다. 로컬 모드로 전환합니다.',
    'comments.errorPosting': '댓글 작성에 실패했습니다. 다시 시도해주세요.',

    // Search
    'search.placeholder': '검색...',
    'search.noResults': '검색 결과가 없습니다',

    // Footer
    'footer.copyright': '© 2024 CONNECTS. All rights reserved.',

    // Common
    'common.loading': '로딩 중...',
    'common.error': '오류가 발생했습니다',

    // Banner
    'banner.title.word1': '기술로',
    'banner.title.word2': '만드는',
    'banner.title.word3': '더 나은',
    'banner.title.word4': '미래',
    'banner.subtitle': '새로운 것과 다음을 발견하세요',
    'banner.tag1': 'AI 연구',
    'banner.tag2': '바이오테크',
    'banner.tag3': '혁신',
  },
  en: {
    // Header
    'header.curie': 'CURIE',
    'header.about': 'About Us',
    'header.subscribe': 'Subscribe',
    'header.recruit': 'Careers',

    // Navigation
    'nav.home': 'Home',
    'nav.analysis': 'Analysis',
    'nav.release': 'Release',
    'nav.about': 'About',

    // Categories
    'category.all': 'All',
    'category.protein': 'Protein',
    'category.ligand': 'Ligand',
    'category.interaction': 'Interaction',
    'category.docking': 'Docking',
    'category.prediction': 'Prediction',
    'category.analysis': 'Analysis Models',
    'category.updates': 'Updates',
    'category.features': 'Features',
    'category.feature': 'Feature Improvements',
    'category.announcements': 'Announcements',
    'category.release': 'Release Notes',
    'category.academic': 'Academic',

    // Post
    'post.readMore': 'Read More',
    'post.author': 'Author',
    'post.date': 'Date',
    'post.tags': 'Tags',
    'post.tag': 'Tags',
    'post.categories': 'Categories',
    'post.category': 'Category',
    'post.relatedPosts': 'Related Posts',
    'post.noPostsFound': 'No posts found',
    'post.backToList': 'Back to List',
    'post.tryItOut': 'Try it using the link below.',
    'post.goToTool': 'Go to Tool',
    'post.totalPosts': 'Total {count} posts',
    'post.noPosts': 'No posts in this category.',

    // Sorting
    'sort.latest': 'Latest',
    'sort.oldest': 'Oldest',
    'sort.titleAsc': 'Title (A-Z)',
    'sort.titleDesc': 'Title (Z-A)',
    'sort.authorAsc': 'Author (A-Z)',
    'sort.authorDesc': 'Author (Z-A)',

    // Sidebar
    'sidebar.tags': 'Tags',
    'sidebar.allTags': 'All Tags',

    // Comments
    'comments.title': 'Comments',
    'comments.writeComment': 'Write a comment',
    'comments.submit': 'Submit',
    'comments.submitReply': 'Submit Reply',
    'comments.submitting': 'Submitting...',
    'comments.cancel': 'Cancel',
    'comments.reply': 'Reply',
    'comments.replyTo': 'Reply',
    'comments.replyingTo': 'Replying to',
    'comments.edit': 'Edit',
    'comments.delete': 'Delete',
    'comments.noComments': 'Be the first to comment!',
    'comments.placeholder': 'Write your comment... (Ctrl+Enter to submit)',
    'comments.placeholderReply': 'Write your reply... (Ctrl+Enter to submit)',
    'comments.authorNickname': 'Author Nickname',
    'comments.changeName': 'Change Name',
    'comments.warning': '⚠️ Comments cannot be edited or deleted',
    'comments.loading': 'Loading comments...',
    'comments.localMode': 'Local mode (not shared with others)',
    'comments.justNow': 'Just now',
    'comments.minutesAgo': 'min ago',
    'comments.hoursAgo': 'hr ago',
    'comments.daysAgo': 'd ago',
    'comments.replyBadge': 'Reply',
    'comments.errorLoading': 'Failed to load comments. Switching to local mode.',
    'comments.errorPosting': 'Failed to post comment. Please try again.',

    // Search
    'search.placeholder': 'Search...',
    'search.noResults': 'No results found',

    // Footer
    'footer.copyright': '© 2024 CONNECTS. All rights reserved.',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',

    // Banner
    'banner.title.word1': 'Building',
    'banner.title.word2': 'a Better',
    'banner.title.word3': 'Future',
    'banner.title.word4': 'with Technology',
    'banner.subtitle': 'Discover what\'s new and what\'s next',
    'banner.tag1': 'AI Research',
    'banner.tag2': 'Biotech',
    'banner.tag3': 'Innovation',
  }
};
