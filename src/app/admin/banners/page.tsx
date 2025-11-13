"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { BannerManager } from "@/components/admin/BannerManager";

export default function AdminBannersPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const authTime = localStorage.getItem("admin_auth_time");

    if (!token || !authTime) {
      router.push("/");
      return;
    }

    const tokenAge = Date.now() - parseInt(authTime);
    if (tokenAge > 24 * 60 * 60 * 1000) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_auth_time");
      router.push("/");
      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <BannerManager />
    </div>
  );
}
