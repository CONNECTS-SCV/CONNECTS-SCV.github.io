import { Metadata } from 'next';
import { PostList } from "@/components/post";
import { AnimatedBanner } from "@/components/home/AnimatedBanner";

export const metadata: Metadata = {
  title: 'Curieus Tech Blog - AI 구조 생물학 기술 블로그',
  description: 'AI 기반 구조 생물학 분석 플랫폼 Curieus의 기술 블로그입니다. 단백질 구조 예측, 약물 발견, 분자 동역학 시뮬레이션 등의 최신 기술을 공유합니다.',
  keywords: 'AI, 구조생물학, 단백질, 약물발견, AlphaFold, Curie, Twin, Pensive, Curieus',
  openGraph: {
    title: 'Curieus Tech Blog',
    description: 'AI 기반 구조 생물학 분석 플랫폼 Curieus의 기술 블로그',
    type: 'website',
    siteName: 'Curieus Blog',
    locale: 'ko_KR',
    url: 'https://connects-scv.github.io',
    images: [
      {
        url: '/image/curieus_tech.webp',
        width: 1200,
        height: 630,
        alt: 'Curieus Tech Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curieus Tech Blog',
    description: 'AI 기반 구조 생물학 분석 플랫폼 Curieus의 기술 블로그',
    images: ['/image/curieus_tech.webp'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function HomePage() {
  return (
    <div className="w-full max-w-[1140px] mx-auto">
      <AnimatedBanner />
      <PostList />
    </div>
  );
}
