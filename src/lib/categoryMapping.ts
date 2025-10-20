// 카테고리 영어-한글 매핑
export const categoryMap: { [key: string]: string } = {
  'analysis': '분석 모델',
  'release': '릴리즈 노트',
  'feature': '기능 개선',
};

// 카테고리를 한글로 변환하는 함수
export function getCategoryLabel(category: string): string {
  return categoryMap[category] || category;
}

// 여러 카테고리를 한글로 변환하는 함수
export function getCategoryLabels(categories: string[]): string[] {
  return categories.map(cat => getCategoryLabel(cat));
}