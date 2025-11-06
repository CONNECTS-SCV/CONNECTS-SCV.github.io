"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllComments, deleteComment, getCommentStats, Comment, createComment } from "@/lib/supabase";
import {
  MessageCircle,
  Search,
  Trash2,
  AlertCircle,
  Reply,
  X,
  Send,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function AdminCommentsPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [postTitles, setPostTitles] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "today">("all");
  const [groupBy, setGroupBy] = useState<"none" | "post">("none");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const [stats, setStats] = useState<{
    total: number;
    today: number;
    new: number;
    byPost: Record<string, number>;
  } | null>(null);

  // 인증 확인
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
    loadData();
  }, [router]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [commentsData, statsData] = await Promise.all([
        getAllComments(),
        getCommentStats(),
      ]);
      setComments(commentsData);
      setStats(statsData);

      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const titles = await response.json();
          setPostTitles(titles);
        }
      } catch (err) {
        console.error('Error loading post titles:', err);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPostTitle = useCallback((postId: string) => {
    return postTitles[postId] || postId;
  }, [postTitles]);


  const handleDelete = async (id: number) => {
    if (!window.confirm(t("admin.dashboard.confirmDelete"))) return;
    try {
      await deleteComment(id);
      await loadData();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(language === "ko" ? "삭제 중 오류가 발생했습니다" : "Error deleting comment");
    }
  };

  const handleReplyClick = (comment: Comment) => {
    setReplyingTo(comment);
    setReplyText("");
    setTimeout(() => {
      replyInputRef.current?.focus();
    }, 100);
  };

  const handleReplySubmit = async () => {
    if (!replyingTo || !replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment({
        post_id: replyingTo.post_id,
        nickname: 'Curieus',
        content: replyText,
        parent_id: replyingTo.parent_id || replyingTo.id,
        avatar: 'bg-gradient-to-br from-purple-500 to-blue-500',
      });

      setReplyingTo(null);
      setReplyText("");
      await loadData();
    } catch (error) {
      console.error("Error posting reply:", error);
      alert(language === "ko" ? "답글 작성 중 오류가 발생했습니다" : "Error posting reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}${language === "ko" ? "분 전" : "m ago"}`;
    if (hours < 24) return `${hours}${language === "ko" ? "시간 전" : "h ago"}`;
    if (days < 7) return `${days}${language === "ko" ? "일 전" : "d ago"}`;
    return date.toLocaleDateString(language === "ko" ? "ko-KR" : "en-US");
  };

  const isNewComment = (dateString: string | undefined) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff < 24 * 60 * 60 * 1000;
  };

  const isTodayComment = (dateString: string | undefined) => {
    if (!dateString) return false;
    const commentDate = new Date(dateString);
    const today = new Date();
    return (
      commentDate.getDate() === today.getDate() &&
      commentDate.getMonth() === today.getMonth() &&
      commentDate.getFullYear() === today.getFullYear()
    );
  };

  const flattenComments = (comments: Comment[]): Comment[] => {
    const flat: Comment[] = [];
    const flatten = (comment: Comment) => {
      flat.push(comment);
      if (comment.replies) {
        comment.replies.forEach(flatten);
      }
    };
    comments.forEach(flatten);
    return flat;
  };

  const hasActiveFilter = useMemo(() => {
    return searchQuery.trim() !== "" || filter !== "all";
  }, [searchQuery, filter]);

  const filteredComments = useMemo(() => {
    let allComments = flattenComments(comments);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allComments = allComments.filter(
        (c) =>
          c.nickname.toLowerCase().includes(query) ||
          c.content.toLowerCase().includes(query) ||
          c.post_id.toLowerCase().includes(query) ||
          getPostTitle(c.post_id).toLowerCase().includes(query)
      );
    }

    if (filter === "new") {
      allComments = allComments.filter((c) => isNewComment(c.created_at));
    } else if (filter === "today") {
      allComments = allComments.filter((c) => isTodayComment(c.created_at));
    }

    return allComments;
  }, [comments, searchQuery, filter, getPostTitle]);

  if (!isAuthenticated) return null;

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
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              {stats?.new && stats.new > 0 && (
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  +{stats.new}
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.total || 0}
            </div>
            <div className="text-sm text-gray-700">
              {language === "ko" ? "전체 댓글" : "Total Comments"}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              {language === "ko" ? "포스트 댓글 수" : "Post Comments"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-green-600" />
              {stats?.today && stats.today > 0 && (
                <span className="text-xs text-green-600 font-semibold">
                  오늘
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.today || 0}
            </div>
            <div className="text-sm text-gray-700">
              {language === "ko" ? "오늘의 댓글" : "Today's Comments"}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              {language === "ko" ? "24시간 이내" : "Last 24 hours"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-8 h-8 text-purple-600" />
              {stats?.new && stats.new > 0 && (
                <span className="animate-pulse">
                  <span className="w-2 h-2 bg-purple-600 rounded-full inline-block"></span>
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.new || 0}
            </div>
            <div className="text-sm text-gray-700">
              {language === "ko" ? "새 댓글" : "New Comments"}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              {language === "ko" ? "확인 필요" : "Needs Review"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Reply className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-700">
              {language === "ko" ? "답글" : "Replies"}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              {language === "ko" ? "관리자 답글" : "Admin Replies"}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "ko" ? "닉네임, 내용, 포스트로 검색..." : "Search by nickname, content, post..."}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-xl p-1 border border-gray-200">
                {(["all", "new", "today"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${
                      filter === f
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {f === "all" && t("admin.dashboard.filter.all")}
                    {f === "new" && t("admin.dashboard.filter.new")}
                    {f === "today" && t("admin.dashboard.filter.today")}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setGroupBy(groupBy === "post" ? "none" : "post")}
                className={`px-4 py-2.5 text-sm rounded-xl transition-all font-medium flex items-center gap-2 border ${
                  groupBy === "post" 
                    ? "bg-purple-50 text-purple-600 border-purple-200" 
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                {language === "ko" ? "포스트별" : "By Post"}
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {hasActiveFilter ? t("admin.dashboard.searchResults") : t("comments.title")}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {filteredComments.length}개의 결과
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredComments.length === 0 ? (
              <div className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === "ko" ? "댓글이 없습니다" : "No comments found"}
                </p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div key={comment.id} className={`p-5 hover:bg-gray-50 transition-colors ${
                  isNewComment(comment.created_at) ? "bg-blue-50/20" : ""
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${comment.avatar} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}>
                      {comment.nickname === "Curieus" ? "C" : comment.nickname.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.nickname}</span>
                        {isNewComment(comment.created_at) && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">NEW</span>
                        )}
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">{formatTime(comment.created_at)}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-600 font-medium">{getPostTitle(comment.post_id)}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleReplyClick(comment)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => comment.id && handleDelete(comment.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reply Modal */}
        {replyingTo && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{language === "ko" ? "답글 작성" : "Write Reply"}</h3>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 ${replyingTo.avatar} rounded-lg flex items-center justify-center text-white text-xs font-semibold`}>
                      {replyingTo.nickname.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">{replyingTo.nickname}</span>
                      <p className="text-sm text-gray-600 mt-1">{replyingTo.content}</p>
                    </div>
                  </div>
                </div>
                <textarea
                  ref={replyInputRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={language === "ko" ? "답글을 입력하세요..." : "Write your reply..."}
                  className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows={4}
                />
                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    {language === "ko" ? "취소" : "Cancel"}
                  </button>
                  <button
                    onClick={handleReplySubmit}
                    disabled={isSubmitting || !replyText.trim()}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? (language === "ko" ? "전송 중..." : "Sending...") : (language === "ko" ? "답글 달기" : "Reply")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
