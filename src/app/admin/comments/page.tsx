"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllComments, deleteComment, getCommentStats, Comment, createComment } from "@/lib/supabase";
import {
  MessageCircle,
  Search,
  Trash2,
  LogOut,
  AlertCircle,
  Reply,
  X,
  Send,
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
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
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

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_auth_time");
    router.push("/");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("admin.dashboard.confirmDelete"))) return;
    try {
      const success = await deleteComment(id);
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReplyClick = (comment: Comment) => {
    setReplyingTo(comment);
    setReplyText("");
    setTimeout(() => {
      replyInputRef.current?.focus();
      replyInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !replyingTo) return;
    setIsSubmitting(true);
    try {
      await createComment({
        post_id: replyingTo.post_id,
        parent_id: replyingTo.id || null,
        nickname: "CURIE",
        avatar: "bg-gradient-to-br from-gray-800 to-gray-900",
        content: replyText.trim(),
      });
      await loadData();
      handleCancelReply();
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to submit reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timestamp: string | undefined) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString(language === "ko" ? "ko-KR" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isNewComment = (timestamp: string | undefined) => {
    if (!timestamp) return false;
    return new Date(timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000;
  };

  const isTodayComment = (timestamp: string | undefined) => {
    if (!timestamp) return false;
    const commentDate = new Date(timestamp);
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

  const toggleComment = (id: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 필터/검색 활성화 여부 체크
  const hasActiveFilter = useMemo(() => {
    return searchQuery.trim() !== "" || filter !== "all";
  }, [searchQuery, filter]);

  // 필터링된 플랫 댓글 목록 (검색/필터 활성화시)
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

  // 계층 구조 댓글 목록 (필터 없을 때)
  const hierarchicalComments = useMemo(() => {
    if (hasActiveFilter) return [];
    return comments;
  }, [comments, hasActiveFilter]);

  const groupedComments = useMemo(() => {
    if (groupBy !== "post") return null;
    const grouped: Record<string, Comment[]> = {};
    filteredComments.forEach(comment => {
      if (!grouped[comment.post_id]) {
        grouped[comment.post_id] = [];
      }
      grouped[comment.post_id].push(comment);
    });
    return grouped;
  }, [filteredComments, groupBy]);

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

  // 플랫 댓글 행 (검색/필터 활성화시)
  function CommentRow({ comment }: { comment: Comment }) {
    const isExpanded = expandedComments.has(comment.id!);
    const isLong = comment.content.length > 150;
    const displayContent = isLong && !isExpanded
      ? comment.content.substring(0, 150) + "..."
      : comment.content;

    return (
      <div className={`px-4 py-3 hover:bg-gray-50 transition-colors ${isNewComment(comment.created_at) ? "bg-blue-50/50" : ""}`}>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 ${comment.avatar} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {comment.nickname === "CURIE" ? "C" : comment.nickname.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-medium text-gray-900">{comment.nickname}</span>
              {isNewComment(comment.created_at) && (
                <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">NEW</span>
              )}
              {comment.parent_id && (
                <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">{language === "ko" ? "답글" : "Reply"}</span>
              )}
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">{formatTime(comment.created_at)}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500 truncate max-w-[200px]" title={getPostTitle(comment.post_id)}>
                {getPostTitle(comment.post_id)}
              </span>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {displayContent}
            </p>
            {isLong && (
              <button onClick={() => toggleComment(comment.id!)} className="text-xs text-blue-600 hover:text-blue-700 mt-1">
                {isExpanded ? (language === "ko" ? "접기" : "Less") : (language === "ko" ? "더보기" : "More")}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => handleReplyClick(comment)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title={language === "ko" ? "답글" : "Reply"}
            >
              <Reply className="w-4 h-4" />
            </button>
            <button
              onClick={() => comment.id && handleDelete(comment.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title={language === "ko" ? "삭제" : "Delete"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 계층 구조 댓글 트리 (답글이 들여쓰기되어 표시)
  function CommentTreeItem({ comment, level = 0 }: { comment: Comment; level?: number }) {
    const isExpanded = expandedComments.has(comment.id!);
    const isLong = comment.content.length > 150;
    const displayContent = isLong && !isExpanded
      ? comment.content.substring(0, 150) + "..."
      : comment.content;

    // 들여쓰기 패딩 계산 (최대 3단계까지만 시각적으로 구분)
    const indentClass = level === 0 ? "" : level === 1 ? "pl-12" : level === 2 ? "pl-24" : "pl-36";
    const borderClass = level > 0 ? "border-l-2 border-gray-200" : "";

    return (
      <div>
        <div className={`${indentClass} ${borderClass} ${isNewComment(comment.created_at) ? "bg-blue-50/50" : ""}`}>
          <div className={`px-4 py-3 hover:bg-gray-50 transition-colors`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 ${comment.avatar} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {comment.nickname === "CURIE" ? "C" : comment.nickname.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-medium text-gray-900">{comment.nickname}</span>
                  {isNewComment(comment.created_at) && (
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">NEW</span>
                  )}
                  {level > 0 && (
                    <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">{language === "ko" ? "답글" : "Reply"}</span>
                  )}
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">{formatTime(comment.created_at)}</span>
                  {level === 0 && (
                    <>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500 truncate max-w-[200px]" title={getPostTitle(comment.post_id)}>
                        {getPostTitle(comment.post_id)}
                      </span>
                    </>
                  )}
                  {comment.replies && comment.replies.length > 0 && (
                    <>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-blue-600 font-medium">
                        {comment.replies.length} {language === "ko" ? "답글" : "replies"}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                  {displayContent}
                </p>
                {isLong && (
                  <button onClick={() => toggleComment(comment.id!)} className="text-xs text-blue-600 hover:text-blue-700 mt-1">
                    {isExpanded ? (language === "ko" ? "접기" : "Less") : (language === "ko" ? "더보기" : "More")}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleReplyClick(comment)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title={language === "ko" ? "답글" : "Reply"}
                >
                  <Reply className="w-4 h-4" />
                </button>
                <button
                  onClick={() => comment.id && handleDelete(comment.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title={language === "ko" ? "삭제" : "Delete"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 답글 재귀 렌더링 */}
        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map((reply) => (
              <CommentTreeItem key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 상단 고정 헤더 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{t("admin.dashboard.title")}</h1>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {stats?.new || 0} {language === "ko" ? "새 댓글" : "New"}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {stats?.today || 0} {language === "ko" ? "오늘" : "Today"}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      {stats?.total || 0} {language === "ko" ? "전체" : "Total"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "ko" ? "로그아웃" : "Logout"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-6">
        {/* 필터 및 검색 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "ko" ? "닉네임, 내용, 포스트로 검색..." : "Search by nickname, content, post..."}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {language === "ko" ? "전체" : "All"} ({filteredComments.length})
              </button>
              <button
                onClick={() => setFilter("new")}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filter === "new" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {language === "ko" ? "새 댓글" : "New"}
              </button>
              <button
                onClick={() => setFilter("today")}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filter === "today" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                {language === "ko" ? "오늘" : "Today"}
              </button>
              <div className="border-l border-gray-300 mx-1"></div>
              <button
                onClick={() => setGroupBy(groupBy === "post" ? "none" : "post")}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  groupBy === "post" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {groupBy === "post" ? "✓ " : ""}{language === "ko" ? "포스트별" : "By Post"}
              </button>
            </div>
          </div>
        </div>

        {/* 답글 입력 */}
        {replyingTo && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Reply className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  {language === "ko" ? "답글 작성 중" : "Replying to"} <strong>{replyingTo.nickname}</strong>
                </span>
              </div>
              <button onClick={handleCancelReply} className="p-1 hover:bg-blue-100 rounded transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="bg-white rounded p-2 mb-3 border border-blue-100">
              <p className="text-xs text-gray-600 line-clamp-2">{replyingTo.content}</p>
            </div>
            <div className="flex gap-2">
              <textarea
                ref={replyInputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={language === "ko" ? "답글을 입력하세요..." : "Write your reply..."}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSubmitReply();
                  }
                }}
              />
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              CURIE · {language === "ko" ? "Ctrl+Enter로 전송" : "Ctrl+Enter to send"}
            </p>
          </div>
        )}

        {/* 댓글 목록 */}
        {(hasActiveFilter ? filteredComments.length === 0 : hierarchicalComments.length === 0) ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{t("admin.dashboard.noComments")}</p>
          </div>
        ) : hasActiveFilter ? (
          // 필터/검색 활성화시 - 플랫 리스트로 표시
          groupBy === "post" && groupedComments ? (
            <div className="space-y-4">
              {Object.entries(groupedComments).map(([postId, postComments]) => (
                <div key={postId} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">{getPostTitle(postId)}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {postComments.length} {language === "ko" ? "개 댓글" : "comments"}
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {postComments.map((comment) => (
                      <CommentRow key={comment.id} comment={comment} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredComments.map((comment) => (
                  <CommentRow key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          )
        ) : (
          // 필터 없을 때 - 계층 구조로 표시
          groupBy === "post" ? (
            <div className="space-y-4">
              {(() => {
                // 포스트별로 그룹화
                const grouped: Record<string, Comment[]> = {};
                hierarchicalComments.forEach(comment => {
                  if (!grouped[comment.post_id]) {
                    grouped[comment.post_id] = [];
                  }
                  grouped[comment.post_id].push(comment);
                });
                return Object.entries(grouped).map(([postId, postComments]) => (
                  <div key={postId} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">{getPostTitle(postId)}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {postComments.length} {language === "ko" ? "개 스레드" : "threads"}
                      </p>
                    </div>
                    <div>
                      {postComments.map((comment) => (
                        <CommentTreeItem key={comment.id} comment={comment} />
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {hierarchicalComments.map((comment) => (
                <CommentTreeItem key={comment.id} comment={comment} />
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
