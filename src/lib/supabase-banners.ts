import { supabase } from './supabase';
import type { AdBanner } from '@/types/banner';

// 배너 목록 가져오기
export async function getBanners(): Promise<AdBanner[]> {
  if (!supabase) {
    console.warn('Supabase not configured, using localStorage');
    const saved = localStorage.getItem('adBanners');
    return saved ? JSON.parse(saved) : [];
  }

  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('adBanners');
      return saved ? JSON.parse(saved) : [];
    }

    // Transform database format to app format
    const banners: AdBanner[] = (data || []).map(banner => ({
      id: banner.id,
      title: banner.title,
      titleEn: banner.title_en,
      subtitle: banner.subtitle,
      subtitleEn: banner.subtitle_en,
      imageUrl: banner.image_url,
      backgroundColor: banner.background_color,
      textColor: banner.text_color,
      link: banner.link,
      linkTarget: banner.link_target as '_blank' | '_self',
      startDate: banner.start_date,
      endDate: banner.end_date,
      isActive: banner.is_active,
      priority: banner.priority,
      position: banner.position as 'left' | 'right' | 'both',
      createdAt: banner.created_at,
      updatedAt: banner.updated_at,
    }));

    // Also save to localStorage for offline access
    localStorage.setItem('adBanners', JSON.stringify(banners));
    return banners;
  } catch (error) {
    console.error('Error in getBanners:', error);
    const saved = localStorage.getItem('adBanners');
    return saved ? JSON.parse(saved) : [];
  }
}

// 배너 생성
export async function createBanner(banner: Omit<AdBanner, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdBanner | null> {
  if (!supabase) {
    // Fallback to localStorage
    const newBanner: AdBanner = {
      ...banner,
      id: `banner-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const saved = localStorage.getItem('adBanners');
    const banners = saved ? JSON.parse(saved) : [];
    banners.push(newBanner);
    localStorage.setItem('adBanners', JSON.stringify(banners));
    window.dispatchEvent(new Event('bannersUpdated'));
    return newBanner;
  }

  try {
    const { data, error } = await supabase
      .from('banners')
      .insert({
        title: banner.title,
        title_en: banner.titleEn,
        subtitle: banner.subtitle,
        subtitle_en: banner.subtitleEn,
        image_url: banner.imageUrl,
        background_color: banner.backgroundColor,
        text_color: banner.textColor,
        link: banner.link,
        link_target: banner.linkTarget,
        start_date: banner.startDate,
        end_date: banner.endDate,
        is_active: banner.isActive,
        priority: banner.priority,
        position: banner.position,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating banner:', error);
      return null;
    }

    const createdBanner: AdBanner = {
      id: data.id,
      title: data.title,
      titleEn: data.title_en,
      subtitle: data.subtitle,
      subtitleEn: data.subtitle_en,
      imageUrl: data.image_url,
      backgroundColor: data.background_color,
      textColor: data.text_color,
      link: data.link,
      linkTarget: data.link_target as '_blank' | '_self',
      startDate: data.start_date,
      endDate: data.end_date,
      isActive: data.is_active,
      priority: data.priority,
      position: data.position as 'left' | 'right' | 'both',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    // Update localStorage
    await getBanners();
    window.dispatchEvent(new Event('bannersUpdated'));
    return createdBanner;
  } catch (error) {
    console.error('Error in createBanner:', error);
    return null;
  }
}

// 배너 업데이트
export async function updateBanner(id: string, updates: Partial<AdBanner>): Promise<boolean> {
  if (!supabase) {
    // Fallback to localStorage
    const saved = localStorage.getItem('adBanners');
    const banners: AdBanner[] = saved ? JSON.parse(saved) : [];
    const index = banners.findIndex(b => b.id === id);
    
    if (index !== -1) {
      banners[index] = {
        ...banners[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('adBanners', JSON.stringify(banners));
      window.dispatchEvent(new Event('bannersUpdated'));
      return true;
    }
    return false;
  }

  try {
    const { error } = await supabase
      .from('banners')
      .update({
        title: updates.title,
        title_en: updates.titleEn,
        subtitle: updates.subtitle,
        subtitle_en: updates.subtitleEn,
        image_url: updates.imageUrl,
        background_color: updates.backgroundColor,
        text_color: updates.textColor,
        link: updates.link,
        link_target: updates.linkTarget,
        start_date: updates.startDate,
        end_date: updates.endDate,
        is_active: updates.isActive,
        priority: updates.priority,
        position: updates.position,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating banner:', error);
      return false;
    }

    // Update localStorage
    await getBanners();
    window.dispatchEvent(new Event('bannersUpdated'));
    return true;
  } catch (error) {
    console.error('Error in updateBanner:', error);
    return false;
  }
}

// 배너 삭제
export async function deleteBanner(id: string): Promise<boolean> {
  if (!supabase) {
    // Fallback to localStorage
    const saved = localStorage.getItem('adBanners');
    const banners: AdBanner[] = saved ? JSON.parse(saved) : [];
    const filtered = banners.filter(b => b.id !== id);
    localStorage.setItem('adBanners', JSON.stringify(filtered));
    window.dispatchEvent(new Event('bannersUpdated'));
    return true;
  }

  try {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting banner:', error);
      return false;
    }

    // Update localStorage
    await getBanners();
    window.dispatchEvent(new Event('bannersUpdated'));
    return true;
  } catch (error) {
    console.error('Error in deleteBanner:', error);
    return false;
  }
}

// 실시간 구독 설정
export function subscribeToBanners(callback: (banners: AdBanner[]) => void) {
  if (!supabase) {
    console.warn('Supabase not configured, real-time updates not available');
    return null;
  }

  const subscription = supabase
    .channel('banners_channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'banners' },
      async () => {
        // Refresh banners when any change occurs
        const banners = await getBanners();
        callback(banners);
        window.dispatchEvent(new Event('bannersUpdated'));
      }
    )
    .subscribe();

  return subscription;
}

// 구독 해제
export function unsubscribeFromBanners(subscription: any) {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
}