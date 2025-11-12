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
  const [language, setLanguageState] = useState<Language>('en'); // Default to English
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount, or detect from browser
  useEffect(() => {
    let finalLanguage: Language = 'en'; // Default to English

    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'ko' || savedLanguage === 'en') {
      // Use saved language if exists
      finalLanguage = savedLanguage;
    } else {
      // Detect language from browser
      const browserLang = navigator.language.toLowerCase();

      // Only set to Korean if browser language is Korean
      // or if timezone suggests Korea location
      if (browserLang.startsWith('ko')) {
        finalLanguage = 'ko';
      } else {
        // Check timezone for Korea
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone === 'Asia/Seoul') {
          finalLanguage = 'ko';
        } else {
          finalLanguage = 'en'; // Default to English for all other cases
        }
      }

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
    'header.curie': 'Curieus',
    'header.about': 'About Us',
    'header.subscribe': '구독하기',
    'header.recruit': '채용 바로가기',
    'header.search': '검색',

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
    'category.analysis': '모델 아카이브',
    'category.updates': '업데이트',
    'category.features': '기능',
    'category.feature': '기능 개선',
    'category.announcements': '공지',
    'category.release': '릴리즈',
    'category.academic': '프리뷰',

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
    'search.placeholder': '검색어를 입력하세요',
    'search.noResults': '검색 결과가 없습니다',
    'search.tryOtherKeywords': '다른 검색어를 입력해보세요',
    'search.quickActions': 'Quick Actions',
    'search.searchAnalysis': '분석 모델 검색',
    'search.releaseNotes': '릴리즈 노트',
    'search.keyboardShortcuts': 'Keyboard Shortcuts',
    'search.navigate': 'Navigate',
    'search.open': 'Open',
    'search.search': 'Search',

    // Footer
    'footer.copyright': '© 2025 Curieus. All rights reserved.',

    // Common
    'common.loading': '로딩 중...',
    'common.error': '오류가 발생했습니다',

    // Banner
    'banner.mainTitle': '기술로 만드는 더 나은 미래',
    'banner.subtitle': '새로움을 발견하고 미래를 탐구하세요',
    'banner.tag1': 'AI 연구',
    'banner.tag2': '바이오테크',
    'banner.tag3': '혁신',

    // Admin
    'admin.login.title': '관리자 로그인',
    'admin.login.password': '비밀번호',
    'admin.login.placeholder': '관리자 비밀번호를 입력하세요',
    'admin.login.submit': '로그인',
    'admin.login.cancel': '취소',
    'admin.login.error': '비밀번호가 올바르지 않습니다',
    'admin.dashboard.title': '댓글 관리',
    'admin.dashboard.newComments': '새 댓글',
    'admin.dashboard.totalComments': '전체 댓글',
    'admin.dashboard.todayComments': '오늘의 댓글',
    'admin.dashboard.delete': '삭제',
    'admin.dashboard.confirmDelete': '정말 삭제하시겠습니까?',
    'admin.dashboard.search': '댓글 검색',
    'admin.dashboard.searchPlaceholder': '닉네임, 내용으로 검색...',
    'admin.dashboard.noComments': '댓글이 없습니다',
    'admin.dashboard.filter.all': '전체',
    'admin.dashboard.filter.new': '새 댓글',
    'admin.dashboard.filter.today': '오늘',
    'admin.dashboard.logout': '로그아웃',
    'admin.dashboard.backToSite': '사이트로 돌아가기',

    // Subscription
    'subscription.modal.title': '뉴스레터 구독',
    'subscription.modal.description': 'Curieus의 새로운 소식과 업데이트를 이메일로 받아보세요.',
    'subscription.modal.placeholder': '이메일 주소를 입력하세요',
    'subscription.modal.submit': '구독하기',
    'subscription.modal.submitting': '처리중...',
    'subscription.modal.cancel': '취소',
    'subscription.modal.privacy': '구독하시면 개인정보 처리방침에 동의하는 것으로 간주됩니다.',
    'subscription.modal.error.empty': '이메일을 입력해주세요.',
    'subscription.modal.error.invalid': '올바른 이메일 형식을 입력해주세요.',
    'subscription.modal.error.exists': '이미 구독 중인 이메일입니다.',
    'subscription.modal.error.network': '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
    'subscription.modal.error.server': '구독 처리 중 오류가 발생했습니다.',
    'subscription.modal.success': '구독이 완료되었습니다! 감사합니다.',
  },
  en: {
    // Header
    'header.curie': 'Curieus',
    'header.about': 'About Us',
    'header.subscribe': 'Subscribe',
    'header.recruit': 'Careers',
    'header.search': 'Search',

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
    'category.analysis': 'Models',
    'category.updates': 'Updates',
    'category.features': 'Features',
    'category.feature': 'Improvements',
    'category.announcements': 'Announcements',
    'category.release': 'Updates',
    'category.academic': 'Preview',

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
    'search.placeholder': 'Type to search...',
    'search.noResults': 'No results found',
    'search.tryOtherKeywords': 'Try different keywords',
    'search.quickActions': 'Quick Actions',
    'search.searchAnalysis': 'Search Analysis Models',
    'search.releaseNotes': 'Release Notes',
    'search.keyboardShortcuts': 'Keyboard Shortcuts',
    'search.navigate': 'Navigate',
    'search.open': 'Open',
    'search.search': 'Search',

    // Footer
    'footer.copyright': '© 2025 Curieus. All rights reserved.',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',

    // Banner
    'banner.mainTitle': 'Better Future with Technology',
    'banner.subtitle': 'Discover the new and explore the future',
    'banner.tag1': 'AI Research',
    'banner.tag2': 'Biotech',
    'banner.tag3': 'Innovation',

    // Admin
    'admin.login.title': 'Admin Login',
    'admin.login.password': 'Password',
    'admin.login.placeholder': 'Enter admin password',
    'admin.login.submit': 'Login',
    'admin.login.cancel': 'Cancel',
    'admin.login.error': 'Incorrect password',
    'admin.dashboard.title': 'Comment Management',
    'admin.dashboard.newComments': 'New Comments',
    'admin.dashboard.totalComments': 'Total Comments',
    'admin.dashboard.todayComments': 'Today\'s Comments',
    'admin.dashboard.delete': 'Delete',
    'admin.dashboard.confirmDelete': 'Are you sure you want to delete?',
    'admin.dashboard.search': 'Search Comments',
    'admin.dashboard.searchPlaceholder': 'Search by nickname, content...',
    'admin.dashboard.noComments': 'No comments',
    'admin.dashboard.filter.all': 'All',
    'admin.dashboard.filter.new': 'New',
    'admin.dashboard.filter.today': 'Today',
    'admin.dashboard.logout': 'Logout',
    'admin.dashboard.backToSite': 'Back to Site',

    // Subscription
    'subscription.modal.title': 'Newsletter Subscription',
    'subscription.modal.description': 'Get updates and news from Curieus delivered to your email.',
    'subscription.modal.placeholder': 'Enter your email address',
    'subscription.modal.submit': 'Subscribe',
    'subscription.modal.submitting': 'Processing...',
    'subscription.modal.cancel': 'Cancel',
    'subscription.modal.privacy': 'By subscribing, you agree to our privacy policy.',
    'subscription.modal.error.empty': 'Please enter your email.',
    'subscription.modal.error.invalid': 'Please enter a valid email format.',
    'subscription.modal.error.exists': 'This email is already subscribed.',
    'subscription.modal.error.network': 'Network error occurred. Please try again.',
    'subscription.modal.error.server': 'An error occurred during subscription.',
    'subscription.modal.success': 'Subscription completed! Thank you.',
  }
};
