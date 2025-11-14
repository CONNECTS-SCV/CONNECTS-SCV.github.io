export interface AdBanner {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  imageUrl?: string;
  backgroundColor: string;
  backgroundType?: 'gradient' | 'solid' | 'image';
  customGradient?: string;
  textColor?: string;
  accentColor?: string;
  badgeText?: string;
  badgeTextEn?: string;
  buttonText?: string;
  buttonTextEn?: string;
  buttonColor?: string;
  link: string;
  linkTarget?: '_blank' | '_self';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  priority: number; // 우선순위 (낮을수록 먼저 표시)
  position?: 'left' | 'right' | 'both';
  slotIndex?: number; // 슬롯 위치 (0부터 시작, 위에서 아래로)
  rotationInterval?: number; // 로테이션 간격 (초 단위, 기본 10초)
  isStatic?: boolean; // true면 로테이션 없이 고정 표시
  animation?: 'none' | 'pulse' | 'bounce' | 'shake';
  layout?: 'default' | 'compact' | 'minimal' | 'card';
  createdAt: string;
  updatedAt: string;
}

export interface BannerFormData {
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  imageUrl?: string;
  backgroundColor: string;
  backgroundType?: 'gradient' | 'solid' | 'image';
  customGradient?: string;
  textColor?: string;
  accentColor?: string;
  badgeText?: string;
  badgeTextEn?: string;
  buttonText?: string;
  buttonTextEn?: string;
  buttonColor?: string;
  link: string;
  linkTarget?: '_blank' | '_self';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  priority: number;
  position?: 'left' | 'right' | 'both';
  slotIndex?: number;
  rotationInterval?: number;
  isStatic?: boolean;
  animation?: 'none' | 'pulse' | 'bounce' | 'shake';
  layout?: 'default' | 'compact' | 'minimal' | 'card';
}