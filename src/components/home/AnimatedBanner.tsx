"use client";

import { useEffect, useState } from "react";
import '@/style/animations.css';

export function AnimatedBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full mt-6 mb-10 mx-auto flex flex-col items-center">
      <div className="relative w-[1000px] h-[180px] rounded-2xl overflow-hidden group bg-white shadow-sm border border-gray-100">
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
            className="absolute w-32 h-32 bg-white/10 rounded-full blur-xl"
            style={{
              top: '-20px',
              left: '100px',
              animationName: 'float',
              animationDuration: '6s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            }}
          />
          <div 
            className="absolute w-48 h-48 bg-white/10 rounded-full blur-2xl"
            style={{
              bottom: '-40px',
              right: '150px',
              animationName: 'float',
              animationDuration: '8s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: '2s',
            }}
          />
          <div 
            className="absolute w-24 h-24 bg-white/15 rounded-full blur-lg"
            style={{
              top: '50px',
              right: '200px',
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
          <div className="overflow-hidden">
            <h1 className="text-4xl font-bold text-white">
              {['기술로', '만드는', '더 나은', '미래'].map((word, i) => (
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

          {/* English Subtitle */}
          <p 
            className="mt-3 text-white/90 text-lg font-light"
            style={{
              animationName: isVisible ? 'fadeInUp' : 'none',
              animationDuration: '0.6s',
              animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              animationFillMode: 'forwards',
              animationDelay: '0.4s',
              opacity: 0,
            }}
          >
            Discover what's new and what's next
          </p>

          {/* CTA Tags */}
          <div className="mt-6 flex gap-3">
            {['AI 연구', '바이오테크', '혁신'].map((tag, i) => (
              <span
                key={tag}
                className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full font-medium"
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