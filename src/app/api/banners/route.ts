import { NextRequest, NextResponse } from 'next/server';
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/lib/supabase-banners';

// GET: 배너 목록 가져오기
export async function GET() {
  try {
    const banners = await getBanners();
    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error('Error in GET /api/banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST: 새 배너 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate admin token
    const token = request.headers.get('x-admin-token');
    if (!token || token !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const banner = await createBanner(body);
    
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Failed to create banner' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    console.error('Error in POST /api/banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

// PUT: 배너 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    // Validate admin token
    const token = request.headers.get('x-admin-token');
    if (!token || token !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const success = await updateBanner(id, updates);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update banner' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// DELETE: 배너 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Validate admin token
    const token = request.headers.get('x-admin-token');
    if (!token || token !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const success = await deleteBanner(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete banner' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}