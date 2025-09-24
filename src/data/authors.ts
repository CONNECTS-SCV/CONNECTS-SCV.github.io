export interface Author {
  id: string;
  name: string;
  title: string;
  department: string;
  bio: string;
  avatar?: string;
  email?: string;
  linkedin?: string;
  github?: string;
}

export const authors: Record<string, Author> = {
  'author1': {
    id: 'author1',
    name: '이대희',
    title: '대표이사',
    department: '연구',
    bio: 'CONNECTS의 핵심 AI 알고리즘과 단백질 구조 예측 모델을 개발하는 연구팀입니다.',
    avatar: '/avatars/research-team.png',
    email: 'research@connects.ai'
  },
  'author2': {
    id: 'author2',
    name: '정종관',
    title: '연구원',
    department: '연구',
    bio: '머신러닝과 딥러닝 기술을 활용하여 생물학적 데이터를 분석하는 전문팀입니다.',
    avatar: '/avatars/ai-team.png',
    email: 'ai@connects.ai'
  },
  'author3': {
    id: 'author3',
    name: '엄소현',
    title: '디자이너',
    department: '디자인',
    bio: '사용자 경험을 중심으로 CONNECTS 플랫폼의 제품을 기획하고 개발합니다.',
    avatar: '/avatars/product-team.png',
    email: 'product@connects.ai'
  },
  'author4': {
    id: 'author4',
    name: '차성욱',
    title: '개발자',
    department: '개발',
    bio: '전략적 파트너십과 사업 개발을 담당하는 팀입니다.',
    avatar: '/avatars/business-team.png',
    email: 'business@connects.ai'
  },
  'author5': {
    id: 'author5',
    name: '김민태',
    title: '개발자',
    department: '개발',
    bio: 'CONNECTS 플랫폼의 백엔드와 프론트엔드 개발을 담당합니다.',
    avatar: '/avatars/engineering-team.png',
    email: 'engineering@connects.ai'
  }
};

export function getAuthor(authorId: string): Author | null {
  return authors[authorId] || null;
}

export function getAllAuthors(): Author[] {
  return Object.values(authors);
}
