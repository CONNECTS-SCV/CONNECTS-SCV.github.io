// 네이버 메일 전용 템플릿 (generateUniversalEmailTemplate 구조를 네이버에 맞게 수정)
// 토스증권 방식으로 완전한 인라인 스타일 적용

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

export function generateNaverEmailTemplate(data: EmailTemplateData): string {
  const {
    recipientName = 'Customer',
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
    .replace(/!!!|!!|\$\$\$|\*\*\*/g, '')
    .replace(/[A-Z]{4,}/g, (match) => match.charAt(0) + match.slice(1).toLowerCase());

  // 줄바꿈을 <br> 태그로 변환 및 URL 자동 링크
  const formattedContent = mainContent
    .replace(/\n/g, '<br>')
    .replace(/https?:\/\/[^\s<>"]+/g, (url) => `<a href="${url}" style="color: rgb(76, 73, 234);">${url}</a>`);

  // 현재 날짜
  const currentDate = new Date().toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 네이버 메일 호환 템플릿 (토스증권 스타일 방식)
  return `<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeSubject}</title>
</head>
<body style="margin: 0px; padding: 0px; word-spacing: normal; background-color: rgb(255, 255, 255);">
<div style="text-size-adjust: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  
  <!-- 프리헤더 텍스트 (이메일 미리보기용) -->
  <div style="display: none; font-size: 1px; color: rgb(255, 255, 255); line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${safeSubject.substring(0, 150)}
  </div>
  
  <!-- 메인 컨테이너 -->
  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0px; padding: 0px;">
    <tbody>
      <tr>
        <td align="center" style="padding: 0px;">
          
          <table border="0" cellpadding="0" cellspacing="0" style="width: 94%; max-width: 600px; margin: 0px; padding: 0px; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 22px; color: rgb(54, 54, 54);">
            <tbody>
              
              <!-- 헤더 -->
              <tr>
                <td style="padding: 40px 30px 20px 30px;">
                  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0px; padding: 0px;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px;">
                          <!-- 텍스트 로고 사용 (이미지 차단 방지) -->
                          <h1 style="margin: 0px; font-size: 28px; font-weight: bold; color: rgb(76, 73, 234); letter-spacing: -0.5px;">
                            Curieus
                          </h1>
                          <p style="margin: 5px 0px 0px 0px; font-size: 12px; color: rgb(136, 136, 136);">
                            AI-Powered Analysis Platform
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              
              <!-- 제목 영역 -->
              <tr>
                <td style="padding: 0px 30px 30px 30px;">
                  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0px; padding: 0px;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px 0px 20px 0px; border-bottom: 1px solid rgb(229, 229, 229);">
                          <p style="margin: 0px 0px 10px 0px; font-size: 12px; color: rgb(136, 136, 136);">
                            ${currentDate}
                          </p>
                          <h2 style="margin: 0px; font-size: 22px; font-weight: bold; color: rgb(34, 34, 34); line-height: 30px;">
                            ${safeSubject}
                          </h2>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              
              <!-- 본문 -->
              <tr>
                <td style="padding: 0px 30px 30px 30px;">
                  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0px; padding: 0px;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px;">
                          <p style="margin: 0px 0px 20px 0px; font-size: 14px; color: rgb(34, 34, 34); font-weight: 500;">
                            ${language === 'ko' ? `안녕하세요, ${recipientName}님` : `Hello, ${recipientName}`}
                          </p>
                          <p style="margin: 0px; font-size: 14px; line-height: 24px; color: rgb(54, 54, 54);">
                            ${formattedContent}
                          </p>
                          
                          ${buttonText && buttonUrl ? `
                          <!-- CTA 버튼 -->
                          <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0px;">
                            <tbody>
                              <tr>
                                <td style="padding: 0px;">
                                  <a href="${buttonUrl}" target="_blank" rel="noopener noreferrer" style="background: rgb(51, 51, 51); text-decoration: none; padding: 12px 30px; color: rgb(255, 255, 255); border-radius: 4px; display: inline-block; font-weight: bold; font-size: 14px;">
                                    ${buttonText}
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          ` : ''}
                          
                          ${footerText ? `
                          <!-- 추가 정보 박스 -->
                          <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 20px 0px;">
                            <tbody>
                              <tr>
                                <td style="padding: 15px; background-color: rgb(248, 249, 250); border-left: 3px solid rgb(76, 73, 234);">
                                  <p style="margin: 0px; font-size: 13px; line-height: 20px; color: rgb(85, 85, 85);">
                                    ${footerText}
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          ` : ''}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              
              <!-- 푸터 -->
              <tr>
                <td style="padding: 30px; text-align: center; background-color: rgb(250, 250, 250);">
                  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0px; padding: 0px;">
                    <tbody>
                      <tr>
                        <td style="padding: 0px 0px 10px 0px; border-top: 1px solid rgb(229, 229, 229);">
                          <p style="margin: 20px 0px 10px 0px; font-size: 16px; font-weight: bold; color: rgb(51, 51, 51);">
                            Curieus
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0px;">
                          <p style="margin: 0px 0px 5px 0px; font-size: 12px; line-height: 18px; color: rgb(119, 119, 119);">
                            <a href="https://curieus.net" style="color: rgb(76, 73, 234); text-decoration: underline;">${language === 'ko' ? '홈페이지' : 'Homepage'}</a> | 
                            <a href="mailto:curieus@connects.so" style="color: rgb(76, 73, 234); text-decoration: underline;">${language === 'ko' ? '문의하기' : 'Contact'}</a>
                          </p>
                          <p style="margin: 5px 0px; font-size: 11px; color: rgb(153, 153, 153);">
                            ${language === 'ko' 
                              ? '경기도 성남시 분당구 판교로289번길 20' 
                              : '20, Pangyo-ro 289beon-gil, Bundang-gu, Seongnam-si'}
                          </p>
                          <p style="margin: 10px 0px 0px 0px; font-size: 11px; color: rgb(153, 153, 153);">
                            ${language === 'ko' 
                              ? '본 메일은 서비스 이용자에게 발송되는 안내 메일입니다.' 
                              : 'This is a service notification email.'}
                          </p>
                          <p style="margin: 5px 0px 0px 0px; font-size: 10px; color: rgb(170, 170, 170);">
                            © 2025 Curieus. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              
            </tbody>
          </table>
          
        </td>
      </tr>
    </tbody>
  </table>
</div>
</body>
</html>`;
}