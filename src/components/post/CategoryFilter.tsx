"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Category {
  id: string;
  value: string;
}

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
  className?: string;
}

export function CategoryFilter({ onCategoryChange, className }: CategoryFilterProps) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const categories: (Category & { label: string })[] = [
    { id: "all", label: t('category.all'), value: "all" },
    { id: "analysis", label: t('category.analysis'), value: "analysis" },
    { id: "release", label: t('category.release'), value: "release" },
    { id: "feature", label: t('category.feature'), value: "feature" },
    { id: "academic", label: t('category.academic'), value: "academic" },
  ];

  // 언어 변경 시 카테고리를 "전체"로 초기화
  useEffect(() => {
    setSelectedCategory("all");
    onCategoryChange("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    updateIndicator(selectedCategory);
  }, [selectedCategory]);

  const updateIndicator = (categoryId: string) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      setIndicatorStyle({
        left: element.offsetLeft,
        width: element.offsetWidth,
      });
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.id);
    onCategoryChange(category.value);
  };

  return (
    <div className={cn("relative bg-white", className)}>
      <div className="relative border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          {categories.map((category) => (
            <div
              key={category.id}
              ref={(el) => {
                categoryRefs.current[category.id] = el;
              }}
              className="relative px-5 py-3 cursor-pointer transition-colors hover:bg-gray-50"
              onClick={() => handleCategoryClick(category)}
            >
              <span
                className={cn(
                  "text-base font-medium transition-all",
                  selectedCategory === category.id
                    ? "text-gray-900 font-bold"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {category.label}
              </span>
            </div>
          ))}
        </div>

        {/* Animated indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ease-out"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </div>
    </div>
  );
}

// Responsive wrapper for mobile
export function CategoryFilterMobile({ onCategoryChange, className }: CategoryFilterProps) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  const categories: (Category & { label: string })[] = [
    { id: "all", label: t('category.all'), value: "all" },
    { id: "analysis", label: t('category.analysis'), value: "analysis" },
    { id: "release", label: t('category.release'), value: "release" },
    { id: "feature", label: t('category.feature'), value: "feature" },
    { id: "academic", label: t('category.academic'), value: "academic" },
  ];

  // 언어 변경 시 카테고리를 "전체"로 초기화
  useEffect(() => {
    setSelectedCategory("all");
    onCategoryChange("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const handleCategoryClick = (category: Category & { label: string }) => {
    setSelectedCategory(category.id);
    onCategoryChange(category.value);
    setIsOpen(false);
  };

  const selectedLabel = categories.find(c => c.id === selectedCategory)?.label || t('category.all');

  return (
    <div className={cn("relative bg-white lg:hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between border-b border-gray-100"
      >
        <span className="text-base font-bold text-gray-900">{selectedLabel}</span>
        <svg
          className={cn(
            "w-5 h-5 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-x border-gray-100 z-10 shadow-lg">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "w-full px-4 py-3 text-left transition-colors hover:bg-gray-50",
                selectedCategory === category.id
                  ? "text-gray-900 font-bold bg-gray-50"
                  : "text-gray-500"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}