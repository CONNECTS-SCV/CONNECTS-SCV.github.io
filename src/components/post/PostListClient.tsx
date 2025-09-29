"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CategoryFilter, CategoryFilterMobile } from "./CategoryFilter";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface Post {
    metadata: {
        title: string;
        description?: string;
        author: string;
        date?: string;
        slug: string;
        tags: string[];
        categories: string[];
        thumbnail?: string;
    };
    excerpt: string;
    author: {
        name: string;
        title: string;
        department: string;
    } | null;
}

interface PostListClientProps {
    initialPosts: Post[];
}

const POSTS_PER_PAGE = 10;

type SortOption = "latest" | "oldest" | "titleAsc" | "titleDesc" | "authorAsc" | "authorDesc";

const sortOptions: { value: SortOption; label: string }[] = [
    { value: "latest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
    { value: "titleAsc", label: "제목순 (ㄱ-ㅎ)" },
    { value: "titleDesc", label: "제목순 (ㅎ-ㄱ)" },
    { value: "authorAsc", label: "작성자순 (ㄱ-ㅎ)" },
    { value: "authorDesc", label: "작성자순 (ㅎ-ㄱ)" },
];

export function PostListClient({ initialPosts }: PostListClientProps) {
    const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
    const [, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<SortOption>("latest");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 드롭다운 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 정렬된 포스트
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        switch (sortOrder) {
            case "latest":
                return new Date(b.metadata.date || "").getTime() - new Date(a.metadata.date || "").getTime();
            case "oldest":
                return new Date(a.metadata.date || "").getTime() - new Date(b.metadata.date || "").getTime();
            case "titleAsc":
                return (a.metadata.title || "").localeCompare(b.metadata.title || "", "ko");
            case "titleDesc":
                return (b.metadata.title || "").localeCompare(a.metadata.title || "", "ko");
            case "authorAsc":
                return (a.author?.name || "").localeCompare(b.author?.name || "", "ko");
            case "authorDesc":
                return (b.author?.name || "").localeCompare(a.author?.name || "", "ko");
            default:
                return 0;
        }
    });

    // 페이지네이션 계산
    const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPosts = sortedPosts.slice(startIndex, endIndex);

    // 표시할 페이지 번호 계산
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // 최대 표시할 페이지 수

        let start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + maxVisible - 1);

        // 시작 페이지 조정
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1); // 카테고리 변경시 첫 페이지로 이동

        if (category === "all") {
            setFilteredPosts(initialPosts);
        } else {
            const filtered = initialPosts.filter(post => {
                // categories 배열에 선택된 카테고리가 포함되어 있는지 확인
                return post.metadata.categories?.includes(category);
            });
            setFilteredPosts(filtered);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // 페이지 변경시 스크롤을 상단으로
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* 카테고리 필터 - 데스크톱 */}
            <div className="hidden lg:block sticky top-0 z-10 bg-white mb-4">
                <CategoryFilter onCategoryChange={handleCategoryChange} />
            </div>

            {/* 카테고리 필터 - 모바일 */}
            <CategoryFilterMobile
                onCategoryChange={handleCategoryChange}
                className="lg:hidden sticky top-0 z-10 mb-4"
            />

            {/* 정렬 선택기 */}
            <div className="flex justify-between items-center mb-4">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-all"
                    >
                        <span>{sortOptions.find(opt => opt.value === sortOrder)?.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSortOrder(option.value);
                                        setIsDropdownOpen(false);
                                        setCurrentPage(1);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                                        sortOrder === option.value
                                            ? "bg-gray-100 font-semibold text-gray-900"
                                            : "text-gray-700"
                                    } first:rounded-t-lg last:rounded-b-lg`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="text-sm text-gray-500">
                    총 {filteredPosts.length}개의 포스트
                </div>
            </div>

            {/* 포스트 목록 */}
            <div className="min-h-[600px]">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        해당 카테고리에 포스트가 없습니다.
                    </div>
                ) : (
                    <>
                        {currentPosts.map((post) => (
                            <div key={post.metadata.slug} className="border-b border-gray-100 last:border-b-0">
                                <Link
                                    href={`/post/${post.metadata.slug}`}
                                    className="flex flex-col sm:flex-row justify-between items-start gap-10 py-6 cursor-pointer hover:opacity-80"
                                >
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <h4 className="text-base lg:text-lg font-bold mb-2 break-words">
                                            {String(post.metadata.title || 'Untitled')}
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 break-words">
                                            {String(post.excerpt || '')}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                            <span>{String(post.metadata.date || 'No date')}</span>
                                            {post.author?.name && (
                                                <>
                                                    <span>·</span>
                                                    <span>{String(post.author.name)}</span>
                                                </>
                                            )}
                                            {post.metadata.tags && post.metadata.tags.length > 0 && (
                                                <>
                                                    <span>·</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {post.metadata.tags.slice(0, 3).map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {post.metadata.tags.length > 3 && (
                                                            <span className="text-gray-400">+{post.metadata.tags.length - 3}</span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <img
                                        src={post.metadata.thumbnail || "/image/default.webp"}
                                        alt={String(post.metadata.title || 'Post') + " thumbnail"}
                                        className="w-full sm:w-32 h-24 sm:h-20 rounded-lg object-cover flex-shrink-0"
                                    />
                                </Link>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-8">
                    {/* 이전 페이지 버튼 */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* 페이지 번호들 */}
                    <div className="flex items-center gap-1">
                        {/* 첫 페이지 */}
                        {getPageNumbers()[0] > 1 && (
                            <>
                                <button
                                    onClick={() => handlePageChange(1)}
                                    className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 text-sm font-medium"
                                >
                                    1
                                </button>
                                {getPageNumbers()[0] > 2 && (
                                    <span className="px-1 text-gray-400">...</span>
                                )}
                            </>
                        )}

                        {/* 중간 페이지들 */}
                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                                    currentPage === page
                                        ? 'bg-gray-900 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* 마지막 페이지 */}
                        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                            <>
                                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                                    <span className="px-1 text-gray-400">...</span>
                                )}
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 text-sm font-medium"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    {/* 다음 페이지 버튼 */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </>
    );
}