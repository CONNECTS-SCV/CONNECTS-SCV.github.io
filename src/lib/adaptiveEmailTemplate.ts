// 수신자 도메인에 따라 적절한 이메일 템플릿을 선택하는 어댑티브 템플릿

import { generateNaverEmailTemplate } from './naverEmailTemplate';

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

// 이메일 도메인 확인 함수
export function isNaverEmail(email: string): boolean {
  const naverDomains = ['naver.com', 'hanmail.net', 'daum.net'];
  const domain = email.toLowerCase().split('@')[1];
  return naverDomains.some(d => domain?.includes(d));
}

// 수신자 이메일에 따라 적절한 템플릿 선택
export function generateAdaptiveEmailTemplate(data: EmailTemplateData): string {
  const { recipientEmail = '' } = data;
  
  // 네이버 계열 이메일인 경우 네이버 호환 템플릿 사용
  if (isNaverEmail(recipientEmail)) {
    return generateNaverEmailTemplate(data);
  }
  
  // Gmail 및 기타 이메일은 일반 템플릿 사용
  return generateGmailTemplate(data);
}

// Gmail 및 기타 이메일용 템플릿 (외부 이미지 URL 사용)
export function generateGmailTemplate(data: EmailTemplateData): string {
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

  const safeSubject = subject
    .replace(/free|무료|100%|보장|클릭하세요|지금|당장|긴급|할인|특가/gi, '')
    .replace(/!!!|!!|\$\$\$|\*\*\*/g, '');

  const formattedContent = mainContent.replace(/\n/g, '<br>');
  const currentDate = new Date().toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Gmail용: 외부 이미지 URL 사용 (CDN 또는 도메인에서 호스팅)
  const logoUrl = 'https://curieus.net/assets/logo.png';

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${safeSubject}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; }
  .header { padding: 40px; border-bottom: 2px solid #f0f0f0; }
  .content { padding: 40px; }
  .footer { padding: 30px 40px; background: #fafafa; text-align: center; }
  .button { display: inline-block; padding: 14px 32px; background: #4c49ea; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
  .logo { max-width: 150px; height: auto; }
</style>
</head>
<body style="margin:0;padding:0;background:#f6f6f6;">
  <div class="container">
    <div class="header">
      <img src="${logoUrl}" alt="Curieus" class="logo" />
      <p style="margin-top:8px;font-size:12px;color:#888;">AI-Powered Analysis Platform</p>
    </div>
    <div class="content">
      <p style="font-size:11px;color:#888;">${currentDate}</p>
      <h1 style="font-size:24px;margin:16px 0;">${safeSubject}</h1>
      <p style="font-size:15px;font-weight:500;margin-bottom:16px;">
        ${language === 'ko' ? `안녕하세요, ${recipientName}님` : `Hello, ${recipientName}`}
      </p>
      <p style="font-size:15px;line-height:1.6;color:#333;">${formattedContent}</p>
      ${buttonText && buttonUrl ? `
      <div style="margin-top:30px;">
        <a href="${buttonUrl}" class="button">${buttonText}</a>
      </div>` : ''}
      ${footerText ? `
      <div style="margin-top:30px;padding:16px;background:#f8f9fa;border-left:4px solid #4c49ea;">
        <p style="margin:0;font-size:14px;color:#555;">${footerText}</p>
      </div>` : ''}
    </div>
    <div class="footer">
      <img src="${logoUrl}" alt="Curieus" style="width:100px;margin-bottom:16px;" />
      <p style="margin:0 0 8px;font-size:13px;">
        <a href="https://curieus.net" style="color:#4c49ea;">홈페이지</a> | 
        <a href="mailto:curieus@connects.so" style="color:#4c49ea;">문의하기</a>
      </p>
      <p style="margin:0;font-size:11px;color:#999;">© 2025 Curieus. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

// 네이버 전용 템플릿 (토스증권 방식으로 스타일 적용)
export function generateNaverOnlyTemplate(data: EmailTemplateData): string {
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

  const safeSubject = subject
    .replace(/free|무료|100%|보장|클릭하세요|지금|당장|긴급|할인|특가/gi, '')
    .replace(/!!!|!!|\$\$\$|\*\*\*/g, '');

  const formattedContent = mainContent.replace(/\n/g, '<br>');
  const currentDate = new Date().toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Curieus 로고 (외부 URL 또는 Base64)
  const logoUrl = 'https://curieus.net/assets/logo.png';
  // 또는 Base64 SVG 사용
  const logoBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjNGM0OWVhIi8+CiAgPHRleHQgeD0iNzUiIHk9IjI3IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q3VyaWV1czwvdGV4dD4KPC9zdmc+';

  // 네이버 메일 호환 템플릿 (토스증권 스타일 방식 적용)
  return `<div style="margin: 0px; padding: 0px; background-color: rgb(246, 246, 246); width: 100%; line-height: 100%;">
    <table border="0" cellpadding="0" cellspacing="0" width="600" style="margin: 0px auto; padding: 0px; width: 100%;">
      <tbody>
        <tr>
          <td>
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="margin: 0px auto; padding: 40px 30px; background-color: rgb(255, 255, 255);">
              <tbody>
                <!-- 헤더 섹션 -->
                <tr>
                  <td style="padding: 0px 0px 20px 0px; border-bottom: 2px solid rgb(240, 240, 240);">
                    <img src="${logoUrl}" alt="Curieus" style="max-width: 150px; height: auto;" loading="lazy">
                    <p style="color: rgb(136, 136, 136); font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', Apple SD Gothic Neo, sans-serif; font-size: 12px; line-height: 1.5; margin: 8px 0px 0px 0px;">
                      AI-Powered Analysis Platform
                    </p>
                  </td>
                </tr>
                
                <!-- 날짜 및 제목 -->
                <tr>
                  <td style="padding: 30px 0px 0px 0px;">
                    <p style="color: rgb(136, 136, 136); font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', Apple SD Gothic Neo, sans-serif; font-size: 11px; margin: 0px 0px 8px 0px;">
                      ${currentDate}
                    </p>
                    <h1 style="display: block; font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', Apple SD Gothic Neo, sans-serif; font-size: 24px; font-weight: bold; line-height: 1.4; margin: 0px; padding: 0px; color: rgb(26, 26, 26);">
                      ${safeSubject}
                    </h1>
                  </td>
                </tr>
                
                <!-- 본문 내용 -->
                <tr>
                  <td style="padding: 30px 0px;">
                    <p style="color: rgb(26, 26, 26); font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', Apple SD Gothic Neo, sans-serif; font-size: 15px; line-height: 1.6; margin: 0px 0px 16px 0px; font-weight: 500;">
                      ${language === 'ko' ? `안녕하세요, ${recipientName}님` : `Hello, ${recipientName}`}
                    </p>
                    <p style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', Apple SD Gothic Neo, sans-serif; font-size: 15px; line-height: 1.6; margin: 0px;">
                      ${formattedContent}
                    </p>
                    
                    ${buttonText && buttonUrl ? `
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0px 0px 0px;">
                      <tbody>
                        <tr>
                          <td style="background-color: rgb(76, 73, 234); border-radius: 6px;">
                            <a href="${buttonUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 32px; color: rgb(255, 255, 255); text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', sans-serif; font-size: 15px; font-weight: 600;">
                              ${buttonText}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    ` : ''}
                    
                    ${footerText ? `
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0px 0px 0px;">
                      <tbody>
                        <tr>
                          <td style="background-color: rgb(248, 249, 250); border-left: 4px solid rgb(76, 73, 234); padding: 16px;">
                            <p style="color: rgb(85, 85, 85); font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', sans-serif; font-size: 14px; line-height: 1.5; margin: 0px;">
                              ${footerText}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    ` : ''}
                  </td>
                </tr>
                
                <!-- 푸터 섹션 -->
                <tr>
                  <td style="padding: 30px 0px 0px 0px;">
                    <hr style="color: rgb(229, 229, 229); background-color: rgb(229, 229, 229); height: 1px; border: 0px; margin: 0px 0px 30px 0px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                        <tr>
                          <td style="text-align: center;">
                            <img src="${logoUrl}" alt="Curieus" style="width: 100px; margin: 0px 0px 16px 0px;" loading="lazy">
                            <p style="color: rgb(102, 102, 102); font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', Apple SD Gothic Neo, sans-serif; font-size: 13px; line-height: 1.6; margin: 0px 0px 8px 0px;">
                              <a href="https://curieus.net" style="color: rgb(76, 73, 234); text-decoration: none;" target="_blank" rel="noreferrer noopener">${language === 'ko' ? '홈페이지' : 'Homepage'}</a>
                              <span style="color: rgb(204, 204, 204);"> | </span>
                              <a href="mailto:curieus@connects.so" style="color: rgb(76, 73, 234); text-decoration: none;">${language === 'ko' ? '문의하기' : 'Contact'}</a>
                            </p>
                            <p style="color: rgb(153, 153, 153); font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', sans-serif; font-size: 12px; line-height: 1.5; margin: 0px 0px 4px 0px;">
                              ${language === 'ko' ? '경기도 성남시 분당구 판교로289번길 20' : '20, Pangyo-ro 289beon-gil, Bundang-gu, Seongnam-si'}
                            </p>
                            <p style="color: rgb(170, 170, 170); font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', sans-serif; font-size: 11px; margin: 8px 0px 0px 0px;">
                              © 2025 Curieus. All Rights Reserved
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
  </div>`;
}

// 여러 수신자에게 보낼 때 각 도메인별로 템플릿 선택
export function generateBatchEmailTemplates(
  recipients: string[], 
  baseData: Omit<EmailTemplateData, 'recipientEmail'>
): Array<{email: string; html: string}> {
  return recipients.map(email => ({
    email,
    html: generateAdaptiveEmailTemplate({
      ...baseData,
      recipientEmail: email,
      recipientName: email.split('@')[0] // 이메일 주소에서 이름 부분 추출
    })
  }));
}