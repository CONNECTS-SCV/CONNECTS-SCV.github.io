import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성 (조건부)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase가 설정되지 않은 경우 null 반환
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 타입 정의
export interface Comment {
  id?: number;
  post_id: string;
  parent_id?: number | null;  // 답글을 위한 부모 댓글 ID
  nickname: string;
  avatar: string;
  content: string;
  created_at?: string;
  replies?: Comment[];  // 답글 배열 (클라이언트 사이드용)
}

// 댓글 가져오기 (계층 구조로 변환)
export async function getComments(postId: string): Promise<Comment[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  // 계층 구조로 변환
  const comments = data || [];
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  // 모든 댓글을 Map에 저장
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 부모-자식 관계 설정
  comments.forEach(comment => {
    const mappedComment = commentMap.get(comment.id)!;
    if (comment.parent_id === null) {
      rootComments.push(mappedComment);
    } else {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(mappedComment);
      }
    }
  });

  return rootComments;
}

// 댓글 작성
export async function createComment(comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }

  return data;
}

// 댓글 삭제 (관리자용 - 선택사항)
export async function deleteComment(id: number): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    return false;
  }

  return true;
}

// 실시간 구독 설정
export function subscribeToComments(
  postId: string,
  callback: (payload: any) => void
) {
  if (!supabase) {
    return {
      unsubscribe: () => {}
    };
  }

  const subscription = supabase
    .channel(`comments:${postId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
}

// 관리자용: 모든 댓글 가져오기 (계층 구조 포함)
export async function getAllComments(): Promise<Comment[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all comments:', error);
    return [];
  }

  // 계층 구조로 변환
  const comments = data || [];
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  // 모든 댓글을 Map에 저장
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 부모-자식 관계 설정
  comments.forEach(comment => {
    const mappedComment = commentMap.get(comment.id)!;
    if (comment.parent_id === null) {
      rootComments.push(mappedComment);
    } else {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(mappedComment);
      }
    }
  });

  return rootComments;
}

// 관리자용: 댓글 통계 가져오기
export async function getCommentStats() {
  if (!supabase) return null;

  try {
    // 전체 댓글 수
    const { count: totalCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true });

    // 오늘의 댓글 수
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // 최근 24시간 댓글 수
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { count: newCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', last24Hours.toISOString());

    // 포스트별 댓글 수
    const { data: postStats } = await supabase
      .from('comments')
      .select('post_id')
      .order('post_id');

    const postCounts: Record<string, number> = {};
    postStats?.forEach(({ post_id }) => {
      postCounts[post_id] = (postCounts[post_id] || 0) + 1;
    });

    return {
      total: totalCount || 0,
      today: todayCount || 0,
      new: newCount || 0,
      byPost: postCounts,
    };
  } catch (error) {
    console.error('Error fetching comment stats:', error);
    return null;
  }
}