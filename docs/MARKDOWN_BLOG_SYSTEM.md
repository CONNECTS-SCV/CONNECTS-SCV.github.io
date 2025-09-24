# 마크다운 기반 블로그 시스템 사용 가이드

## 📝 개요

CONNECTS 웹사이트에 마크다운 기반 블로그 시스템이 구현되었습니다. 이 시스템을 통해 연구진과 팀원들이 쉽고 편리하게 블로그 포스트를 작성하고 관리할 수 있습니다.

## 🏗️ 시스템 구조

### 핵심 구성요소

```
src/
├── data/
│   └── authors.ts          # 작성자 정보 관리
├── lib/
│   ├── markdown.ts         # 마크다운 파싱 유틸리티
│   └── posts.ts           # 포스트 관리 함수들
└── components/
    └── post/
        └── PostList.tsx   # 포스트 목록 컴포넌트

posts/                      # 실제 마크다운 파일 저장소
├── boltz-2-protein-structure-docking.md
├── alphafold3-integration-curie.md
└── ...

app/
└── post/
    └── [id]/
        └── page.tsx       # 개별 포스트 페이지
```

## ✍️ 포스트 작성 방법

### 1. 마크다운 파일 생성

`posts/` 디렉토리에 새 마크다운 파일을 생성합니다:

```bash
touch posts/new-post-title.md
```

### 2. Front Matter 작성

각 마크다운 파일의 상단에 다음 형식의 메타데이터를 추가합니다:

```markdown
---
layout: post
title: "포스트 제목"
description: >
  포스트에 대한 간단한 설명을 여기에 작성합니다.
  여러 줄로 작성할 수 있습니다.
categories:
  - analysis
  - structure
  - docking
tags: [Boltz-2, AI, 단백질, 구조예측]
author: research-team
date: 2024-03-20
---
```

#### Front Matter 필드 설명

| 필드 | 필수 | 설명 | 예시 |
|------|------|------|------|
| `layout` | ✅ | 레이아웃 타입 (항상 "post") | `post` |
| `title` | ✅ | 포스트 제목 | `"Boltz-2 소개"` |
| `description` | ✅ | 포스트 요약 설명 | `"AI 기반 도킹 모델 소개"` |
| `categories` | ✅ | 카테고리 목록 | `[analysis, product]` |
| `tags` | ✅ | 태그 목록 | `[AI, 단백질, 도킹]` |
| `author` | ✅ | 작성자 ID | `research-team` |
| `date` | ✅ | 발행 날짜 (YYYY-MM-DD) | `2024-03-20` |

### 3. 본문 작성

Front Matter 이후에 마크다운 문법을 사용하여 본문을 작성합니다:

```markdown
## 🔬 섹션 제목

**Boltz-2**는 단백질 구조 예측을 위한 혁신적인 도구입니다.

### 주요 특징

- **높은 정확도**: 98% 예측 정확도 달성
- **빠른 속도**: 기존 대비 10배 향상
- **사용 편의성**: 직관적인 인터페이스

### 사용 방법

1. 단백질 서열 입력
2. 파라미터 설정
3. 분석 실행

```python
# 코드 예시
protein_sequence = "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKA"
```

> 중요한 내용은 인용구로 강조할 수 있습니다.

| 항목 | 값 |
|------|-----|
| 정확도 | 98% |
| 속도 | 10배 향상 |

---

## 결론

Boltz-2는 연구에 혁명을 가져올 것입니다.

[공식 문서](https://docs.connects.ai) 참고
```

## 👥 작성자 관리

### 새로운 작성자 추가

`src/data/authors.ts` 파일을 수정하여 새 작성자를 추가합니다:

```typescript
export const authors: Record<string, Author> = {
  // 기존 작성자들...
  
  'new-author-id': {
    id: 'new-author-id',
    name: '홍길동',
    title: '선임 연구원',
    department: 'AI Research',
    bio: '인공지능과 생물학의 융합 연구를 진행하고 있습니다.',
    avatar: '/avatars/hong-gildong.png',
    email: 'hong@connects.ai',
    linkedin: 'https://linkedin.com/in/hong-gildong'
  }
};
```

### 기존 작성자 ID 목록

| ID | 이름 | 부서 |
|----|------|------|
| `research-team` | 연구개발팀 | AI Research & Development |
| `ai-team` | AI 연구팀 | Machine Learning |
| `product-team` | 제품팀 | Product Development |
| `business-team` | 경영지원팀 | Business Development |
| `engineering-team` | 엔지니어링팀 | Software Engineering |

## 🏷️ 카테고리 및 태그 가이드라인

### 권장 카테고리

**제품 관련**
- `product` - 제품 소개, 업데이트
- `update` - 버전 업데이트, 패치
- `release` - 새 제품 출시

**기술 관련**
- `analysis` - 분석 도구 소개
- `algorithm` - 알고리즘 개선
- `structure` - 구조 예측 관련
- `docking` - 도킹 시뮬레이션
- `prediction` - 예측 모델

**비즈니스 관련**
- `partnership` - 파트너십, 협력
- `research` - 연구 성과
- `announcement` - 공지사항

**개발 관련**
- `beta` - 베타 테스트
- `api` - API 관련
- `tutorial` - 사용법 가이드

### 태그 명명 규칙

1. **제품명**: `Curie`, `Twin`, `Pensive`
2. **기술명**: `AlphaFold3`, `GPU 가속`, `CUDA`
3. **분야**: `단백질 구조`, `리간드 도킹`, `네트워크 분석`
4. **일반**: `AI`, `머신러닝`, `신약 개발`

## 🎨 마크다운 스타일링 가이드

### 이모지 사용

섹션 제목에 이모지를 사용하여 가독성을 높입니다:

- 🔬 연구/분석 관련
- 🚀 새로운 기능/출시
- ⚡ 성능 개선
- 💊 신약 개발
- 🤝 파트너십
- 📊 데이터/통계
- ⚠️ 주의사항
- ✅ 완료/성공
- 🎯 목표/계획

### 강조 표현

```markdown
**굵은 글씨로 중요한 내용 강조**
*기울임꼴로 부가 설명*
`코드나 기술 용어`
```

### 링크 작성

```markdown
[링크 텍스트](URL)
[CONNECTS 홈페이지](https://connects.ai)
```

### 표 작성

```markdown
| 헤더1 | 헤더2 | 헤더3 |
|-------|-------|-------|
| 내용1 | 내용2 | 내용3 |
| 내용4 | 내용5 | 내용6 |
```

## 🔄 배포 프로세스

### 1. 로컬 개발

```bash
# 개발 서버 시작
npm run dev

# 포스트 확인
http://localhost:3000
```

### 2. 포스트 추가 워크플로우

1. `posts/` 디렉토리에 마크다운 파일 생성
2. Front Matter와 본문 작성
3. 로컬에서 미리보기 확인
4. Git에 커밋 및 푸시
5. 자동 배포 확인

### 3. 실제 파일 시스템 연동 (향후 개선)

현재는 `app/post/[id]/page.tsx`에 하드코딩된 데이터를 사용하지만, 향후 실제 파일 시스템과 연동하려면:

```typescript
// src/lib/posts.ts에서 실제 파일 읽기
import fs from 'fs';
import path from 'path';

export async function getAllPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames.map(filename => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { metadata, content } = parseMarkdownFrontmatter(fileContents);
    
    return {
      metadata: {
        ...metadata,
        slug: filename.replace('.md', '')
      },
      content,
      excerpt: extractExcerpt(content)
    };
  });
  
  return posts.sort((a, b) => 
    new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
}
```

## 📋 체크리스트

새 포스트 작성 시 다음 사항들을 확인하세요:

### 필수 확인 사항
- [ ] Front Matter 모든 필수 필드 작성
- [ ] 작성자 ID가 `authors.ts`에 존재하는지 확인
- [ ] 제목이 명확하고 구체적인지
- [ ] 설명이 포스트 내용을 잘 요약하는지
- [ ] 카테고리와 태그가 가이드라인에 맞는지
- [ ] 마크다운 문법이 올바른지

### 품질 확인 사항
- [ ] 이모지를 적절히 사용했는지
- [ ] 코드 블록에 언어가 명시되어 있는지
- [ ] 이미지가 있다면 alt 텍스트가 있는지
- [ ] 외부 링크가 올바르게 작동하는지
- [ ] 맞춤법과 문법이 정확한지

### 배포 전 확인
- [ ] 로컬에서 미리보기 확인
- [ ] 모바일 화면에서도 정상 표시되는지
- [ ] 포스트 목록에서 썸네일과 요약이 적절한지

## 🛠️ 문제 해결

### 자주 발생하는 문제들

**Q: 포스트가 목록에 나타나지 않아요**
A: Front Matter의 형식이 올바른지, 모든 필수 필드가 있는지 확인하세요.

**Q: 작성자 정보가 표시되지 않아요**
A: `authors.ts`에 해당 author ID가 등록되어 있는지 확인하세요.

**Q: 마크다운 문법이 제대로 렌더링되지 않아요**
A: 특수 문자가 올바르게 이스케이프되었는지 확인하세요.

**Q: 코드 블록이 깨져서 나와요**
A: 코드 블록의 백틱(```)이 정확히 3개인지, 들여쓰기가 올바른지 확인하세요.

### 지원 및 문의

시스템 관련 문의사항이나 개선 제안은 다음으로 연락주세요:
- 이메일: tech@connects.ai
- 슬랙: #web-development
- GitHub Issues: 해당 저장소의 Issues 탭

---

이 시스템을 통해 CONNECTS의 연구 성과와 기술 발전 사항을 효과적으로 공유할 수 있습니다. 궁금한 점이 있으시면 언제든 문의해 주세요!