"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase, getCommentStats } from "@/lib/supabase";
import {
  MessageCircle,
  Mail,
  TrendingUp,
  ChevronRight,
  Activity,
  ArrowUp,
  BarChart3,
} from "lucide-react";

interface DashboardStats {
  comments: {
    total: number;
    today: number;
    new: number;
    thisWeek: number;
  };
  subscribers: {
    total: number;
    active: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    comments: { total: 0, today: 0, new: 0, thisWeek: 0 },
    subscribers: { total: 0, active: 0, thisWeek: 0, thisMonth: 0 },
  });

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
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load comment stats
      const commentStats = await getCommentStats();

      // Load subscriber stats
      if (!supabase) {
        console.warn("Supabase not configured");
        return;
      }
      
      const { data: subscribers, error } = await supabase
        .from("subscribers")
        .select("*");

      if (!error && subscribers && commentStats) {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const subscriberStats = {
          total: subscribers.length,
          active: subscribers.filter(s => s.is_active).length,
          thisWeek: subscribers.filter(s => new Date(s.subscribed_at) > weekAgo).length,
          thisMonth: subscribers.filter(s => new Date(s.subscribed_at) > monthAgo).length,
        };

        setStats({
          comments: {
            total: commentStats.total,
            today: commentStats.today,
            new: commentStats.new,
            thisWeek: commentStats.total, // You might want to calculate this properly
          },
          subscribers: subscriberStats,
        });
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              {stats.comments.new > 0 && (
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  +{stats.comments.new}
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.comments.total}</div>
            <div className="text-sm text-gray-700">
              {language === "ko" ? "전체 댓글" : "Total Comments"}
            </div>
            <div className="mt-3 text-xs text-gray-600 flex items-center gap-1">
              <ArrowUp className="w-3 h-3 text-green-600" />
              <span>{stats.comments.today} {language === "ko" ? "오늘" : "today"}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Mail className="w-8 h-8 text-green-600" />
              {stats.subscribers.thisWeek > 0 && (
                <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                  +{stats.subscribers.thisWeek}
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.subscribers.total}</div>
            <div className="text-sm text-gray-700">
              {language === "ko" ? "전체 구독자" : "Total Subscribers"}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <span className="text-green-600 font-medium">{stats.subscribers.active}</span>
              <span> {language === "ko" ? "명 활성" : " active"}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {((stats.subscribers.active / Math.max(stats.subscribers.total, 1)) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-700">
              {language === "ko" ? "활성 비율" : "Active Rate"}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              {language === "ko" ? "구독자 참여도" : "Subscriber Engagement"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.subscribers.thisMonth}</div>
            <div className="text-sm text-gray-700">
              {language === "ko" ? "이번 달 신규" : "New This Month"}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              {language === "ko" ? "월간 성장" : "Monthly Growth"}
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {language === "ko" ? "관리 메뉴" : "Management Menu"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Comments Management */}
            <Link href="/admin/comments" className="group block">
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-300 transition-all hover:shadow-lg cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-600 transition-colors mt-3" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === "ko" ? "댓글 관리" : "Comment Management"}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {language === "ko"
                    ? "포스트 댓글을 관리하고 답글을 작성할 수 있습니다"
                    : "Manage post comments and write replies"}
                </p>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex gap-6">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.comments.total}</div>
                      <div className="text-xs text-gray-500">{language === "ko" ? "전체" : "Total"}</div>
                    </div>
                    <div className="border-l border-gray-200 pl-6">
                      <div className="text-2xl font-bold text-blue-600">{stats.comments.new}</div>
                      <div className="text-xs text-gray-500">{language === "ko" ? "새 댓글" : "New"}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="text-green-600 font-medium">+{stats.comments.today}</span>
                    <span> {language === "ko" ? "오늘" : "today"}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Subscribers Management */}
            <Link href="/admin/subscribers" className="group block">
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-green-300 transition-all hover:shadow-lg cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-green-600 transition-colors mt-3" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === "ko" ? "구독자 관리" : "Subscriber Management"}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {language === "ko"
                    ? "뉴스레터 구독자를 관리하고 이메일을 발송합니다"
                    : "Manage newsletter subscribers and send emails"}
                </p>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex gap-6">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.subscribers.total}</div>
                      <div className="text-xs text-gray-500">{language === "ko" ? "전체" : "Total"}</div>
                    </div>
                    <div className="border-l border-gray-200 pl-6">
                      <div className="text-2xl font-bold text-green-600">{stats.subscribers.active}</div>
                      <div className="text-xs text-gray-500">{language === "ko" ? "활성" : "Active"}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="text-blue-600 font-medium">+{stats.subscribers.thisWeek}</span>
                    <span> {language === "ko" ? "이번 주" : "this week"}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {language === "ko" ? "최근 활동" : "Recent Activity"}
            </h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
              <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm font-medium">
                  {language === "ko" ? "댓글 활동" : "Comment Activity"}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {language === "ko"
                    ? `오늘 ${stats.comments.today}개의 새 댓글이 작성되었습니다`
                    : `${stats.comments.today} new comments were posted today`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
              <div className="mt-1 w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm font-medium">
                  {language === "ko" ? "구독자 증가" : "Subscriber Growth"}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {language === "ko"
                    ? `이번 주 ${stats.subscribers.thisWeek}명의 신규 구독자가 등록했습니다`
                    : `${stats.subscribers.thisWeek} new subscribers joined this week`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
              <div className="mt-1 w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm font-medium">
                  {language === "ko" ? "전체 현황" : "Overall Status"}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {language === "ko"
                    ? `현재 ${stats.subscribers.active}명의 활성 구독자가 있습니다`
                    : `There are currently ${stats.subscribers.active} active subscribers`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
