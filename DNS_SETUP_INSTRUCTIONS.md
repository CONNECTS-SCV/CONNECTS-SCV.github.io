# DNS 설정 가이드 - connects.so

GitHub Pages에서 `connects.so` 커스텀 도메인을 사용하기 위한 DNS 설정 가이드입니다.

## ✅ 완료된 작업

1. **CNAME 파일 생성** - 레포지토리에 `CNAME` 파일이 생성되어 `connects.so`가 입력되었습니다.
2. **_config.yml 업데이트** - URL이 `https://connects.so`로 변경되었습니다.

## 📋 DNS 설정 방법

### 옵션 1: Apex 도메인 (connects.so) 사용 시

도메인 등록업체의 DNS 관리 페이지에서 다음 A 레코드를 추가하세요:

```
Type: A
Name: @ (또는 공백)
Value: 185.199.108.153
TTL: 3600 (또는 기본값)

Type: A
Name: @ (또는 공백)
Value: 185.199.109.153
TTL: 3600 (또는 기본값)

Type: A
Name: @ (또는 공백)
Value: 185.199.110.153
TTL: 3600 (또는 기본값)

Type: A
Name: @ (또는 공백)
Value: 185.199.111.153
TTL: 3600 (또는 기본값)
```

### 옵션 2: www 서브도메인 추가 (권장)

www 서브도메인도 함께 설정하면 더 안정적입니다:

```
Type: CNAME
Name: www
Value: connects-scv.github.io
TTL: 3600 (또는 기본값)
```

## 🔧 GitHub 설정

1. GitHub 레포지토리로 이동: https://github.com/CONNECTS-SCV/CONNECTS-SCV.github.io
2. Settings → Pages로 이동
3. Custom domain 섹션에서:
   - `connects.so` 입력
   - Save 클릭
4. Enforce HTTPS 체크박스 활성화 (DNS 전파 후)

## ⏱️ DNS 전파 시간

- DNS 변경사항이 완전히 적용되는데 최대 24-48시간이 걸릴 수 있습니다.
- 보통 몇 시간 내에 작동하기 시작합니다.

## 🔍 확인 방법

### 1. DNS 전파 확인
```bash
# A 레코드 확인
dig connects.so +noall +answer

# 또는
nslookup connects.so
```

### 2. GitHub Pages 상태 확인
Settings → Pages에서 다음 메시지를 확인:
- ✅ "Your site is published at https://connects.so"

### 3. SSL 인증서 확인
DNS가 올바르게 설정되면 GitHub가 자동으로 Let's Encrypt SSL 인증서를 발급합니다.

## ❌ 일반적인 문제 해결

### "DNS check unsuccessful" 오류
- DNS 레코드가 올바르게 설정되었는지 확인
- DNS 전파를 기다림 (최대 48시간)
- 기존 CNAME이나 A 레코드와 충돌이 없는지 확인

### HTTPS가 작동하지 않음
- DNS 전파 완료 후 Enforce HTTPS 활성화
- 브라우저 캐시 삭제
- 시크릿 모드에서 테스트

### 페이지가 404 오류 표시
- CNAME 파일이 main 브랜치에 있는지 확인
- GitHub Pages가 main 브랜치에서 빌드되고 있는지 확인
- 레포지토리가 public인지 확인

## 📞 도메인 등록업체별 가이드

### Cloudflare
1. DNS 관리 페이지 접속
2. Proxy status를 "DNS only"로 설정 (주황색 구름 → 회색 구름)
3. 위의 A 레코드 추가

### GoDaddy
1. DNS 관리 → DNS Records
2. ADD → Type: A, Host: @, Points to: GitHub IP
3. 각 IP에 대해 반복

### Namecheap
1. Domain List → Manage → Advanced DNS
2. Add New Record → A Record
3. Host: @, Value: GitHub IP

## 🚀 다음 단계

1. 이 파일의 지침에 따라 도메인 등록업체에서 DNS 설정
2. GitHub Pages Settings에서 Custom domain 입력
3. DNS 전파 대기 (수 시간 ~ 48시간)
4. HTTPS 활성화
5. 사이트 접속 테스트

## 📌 참고 링크

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Checker](https://dnschecker.org/) - 전 세계 DNS 전파 상태 확인
- [What's My DNS](https://www.whatsmydns.net/) - DNS 전파 확인 도구