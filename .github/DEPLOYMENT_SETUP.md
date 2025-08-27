# GitHub Actions 캐시 클리어 배포 설정

이 repository는 캐시를 자동으로 비우는 커스텀 GitHub Actions 워크플로우를 사용합니다.

## 설정 방법

1. **GitHub Repository 설정 변경**
   - Repository → Settings → Pages
   - Source를 "Deploy from a branch"에서 **"GitHub Actions"**로 변경

2. **워크플로우 동작**
   - `main` 브랜치에 push할 때마다 자동으로 캐시를 비우고 배포
   - 수동으로도 워크플로우 실행 가능 (Actions 탭에서)

## 캐시 클리어 기능

### 자동 캐시 클리어 (main 브랜치 push 시)
- Jekyll 캐시 (`_site`, `.jekyll-cache`, `.sass-cache`)
- Bundle 캐시 (`vendor/bundle`, `.bundle`)
- 빌드 시 타임스탬프 추가로 브라우저 캐시도 무효화

### 수동 캐시 클리어
- GitHub Actions 탭에서 "Build and Deploy Jekyll with Cache Clearing" 워크플로우 수동 실행
- "Clear all caches before build" 옵션 활성화

## 추가 기능

- 빌드 정보가 `_data/build_info.yml`에 자동 기록
- 빌드 시간과 커밋 SHA가 포함되어 캐시 무효화에 활용

## 주의사항

- 첫 설정 후 GitHub Pages Source 설정을 반드시 "GitHub Actions"로 변경해야 함
- 기존 github-pages gem 사용으로 인한 제약 없이 최신 Jekyll 기능 활용 가능