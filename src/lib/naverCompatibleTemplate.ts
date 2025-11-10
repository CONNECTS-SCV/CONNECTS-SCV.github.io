// 네이버, Gmail 등 모든 이메일 클라이언트에서 작동하는 유니버설 템플릿
// 인라인 스타일만 사용, 이미지는 SVG Base64 인코딩

export interface EmailTemplateData {
  recipientName?: string;
  recipientEmail?: string;
  subject: string;
  mainContent: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
  language?: 'ko' | 'en';
}

// 작은 크기의 SVG 로고 (모든 이메일 클라이언트 호환)
const LOGO_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjNGM0OWVhIi8+CiAgPHRleHQgeD0iNzUiIHk9IjI3IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q3VyaWV1czwvdGV4dD4KPC9zdmc+';

export function generateNaverCompatibleTemplate(data: EmailTemplateData): string {
  const {
    recipientName = '고객님',
    recipientEmail = '',
    subject,
    mainContent,
    buttonText,
    buttonUrl,
    footerText,
    language = 'ko'
  } = data;

  // 스팸 필터 회피를 위한 제목 정제
  const safeSubject = subject
    .replace(/free|무료|100%|보장|클릭하세요|지금|당장|긴급|할인|특가/gi, '')
    .replace(/!!!|!!|\$\$\$|\*\*\*/g, '');

  // 줄바꿈을 <br> 태그로 변환
  const formattedContent = mainContent.replace(/\n/g, '<br>');

  // 현재 날짜
  const currentDate = new Date().toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Malgun Gothic','맑은 고딕',sans-serif;">
  
  <!-- 전체 래퍼 -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f6f6f6;">
    <tr>
      <td align="center" style="padding:40px 0;">
        
        <!-- 메인 컨테이너 -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:8px;">
          
          <!-- 헤더 -->
          <tr>
            <td style="padding:40px 40px 20px 40px;border-bottom:2px solid #f0f0f0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- 로고 이미지 -->
                    <img src="${LOGO_BASE64}" alt="Curieus" style="display:block;max-width:150px;height:auto;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:8px;">
                    <span style="font-size:12px;color:#888888;">AI-Powered Analysis Platform</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- 제목 -->
          <tr>
            <td style="padding:30px 40px 0 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size:11px;color:#888888;">${currentDate}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:8px;">
                    <h1 style="margin:0;font-size:24px;font-weight:bold;color:#1a1a1a;line-height:1.4;">
                      ${safeSubject}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- 본문 -->
          <tr>
            <td style="padding:30px 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <p style="margin:0 0 16px 0;font-size:15px;color:#1a1a1a;font-weight:500;">
                      ${language === 'ko' ? `안녕하세요, ${recipientName}님` : `Hello, ${recipientName}`}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin:0;font-size:15px;line-height:1.6;color:#333333;">
                      ${formattedContent}
                    </p>
                  </td>
                </tr>
                
                ${buttonText && buttonUrl ? `
                <!-- CTA 버튼 -->
                <tr>
                  <td style="padding-top:30px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color:#4c49ea;border-radius:6px;">
                          <a href="${buttonUrl}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                            ${buttonText}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                
                ${footerText ? `
                <!-- 추가 정보 -->
                <tr>
                  <td style="padding-top:30px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background-color:#f8f9fa;border-left:4px solid #4c49ea;padding:16px;">
                          <p style="margin:0;font-size:14px;line-height:1.5;color:#555555;">
                            ${footerText}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
          
          <!-- 푸터 -->
          <tr>
            <td style="background-color:#fafafa;padding:30px 40px;border-top:1px solid #e5e5e5;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <img src="${LOGO_BASE64}" alt="Curieus" style="display:block;width:100px;height:auto;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:0 0 8px 0;font-size:13px;color:#666666;">
                      <a href="https://curieus.net" style="color:#4c49ea;text-decoration:none;">${language === 'ko' ? '홈페이지' : 'Homepage'}</a>
                      <span style="color:#cccccc;"> | </span>
                      <a href="mailto:curieus@connects.so" style="color:#4c49ea;text-decoration:none;">${language === 'ko' ? '문의하기' : 'Contact'}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:0 0 4px 0;font-size:12px;color:#999999;">
                      ${language === 'ko' 
                        ? '경기도 성남시 분당구 판교로289번길 20' 
                        : '20, Pangyo-ro 289beon-gil, Bundang-gu, Seongnam-si'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:8px 0 0 0;font-size:11px;color:#aaaaaa;">
                      © 2025 Curieus. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        <!-- 메인 컨테이너 끝 -->
        
      </td>
    </tr>
  </table>
  <!-- 전체 래퍼 끝 -->
  
</body>
</html>`;
}