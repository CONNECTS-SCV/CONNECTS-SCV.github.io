"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, X } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 모달이 열릴 때 포커스 설정 및 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
      setPassword("");
      setError("");
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!password.trim()) {
      setError(t('admin.login.error'));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 환경 변수에서 관리자 비밀번호 확인
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

      if (password === adminPassword) {
        // 로컬 스토리지에 토큰 저장 (간단한 인증)
        const token = btoa(`${password}-${Date.now()}`);
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_auth_time", Date.now().toString());

        // 관리자 페이지로 이동
        onClose();
        router.push("/admin");
      } else {
        setError(t('admin.login.error'));
        setPassword("");
        passwordInputRef.current?.focus();
      }
    } catch {
      setError(t('admin.login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close admin login"
      />

      {/* 로그인 모달 */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">

          {/* 헤더 */}
          <div className="relative px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-900" />
              <h2 className="text-lg font-bold text-gray-900">
                {t('admin.login.title')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="absolute right-4 top-5 p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-5">
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                {t('admin.login.password')}
              </label>
              <input
                ref={passwordInputRef}
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                placeholder={t('admin.login.placeholder')}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-gray-400 transition-all ${
                  error
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
                autoComplete="off"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                disabled={isLoading}
              >
                {t('admin.login.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="flex-1 px-4 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  t('admin.login.submit')
                )}
              </button>
            </div>
          </form>

          {/* 안내 메시지 */}
          <div className="px-6 pb-6">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded text-center">
              <p className="text-xs text-gray-500">
                🔒 Restricted to authorized administrators only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
