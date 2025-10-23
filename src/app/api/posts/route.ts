import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const posts = await getAllPosts();
    const postMap = posts.reduce((acc, post) => {
      acc[post.metadata.slug] = post.metadata.title;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(postMap);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({}, { status: 500 });
  }
}
