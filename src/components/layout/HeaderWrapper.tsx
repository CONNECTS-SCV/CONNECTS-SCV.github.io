"use client";

import Header from "./Header";
import { Footer } from "./Footer";

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full h-screen flex flex-col overflow-hidden">
        <div className="w-full z-50 bg-white">
          <div className="w-full max-w-[1140px] mx-auto">
            <Header />
          </div>
        </div>
        <div
          className="w-full flex-1 overflow-y-auto flex flex-col items-center"
        >
          <div className="w-full max-w-[1140px]">{children}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}