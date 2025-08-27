# GitHub Actions 캐시 클리어 배포 설정

이 repository는 두 가지 캐시 전략을 제공하는 커스텀 GitHub Actions 워크플로우를 사용합니다.

## 설정 방법

1. **GitHub Repository 설정 변경**
   - Repository → Settings → Pages
   - Source를 "Deploy from a branch"에서 **"GitHub Actions"**로 변경

## 워크플로우 종류

### 1. 일반 배포 (`deploy.yml`)
- `main` 브랜치 push 시 자동 실행
- Jekyll 캐시만 비움 (안정적)
- Bundle 캐시는 유지하여 빠른 빌드

### 2. 완전 캐시 클리어 배포 (`clear-cache-deploy.yml`)
- **수동 실행 전용**
- 모든 캐시 완전 삭제 (Bundle, Jekyll, Node modules)
- 문제 발생 시나 완전히 새로 빌드할 때 사용

## 캐시 클리어 옵션

### 🔄 일반 배포 (자동)
- Jekyll 캐시: `_site`, `.jekyll-cache`, `.sass-cache` 삭제
- Bundle 캐시: 유지 (빠른 빌드)
- 브라우저 캐시: 빌드 시간으로 무효화

### 🧹 완전 캐시 클리어 (수동)
- **모든 캐시 삭제**: Bundle, Jekyll, Node modules
- **Actions 탭**에서 "Clear All Cache and Deploy" 워크플로우 실행
- 빌드 시간은 더 오래 걸리지만 완전히 깔끔한 빌드

## 추가 기능

- 빌드 정보가 `_data/build_info.yml`에 자동 기록
- 빌드 시간과 커밋 SHA가 포함되어 캐시 무효화에 활용

## 주의사항

- 첫 설정 후 GitHub Pages Source 설정을 반드시 "GitHub Actions"로 변경해야 함
- 기존 github-pages gem 사용으로 인한 제약 없이 최신 Jekyll 기능 활용 가능