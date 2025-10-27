"use client";

import { useEffect } from 'react';

interface PostInfoProviderProps {
  pairedPost?: string;
  slug: string;
}

export default function PostInfoProvider({ pairedPost, slug }: PostInfoProviderProps) {
  useEffect(() => {
    // window 객체에 포스트 정보 저장
    if (typeof window !== 'undefined') {
      (window as any).__postInfo = {
        slug,
        pairedPost
      };
    }
    
    // cleanup
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__postInfo;
      }
    };
  }, [pairedPost, slug]);

  return null;
}