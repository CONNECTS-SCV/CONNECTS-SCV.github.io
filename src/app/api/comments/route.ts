import { NextRequest, NextResponse } from 'next/server';
import { getComments, createComment, deleteComment } from '@/lib/supabase';

// GET: 댓글 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    const comments = await getComments(postId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST: 댓글 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, nickname, avatar, content } = body;

    if (!postId || !nickname || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newComment = await createComment({
      post_id: postId,
      nickname,
      avatar,
      content
    });

    if (!newComment) {
      throw new Error('Failed to create comment');
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    );
  }
}

// DELETE: 댓글 삭제 (관리자용)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json(
        { error: 'commentId is required' },
        { status: 400 }
      );
    }

    const success = await deleteComment(Number(commentId));

    if (!success) {
      throw new Error('Failed to delete comment');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}