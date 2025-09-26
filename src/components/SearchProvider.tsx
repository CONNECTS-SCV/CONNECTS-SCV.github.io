"use client";

import { useState, useEffect } from "react";
import { SearchModal } from "./SearchModal";
import Header from "./layout/Header";
import type { BlogPost } from "@/lib/markdown";

interface SearchProviderProps {
  posts: BlogPost[];
}

export function SearchProvider({ posts }: SearchProviderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    let lastShiftTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift 두번 감지
      if (e.key === "Shift") {
        const currentTime = Date.now();
        if (currentTime - lastShiftTime < 400) {
          // 400ms 이내에 두번 누르면 실행
          setIsSearchOpen(true);
          lastShiftTime = 0;
        } else {
          lastShiftTime = currentTime;
        }
      }

      // Cmd/Ctrl + K 단축키
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Header onSearchClick={() => setIsSearchOpen(true)} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
      />
    </>
  );
}