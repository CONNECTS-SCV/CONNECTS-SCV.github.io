"use client";

import {useLanguage} from '@/contexts/LanguageContext';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function LanguageToggle() {
    const {language, setLanguage} = useLanguage();
    const pathname = usePathname();
    const router = useRouter();
    const [pairedPost, setPairedPost] = useState<string | null>(null);

    // 포스트 페이지인지 확인하고 paired_post 정보 가져오기
    useEffect(() => {
        const checkPostInfo = () => {
            if (pathname.startsWith('/post/') && typeof window !== 'undefined') {
                const postInfo = (window as any).__postInfo;
                if (postInfo && postInfo.pairedPost) {
                    setPairedPost(postInfo.pairedPost);
                } else {
                    setPairedPost(null);
                }
            } else {
                setPairedPost(null);
            }
        };

        // 첨 체크
        checkPostInfo();

        // window 객체가 업데이트될 때까지 짧은 대기
        const timer = setTimeout(checkPostInfo, 100);

        return () => clearTimeout(timer);
    }, [pathname]);

    const toggleLanguage = (e: React.MouseEvent<HTMLButtonElement>) => {
        const newLanguage = language === 'ko' ? 'en' : 'ko';
        e.currentTarget.blur(); // 클릭 후 포커스 제거
        setLanguage(newLanguage);

        // 포스트 페이지에서 paired_post가 있으면 해당 페이지로 이동 (히스토리 대체)
        if (pathname.startsWith('/post/') && pairedPost) {
            console.log('Replacing with paired post:', pairedPost);
            router.replace(`/post/${pairedPost}`);
        } else if (pathname.startsWith('/post/') && !pairedPost) {
            // 대응 페이지가 없으면 메인으로 이동 (히스토리 대체)
            console.log('No paired post, replacing with home');
            router.replace('/');
        }
        // 메인 페이지에서는 언어만 변경
    };

    return (
        <button
            onClick={toggleLanguage}
      className="font-bold text-sm px-3 py-2 hover:bg-gray-100 transition-colors rounded-md select-none focus:outline-none"
            aria-label="Toggle language"
        >
            {language === 'ko' ? 'EN' : 'KO'}
        </button>
    );
}
