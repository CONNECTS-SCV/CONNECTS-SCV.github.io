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
    department: '경영',
    bio: 'CONNECTS의 비전과 전략을 수립하고 회사를 이끌어가고 있습니다.',
    avatar: '/avatars/daehee-lee.png',
    email: 'daehee.lee@connects.ai'
  },
  'author2': {
    id: 'author2',
    name: '정종관',
    title: '연구원',
    department: '연구',
    bio: '단백질 구조 예측과 AI 알고리즘 개발을 담당하고 있습니다.',
    avatar: '/avatars/jongkwan-jung.png',
    email: 'jongkwan.jung@connects.ai'
  },
  'author3': {
    id: 'author3',
    name: '엄소현',
    title: '디자이너',
    department: '디자인',
    bio: 'UX/UI 디자인과 사용자 경험 설계를 담당하고 있습니다.',
    avatar: '/avatars/sohyun-um.png',
    email: 'sohyun.um@connects.ai'
  },
  'author4': {
    id: 'author4',
    name: '차성욱',
    title: '개발자',
    department: '개발',
    bio: '프론트엔드 개발과 웹 플랫폼 구축을 담당하고 있습니다.',
    avatar: '/avatars/sungwook-cha.png',
    email: 'sungwook.cha@connects.ai'
  },
  'author5': {
    id: 'author5',
    name: '김민태',
    title: '개발자',
    department: '개발',
    bio: '백엔드 시스템과 인프라 관리를 담당하고 있습니다.',
    avatar: '/avatars/mintae-kim.png',
    email: 'mintae.kim@connects.ai'
  },
  'author6': {
    id: 'author6',
    name: 'CURIE',
    title: '회사 계정',
    department: 'CONNECTS',
    bio: 'CONNECTS의 공식 회사 계정입니다.',
    avatar: '/avatars/curie-logo.png',
    email: 'info@connects.ai'
  }
};

export function getAuthor(authorId: string): Author | null {
  return authors[authorId] || null;
}

export function getAllAuthors(): Author[] {
  return Object.values(authors);
}
