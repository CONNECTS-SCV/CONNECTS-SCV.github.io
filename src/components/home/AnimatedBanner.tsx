"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import '@/style/animations.css';

export function AnimatedBanner() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full mb-10 px-4 xl:px-2">
      <div className="relative w-full max-w-[1140px] h-32 sm:h-40 lg:h-[180px] mx-auto rounded-xl lg:rounded-2xl overflow-hidden group bg-white shadow-sm border border-gray-100">
        {/* Animated Gradient Background - Toss Blue Style */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600"
          style={{
            backgroundSize: '200% 200%',
            animationName: 'gradientShift',
            animationDuration: '8s',
            animationTimingFunction: 'ease',
            animationIterationCount: 'infinite',
          }}
        />
        
        {/* Floating Shapes Pattern - Toss Style */}
        <div className="absolute inset-0">
          {/* Floating circles */}
          <div
            className="absolute w-20 sm:w-24 lg:w-32 h-20 sm:h-24 lg:h-32 bg-white/10 rounded-full blur-xl"
            style={{
              top: '-20px',
              left: '10%',
              animationName: 'float',
              animationDuration: '6s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            }}
          />
          <div
            className="absolute w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 bg-white/10 rounded-full blur-2xl"
            style={{
              bottom: '-40px',
              right: '10%',
              animationName: 'float',
              animationDuration: '8s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: '2s',
            }}
          />
          <div
            className="absolute w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-white/15 rounded-full blur-lg"
            style={{
              top: '30%',
              right: '20%',
              animationName: 'float',
              animationDuration: '7s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: '1s',
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center">
          {/* Main Title */}
          <div className="overflow-hidden px-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
              {[
                t('banner.title.word1'),
                t('banner.title.word2'),
                t('banner.title.word3'),
                t('banner.title.word4')
              ].map((word, i) => (
                <span
                  key={i}
                  className="inline-block mx-1"
                  style={{
                    animationName: isVisible ? 'fadeInUp' : 'none',
                    animationDuration: '0.6s',
                    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    animationFillMode: 'forwards',
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="mt-2 sm:mt-3 text-white/90 text-sm sm:text-base lg:text-lg font-light text-center px-4"
            style={{
              animationName: isVisible ? 'fadeInUp' : 'none',
              animationDuration: '0.6s',
              animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              animationFillMode: 'forwards',
              animationDelay: '0.4s',
              opacity: 0,
            }}
          >
            {t('banner.subtitle')}
          </p>

          {/* CTA Tags */}
          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
            {[t('banner.tag1'), t('banner.tag2'), t('banner.tag3')].map((tag, i) => (
              <span
                key={tag}
                className="bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-medium"
                style={{
                  animationName: isVisible ? 'fadeInUp' : 'none',
                  animationDuration: '0.6s',
                  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  animationFillMode: 'forwards',
                  animationDelay: `${0.6 + i * 0.1}s`,
                  opacity: 0,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Subtle Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(255,255,255,.5) 35px,
              rgba(255,255,255,.5) 70px
            )`,
          }}
        />
      </div>
    </div>
  );
}