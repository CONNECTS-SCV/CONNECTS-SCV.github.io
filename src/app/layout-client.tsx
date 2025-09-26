"use client";

import { SearchProvider } from "@/components/SearchProvider";
import type { BlogPost } from "@/lib/markdown";

interface LayoutClientProps {
  children: React.ReactNode;
  posts: BlogPost[];
}

export default function LayoutClient({ children, posts }: LayoutClientProps) {
  return (
    <>
      <div className="w-full fixed top-0 z-50 bg-white">
        <div className="w-full max-w-[1140px] mx-auto">
          <SearchProvider posts={posts} />
        </div>
      </div>
      <div className="w-full h-full min-h-screen mx-auto flex flex-col items-center pt-[80px]">
        <div className="w-full max-w-[1140px]">{children}</div>
      </div>
    </>
  );
}