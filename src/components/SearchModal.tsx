"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { BlogPost } from "@/lib/markdown";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
}

export function SearchModal({ isOpen, onClose, posts }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fuse.js 설정
  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: "metadata.title", weight: 0.4 },
          { name: "metadata.description", weight: 0.3 },
          { name: "content", weight: 0.2 },
          { name: "metadata.tags", weight: 0.1 },
        ],
        threshold: 0.3,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [posts]
  );

  // 검색 결과
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results = fuse.search(searchQuery);
    return results.slice(0, 6).map((result) => result.item);
  }, [searchQuery, fuse]);

  // 모달이 열릴 때 포커스 설정 및 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      setSearchQuery("");
      setSelectedIndex(0);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (searchResults[selectedIndex] && searchResults[selectedIndex].metadata.slug) {
            router.push(`/post/${searchResults[selectedIndex].metadata.slug}`);
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close search"
      />

      {/* 검색 모달 */}
      <div className="relative flex items-start justify-center pt-[15vh] px-4">
        <div className="w-full max-w-[680px] bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">

          {/* 검색 입력 영역 */}
          <div className="relative">
            <div className="flex items-center px-6 py-5 border-b border-gray-100">
              <svg
                className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="flex-1 text-[17px] font-medium outline-none placeholder-gray-400 text-gray-900"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded">
                ESC
              </kbd>
            </div>
          </div>

          {/* 검색 결과 영역 */}
          <div className="max-h-[400px] overflow-y-auto overscroll-contain">
            {searchQuery ? (
              searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((post, index) => (
                    <button
                      key={`search-result-${post.metadata.slug || index}`}
                      onClick={() => {
                        if (post.metadata.slug) {
                          router.push(`/post/${post.metadata.slug}`);
                          onClose();
                        }
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-6 py-4 flex items-start gap-3 text-left transition-all duration-150 ${
                        index === selectedIndex
                          ? "bg-gray-50"
                          : "hover:bg-gray-50/50"
                      }`}
                    >
                      {/* 아이콘 영역 */}
                      <div className={`mt-0.5 p-2 rounded-lg transition-colors ${
                        index === selectedIndex
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>

                      {/* 콘텐츠 영역 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-[15px] text-gray-900 break-keep">
                            {post.metadata.title}
                          </h3>
                          {index === selectedIndex && (
                            <svg
                              className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </div>

                        <p className="mt-1 text-[13px] text-gray-500 line-clamp-2 break-keep">
                          {post.metadata.description}
                        </p>

                        {post.metadata.tags && post.metadata.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {post.metadata.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={`${post.metadata.slug || index}-tag-${tag}-${tagIndex}`}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-medium text-gray-600"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.metadata.tags.length > 3 && (
                              <span className="inline-flex items-center text-[11px] text-gray-400">
                                +{post.metadata.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    검색 결과가 없습니다
                  </p>
                  <p className="text-sm text-gray-500">
                    다른 검색어를 입력해보세요
                  </p>
                </div>
              )
            ) : (
              /* 초기 상태 */
              <div className="px-6 py-8">
                <div className="space-y-6">
                  {/* 빠른 실행 */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Quick Actions
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSearchQuery("분석")}
                        className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">분석 모델 검색</span>
                      </button>
                      <button
                        onClick={() => setSearchQuery("릴리즈")}
                        className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="p-1.5 bg-green-100 text-green-600 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">릴리즈 노트</span>
                      </button>
                    </div>
                  </div>

                  {/* 키보드 단축키 */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Keyboard Shortcuts
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] font-semibold">↑</kbd>
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] font-semibold">↓</kbd>
                        <span>Navigate</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] font-semibold">Enter</kbd>
                        <span>Open</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] font-semibold">Shift</kbd>
                        <span>×2 Search</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-[10px] font-semibold">⌘K</kbd>
                        <span>Search</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}