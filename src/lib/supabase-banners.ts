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
      buttonText: banner.button_text,
      buttonTextEn: banner.button_text_en,
      buttonColor: banner.button_color,
      link: banner.link,
      linkTarget: banner.link_target as '_blank' | '_self',
      startDate: banner.start_date,
      endDate: banner.end_date,
      isActive: banner.is_active,
      priority: banner.priority,
      position: banner.position as 'left' | 'right' | 'both',
      slotIndex: banner.slot_index ?? 0,
      rotationInterval: banner.rotation_interval ?? 10000,
      isStatic: banner.is_static ?? false,
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
        button_text: banner.buttonText,
        button_text_en: banner.buttonTextEn,
        button_color: banner.buttonColor,
        link: banner.link,
        link_target: banner.linkTarget,
        start_date: banner.startDate,
        end_date: banner.endDate,
        is_active: banner.isActive,
        priority: banner.priority,
        position: banner.position,
        slot_index: banner.slotIndex ?? 0,
        rotation_interval: banner.rotationInterval ?? 10000,
        is_static: banner.isStatic ?? false,
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
      buttonText: data.button_text,
      buttonTextEn: data.button_text_en,
      buttonColor: data.button_color,
      link: data.link,
      linkTarget: data.link_target as '_blank' | '_self',
      startDate: data.start_date,
      endDate: data.end_date,
      isActive: data.is_active,
      priority: data.priority,
      position: data.position as 'left' | 'right' | 'both',
      slotIndex: data.slot_index ?? 0,
      rotationInterval: data.rotation_interval ?? 10000,
      isStatic: data.is_static ?? false,
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
    const updateData: any = {};
    
    // 각 필드를 명시적으로 확인하고 데이터베이스 형식으로 변환
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.titleEn !== undefined) updateData.title_en = updates.titleEn;
    if (updates.subtitle !== undefined) updateData.subtitle = updates.subtitle;
    if (updates.subtitleEn !== undefined) updateData.subtitle_en = updates.subtitleEn;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.backgroundColor !== undefined) updateData.background_color = updates.backgroundColor;
    if (updates.textColor !== undefined) updateData.text_color = updates.textColor;
    if (updates.buttonText !== undefined) updateData.button_text = updates.buttonText;
    if (updates.buttonTextEn !== undefined) updateData.button_text_en = updates.buttonTextEn;
    if (updates.buttonColor !== undefined) updateData.button_color = updates.buttonColor;
    if (updates.link !== undefined) updateData.link = updates.link;
    if (updates.linkTarget !== undefined) updateData.link_target = updates.linkTarget;
    if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
    if (updates.endDate !== undefined) updateData.end_date = updates.endDate;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.position !== undefined) updateData.position = updates.position;
    if (updates.slotIndex !== undefined) updateData.slot_index = updates.slotIndex;
    if (updates.rotationInterval !== undefined) updateData.rotation_interval = updates.rotationInterval;
    if (updates.isStatic !== undefined) updateData.is_static = updates.isStatic;

    console.log('Updating banner with data:', updateData);

    const { error } = await supabase
      .from('banners')
      .update(updateData)
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
  if (subscription && supabase) {
    supabase.removeChannel(subscription);
  }
}