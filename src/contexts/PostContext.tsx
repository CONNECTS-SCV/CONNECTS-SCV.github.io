"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PostContextType {
  currentPostSlug?: string;
  pairedPost?: string;
  setPostInfo: (slug: string, paired?: string) => void;
  clearPostInfo: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [currentPostSlug, setCurrentPostSlug] = useState<string>();
  const [pairedPost, setPairedPost] = useState<string>();

  const setPostInfo = (slug: string, paired?: string) => {
    setCurrentPostSlug(slug);
    setPairedPost(paired);
  };

  const clearPostInfo = () => {
    setCurrentPostSlug(undefined);
    setPairedPost(undefined);
  };

  return (
    <PostContext.Provider value={{ currentPostSlug, pairedPost, setPostInfo, clearPostInfo }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
}