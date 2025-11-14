"use client";

import { SearchProvider } from "@/components/SearchProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { BlogPost } from "@/lib/markdown";

interface LayoutClientProps {
  children: React.ReactNode;
  posts: BlogPost[];
}

export default function LayoutClient({ children, posts }: LayoutClientProps) {
  return (
    <LanguageProvider>
      <div className="w-full fixed top-0 z-50 bg-white">
        <div className="w-full max-w-[1140px] mx-auto">
          <SearchProvider posts={posts} />
        </div>
      </div>
      <div className="w-full h-full min-h-screen pt-[80px]">
        <div className="w-full max-w-[1920px] mx-auto flex">
          {/* 왼쪽 배너 공간 - 데스크톱에서만 표시 */}
          <div className="hidden 2xl:flex flex-1 justify-center" id="left-banner-space">
            <div 
              className="flex flex-col gap-5 pt-[200px] sticky top-[100px] transition-all duration-300 ease-out" 
              id="left-banner-container"
              style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'visible' }}
            >
              {/* 배너가 여기에 렌더링됨 */}
            </div>
          </div>
          
          {/* 메인 콘텐츠 */}
          <div className="w-full max-w-[1140px] mx-auto 2xl:mx-0">
            {children}
          </div>
          
          {/* 오른쪽 배너 공간 - 데스크톱에서만 표시 */}
          <div className="hidden 2xl:flex flex-1 justify-center" id="right-banner-space">
            <div 
              className="flex flex-col gap-5 pt-[200px] sticky top-[100px] transition-all duration-300 ease-out" 
              id="right-banner-container"
              style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'visible' }}
            >
              {/* 배너가 여기에 렌더링됨 */}
            </div>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}