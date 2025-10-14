"use client";

import { useLanguage } from '@/contexts/LanguageContext';

interface PostMetadataProps {
  categories?: string[];
  tags?: string[];
  date: string;
  authorName: string;
}

export default function PostMetadata({ categories, tags, date, authorName }: PostMetadataProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
        <span>{date}</span>
        <span>·</span>
        <span>{authorName}</span>
      </div>

      {/* Categories */}
      {Array.isArray(categories) && categories.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[70px]">
            {t('post.category')}
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category: string) => (
              <span
                key={category}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium border border-blue-200"
              >
                {t(`category.${category}`)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[70px]">
            {t('post.tag')}
          </span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-gray-50 text-gray-600 px-3 py-1 rounded-md text-sm border border-gray-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
