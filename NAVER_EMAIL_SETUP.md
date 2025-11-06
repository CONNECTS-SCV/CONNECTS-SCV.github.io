# Naver Cloud Outbound Mailer 설정 가이드

## 발송 실패 에러: SECURITY_AND_POLICY_ABNORMAL

이 에러는 보안 정책 위반으로 발생합니다.

## 해결 방법

### 1. 발신 도메인 인증 (필수)

Naver Cloud Console에서:

1. **Cloud Outbound Mailer** 메뉴 접속
2. **발신 도메인 관리** 클릭
3. **도메인 추가** 버튼 클릭
4. `connects.so` 입력
5. 제공된 **SPF**, **DKIM** 레코드를 도메인 DNS에 추가

#### DNS 레코드 예시:
```
SPF 레코드:
Type: TXT
Name: @
Value: v=spf1 include:_spf.ncloud.com ~all

DKIM 레코드:
Type: TXT  
Name: ncp._domainkey
Value: (Naver Cloud에서 제공하는 값)
```

### 2. 발신자 이메일 주소 인증

1. **발신자 주소 관리** 메뉴
2. `curieus@connects.so` 추가
3. 인증 이메일 확인

### 3. 테스트용 발신자 주소

도메인 인증이 어려운 경우, 테스트용으로 사용 가능한 주소:

- 개인 Naver 계정: `your-id@naver.com`
- 개인 Gmail: `your-email@gmail.com`

**.env.local 수정:**
```
NEXT_PUBLIC_NCLOUD_SENDER_EMAIL=your-verified-email@domain.com
```

### 4. 이메일 본문 정책

다음 내용 피하기:
- 스팸 의심 키워드
- 과도한 링크
- 대문자로만 작성된 제목
- 특수문자 남용

### 5. API 요청 형식 확인

올바른 요청 형식:
```javascript
{
  senderAddress: "인증된이메일@도메인.com",
  senderName: "CONNECTS",
  recipients: [{
    address: "수신자@이메일.com",
    type: "R"
  }],
  individual: true,
  advertising: false,
  title: "제목",
  body: "내용"
}
```

## 테스트 순서

1. 도메인 DNS 설정 (SPF, DKIM)
2. 30분 대기 (DNS 전파)
3. Naver Cloud Console에서 도메인 인증 확인
4. 발신자 이메일 주소 추가 및 인증
5. 테스트 이메일 발송

## 추가 확인사항

- API Key 권한 확인
- Project에 Cloud Outbound Mailer 서비스 활성화 여부
- 일일 발송 한도 확인

## 지원 문의

문제 지속시 Naver Cloud Platform 고객센터:
- 전화: 1544-5876
- 채팅: Console 우측 하단