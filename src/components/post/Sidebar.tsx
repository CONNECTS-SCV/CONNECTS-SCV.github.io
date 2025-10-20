"use client";

import { useLanguage } from '@/contexts/LanguageContext';

interface Post {
    metadata: {
        title: string;
        description?: string;
        author: string;
        date?: string;
        slug: string;
        tags: string[];
        categories: string[];
        language?: 'ko' | 'en';
    };
    excerpt: string;
    author: {
        name: string;
        title: string;
        department: string;
    } | null;
}

interface SidebarProps {
    posts: Post[];
}

export function Sidebar({ posts }: SidebarProps) {
    const { t, language } = useLanguage();

    // 현재 언어에 맞는 포스트만 필터링
    const filteredPosts = posts.filter(post => {
        const postLanguage = post.metadata.language || 'ko';
        return postLanguage === language;
    });

    // 최근 포스트 5개를 인기 포스트로 표시
    // const popularPosts = [...filteredPosts]
    //     .sort((a, b) => {
    //         const dateA = new Date(a.metadata.date || '');
    //         const dateB = new Date(b.metadata.date || '');
    //         return dateB.getTime() - dateA.getTime();
    //     })
    //     .slice(0, 5);

    // 모든 태그 추출 및 빈도 계산
    const tagCount = new Map<string, number>();
    filteredPosts.forEach(post => {
        if (Array.isArray(post.metadata.tags)) {
            post.metadata.tags.forEach(tag => {
                tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
            });
        }
    });

    // 태그를 빈도순으로 정렬
    const sortedTags = Array.from(tagCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30) // 상위 30개만 표시
        .map(([tag]) => tag);

    // 카테고리별 포스트 그룹화 (아티클 시리즈)
    const categorizedPosts = new Map<string, Post[]>();
    filteredPosts.forEach(post => {
        if (Array.isArray(post.metadata.categories)) {
            post.metadata.categories.forEach(category => {
                if (!categorizedPosts.has(category)) {
                    categorizedPosts.set(category, []);
                }
                categorizedPosts.get(category)?.push(post);
            });
        }
    });

    // 카테고리별 포스트 수가 많은 순으로 정렬
    // const topCategories = Array.from(categorizedPosts.entries())
    //     .sort((a, b) => b[1].length - a[1].length)
    //     .slice(0, 4); // 상위 4개 카테고리만 표시

    return (
        <div className="w-full sticky">
            {/* 인기있는 글 */}
            {/*<div className="px-4 xl:px-6 pt-1">*/}
            {/*    <h3 className="text-xs font-bold text-gray-500 mb-4">인기있는 글</h3>*/}
            {/*    <div className="space-y-6">*/}
            {/*        {popularPosts.map((post) => (*/}
            {/*            <a*/}
            {/*                key={post.metadata.slug}*/}
            {/*                href={`/post/${post.metadata.slug}`}*/}
            {/*                className="block cursor-pointer hover:opacity-80"*/}
            {/*            >*/}
            {/*                <p className="text-sm font-bold text-gray-900 leading-normal mb-2 line-clamp-2">*/}
            {/*                    {post.metadata.title}*/}
            {/*                </p>*/}
            {/*                <div className="flex items-center gap-2 text-xs text-gray-600">*/}
            {/*                    <span>{post.author?.name || post.metadata.author}</span>*/}
            {/*                    <span>·</span>*/}
            {/*                    <span>{post.metadata.date}</span>*/}
            {/*                </div>*/}
            {/*            </a>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* 카테고리별 시리즈 */}
            {/*{topCategories.length > 0 && (*/}
            {/*    <div className="px-4 xl:px-6 pt-8">*/}
            {/*        <h3 className="text-xs font-bold text-gray-500 mb-6">카테고리</h3>*/}
            {/*        <div className="space-y-4">*/}
            {/*            {topCategories.map(([category, categoryPosts]) => (*/}
            {/*                <div*/}
            {/*                    key={category}*/}
            {/*                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"*/}
            {/*                >*/}
            {/*                    <div className="flex-1">*/}
            {/*                        <h4 className="text-sm font-bold text-gray-700 capitalize mb-1">*/}
            {/*                            {category}*/}
            {/*                        </h4>*/}
            {/*                        <p className="text-xs text-gray-500">*/}
            {/*                            {categoryPosts.length}개 포스트*/}
            {/*                        </p>*/}
            {/*                    </div>*/}
            {/*                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">*/}
            {/*                        <span className="text-sm font-bold text-blue-600">*/}
            {/*                            {categoryPosts.length}*/}
            {/*                        </span>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* 태그 클라우드 */}
            {sortedTags.length > 0 && (
                <div className="px-2 pb-10 pt-12">
                    <h3 className="text-xs font-bold text-gray-500 mb-6">{t('sidebar.tags')}</h3>
                    <div className="flex flex-wrap gap-2">
                        {sortedTags.map((tag) => (
                            <button
                                key={tag}
                                className="px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <span className="text-xs font-medium text-gray-600">
                                    #{tag}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 통계 정보 */}
            {/*<div className="px-4 xl:px-6 pt-4 pb-6 border-t border-gray-100">*/}
            {/*    <h3 className="text-xs font-bold text-gray-500 mb-4">통계</h3>*/}
            {/*    <div className="grid grid-cols-2 gap-3">*/}
            {/*        <div className="text-center p-3 bg-gray-50 rounded-lg">*/}
            {/*            <p className="text-2xl font-bold text-gray-800">{posts.length}</p>*/}
            {/*            <p className="text-xs text-gray-500 mt-1">전체 포스트</p>*/}
            {/*        </div>*/}
            {/*        <div className="text-center p-3 bg-gray-50 rounded-lg">*/}
            {/*            <p className="text-2xl font-bold text-gray-800">{tagCount.size}</p>*/}
            {/*            <p className="text-xs text-gray-500 mt-1">전체 태그</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}