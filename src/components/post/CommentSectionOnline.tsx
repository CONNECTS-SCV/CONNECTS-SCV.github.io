"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, RefreshCw, Send, AlertCircle } from 'lucide-react';
import { getComments, createComment, subscribeToComments, Comment } from '@/lib/supabase';

interface CommentSectionProps {
  postId: string;
}

// 과학자/발명가 버전
const scientistNames = [
  "호기심많은뉴턴", "창의적인에디슨", "열정적인퀴리", "도전적인아인슈타인", "혁신적인테슬라",
  "탐구하는다윈", "발견하는갈릴레이", "실험하는파스퇴르", "계산하는튜링", "관찰하는허블",
  "분석하는멘델레예프", "연구하는파인만", "설계하는라이트", "발명하는벨", "추론하는홈즈",
  "질문하는소크라테스", "증명하는유클리드", "통찰하는프로이트", "코딩하는에이다", "탐험하는콜럼버스"
];

// 우주/천체 버전
const spaceNames = [
  "빛나는시리우스", "신비로운안드로메다", "영원한북극성", "아름다운오리온", "강렬한베텔게우스",
  "우아한카시오페아", "거대한목성", "고리의토성", "붉은화성", "빠른수성",
  "반짝이는금성", "푸른해왕성", "차가운명왕성", "회전하는펄서", "깊은블랙홀",
  "화려한초신성", "나선은하수", "밝은퀘이사", "신비한성운", "영원한혜성"
];

// 판타지 캐릭터 버전
const fantasyNames = [
  "용감한기사", "지혜로운마법사", "민첩한레인저", "강력한전사", "신비한엘프",
  "든든한드워프", "교활한도적", "치유의사제", "예언자현자", "불꽃의소환사",
  "얼음의마도사", "바람의궁수", "대지의수호자", "빛의성기사", "그림자암살자",
  "룬의각인사", "별의점성술사", "시간의여행자", "꿈의방랑자", "운명의예언가"
];

// 랜덤으로 테마 선택
const themes = [scientistNames, spaceNames, fantasyNames];
const randomTheme = themes[Math.floor(Math.random() * themes.length)];
const nicknamePool = randomTheme;

const avatarColors = [
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-blue-400 to-blue-600",
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-pink-400 to-pink-600",
  "bg-gradient-to-br from-indigo-400 to-indigo-600",
  "bg-gradient-to-br from-teal-400 to-teal-600",
  "bg-gradient-to-br from-red-400 to-red-600",
  "bg-gradient-to-br from-yellow-400 to-yellow-600",
  "bg-gradient-to-br from-cyan-400 to-cyan-600"
];

// Supabase 연동 버전
export default function CommentSectionOnline({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [avatarColor, setAvatarColor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false);

  useEffect(() => {
    generateRandomNickname();
    checkSupabaseAndLoadComments();

    // 실시간 구독 설정
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const subscription = subscribeToComments(postId, (payload) => {
        if (payload.eventType === 'INSERT') {
          setComments(prev => [...prev, payload.new as Comment]);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [postId]);

  // Supabase 연결 확인 및 댓글 로드
  const checkSupabaseAndLoadComments = async () => {
    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    setIsSupabaseAvailable(hasSupabase);

    if (hasSupabase) {
      await loadSupabaseComments();
    } else {
      loadLocalComments();
    }
  };

  // Supabase에서 댓글 불러오기
  const loadSupabaseComments = async () => {
    try {
      setIsLoading(true);
      const data = await getComments(postId);
      setComments(data);
      setError(null);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('댓글을 불러오는데 실패했습니다. 로컬 모드로 전환합니다.');
      loadLocalComments();
    } finally {
      setIsLoading(false);
    }
  };

  // 로컬 스토리지 폴백
  const loadLocalComments = () => {
    const storedComments = localStorage.getItem(`comments_${postId}`);
    if (storedComments) {
      const localComments = JSON.parse(storedComments);
      // 로컬 데이터를 Supabase 형식으로 변환
      const formattedComments = localComments.map((c: any) => ({
        id: c.id,
        post_id: c.postId || postId,
        nickname: c.nickname,
        avatar: c.avatar,
        content: c.content,
        created_at: c.timestamp || c.created_at
      }));
      setComments(formattedComments);
    }
    setIsLoading(false);
  };

  // 랜덤 닉네임 생성
  const generateRandomNickname = () => {
    // 매번 새로운 테마 선택
    const currentTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomName = currentTheme[Math.floor(Math.random() * currentTheme.length)];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    setNickname(randomName);
    setAvatarColor(randomColor);
  };

  // 댓글 제출
  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      if (isSupabaseAvailable) {
        // Supabase에 저장
        const newComment = await createComment({
          post_id: postId,
          nickname: nickname,
          avatar: avatarColor,
          content: commentText
        });

        if (newComment) {
          // 실시간 구독이 있으면 자동 업데이트되지만, 없을 경우를 위해
          if (!comments.find(c => c.id === newComment.id)) {
            setComments(prev => [...prev, newComment]);
          }
        } else {
          throw new Error('Failed to post comment');
        }
      } else {
        // 로컬 스토리지에 저장
        const newComment = {
          id: Date.now(),
          post_id: postId,
          nickname: nickname,
          avatar: avatarColor,
          content: commentText,
          created_at: new Date().toISOString()
        };

        const updatedComments = [...comments, newComment];
        setComments(updatedComments);

        // 로컬 스토리지 형식으로 저장
        const localFormat = updatedComments.map(c => ({
          id: c.id?.toString(),
          postId: c.post_id,
          nickname: c.nickname,
          avatar: c.avatar,
          content: c.content,
          timestamp: c.created_at
        }));
        localStorage.setItem(`comments_${postId}`, JSON.stringify(localFormat));
      }

      // 초기화
      setCommentText("");
      generateRandomNickname();
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 시간 포맷팅
  const formatTime = (timestamp: string | undefined) => {
    if (!timestamp) return '방금 전';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  // 새로고침
  const handleRefresh = async () => {
    if (isSupabaseAvailable) {
      await loadSupabaseComments();
    } else {
      loadLocalComments();
    }
  };

  return (
    <div className="w-full mx-auto mt-20 mb-10">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-700 text-base font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          댓글 {comments.length}
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="새로고침"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <div className="text-gray-500 text-sm">
            댓글 관련 문의: <a href="mailto:info@connects.ai" className="underline">info@connects.ai</a>
          </div>
        </div>
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* 닉네임 입력 영역 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${avatarColor} rounded-lg flex items-center justify-center text-white font-bold shadow-sm`}>
              {nickname.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">작성자 닉네임</p>
              <p className="text-gray-800 font-medium">{nickname}</p>
            </div>
          </div>

          <button
            onClick={generateRandomNickname}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
            title="다른 닉네임으로 변경"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            다시 뽑기
          </button>
        </div>
      </div>

      {/* 댓글 입력 영역 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-400 transition-colors">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSubmit();
            }
          }}
          placeholder="댓글을 작성해주세요... (Ctrl+Enter로 전송)"
          className="w-full px-4 py-3 resize-none focus:outline-none text-gray-700 placeholder-gray-400"
          rows={3}
        />
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            ⚠️ 작성된 댓글은 수정/삭제가 불가능합니다
          </p>
          <button
            onClick={handleSubmit}
            disabled={!commentText.trim() || isSubmitting}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? '전송 중...' : '댓글 작성'}
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-8 space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400">
            댓글을 불러오는 중...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            첫 번째 댓글을 남겨보세요!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex gap-3">
                <div className={`w-10 h-10 ${comment.avatar} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm`}>
                  {comment.nickname.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-medium text-gray-900 text-sm">{comment.nickname}</span>
                    <span className="text-xs text-gray-400">· {formatTime(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 모드 표시 */}
      {!isSupabaseAvailable && (
        <div className="mt-8 text-center text-xs text-gray-400">
          로컬 모드로 작동 중 (다른 사용자와 공유되지 않음)
        </div>
      )}
    </div>
  );
}