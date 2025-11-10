// 수신자 도메인에 따라 적절한 이메일 템플릿을 선택하는 어댑티브 템플릿

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
    return generateNaverOnlyTemplate(data);
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

// 네이버 전용 템플릿 (인라인 스타일, Base64 이미지)
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

  // 네이버용: 작은 Base64 SVG 로고
  const LOGO_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjNGM0OWVhIi8+CiAgPHRleHQgeD0iNzUiIHk9IjI3IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q3VyaWV1czwvdGV4dD4KPC9zdmc+';

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,'Malgun Gothic','맑은 고딕',sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f6f6f6;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff;">
          <tr>
            <td style="padding:40px;border-bottom:2px solid #f0f0f0;">
              <img src="${LOGO_BASE64}" alt="Curieus" style="display:block;max-width:150px;" />
              <span style="display:block;margin-top:8px;font-size:12px;color:#888888;">AI-Powered Analysis Platform</span>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 40px;">
              <span style="display:block;font-size:11px;color:#888888;">${currentDate}</span>
              <h1 style="margin:16px 0;font-size:24px;color:#1a1a1a;">${safeSubject}</h1>
              <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;font-weight:500;">
                ${language === 'ko' ? `안녕하세요, ${recipientName}님` : `Hello, ${recipientName}`}
              </p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#333333;">${formattedContent}</p>
              ${buttonText && buttonUrl ? `
              <table border="0" cellspacing="0" cellpadding="0" style="margin-top:30px;">
                <tr>
                  <td style="background-color:#4c49ea;border-radius:6px;">
                    <a href="${buttonUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                      ${buttonText}
                    </a>
                  </td>
                </tr>
              </table>` : ''}
              ${footerText ? `
              <table width="100%" style="margin-top:30px;">
                <tr>
                  <td style="background-color:#f8f9fa;border-left:4px solid #4c49ea;padding:16px;">
                    <p style="margin:0;font-size:14px;color:#555555;">${footerText}</p>
                  </td>
                </tr>
              </table>` : ''}
            </td>
          </tr>
          <tr>
            <td style="background-color:#fafafa;padding:30px 40px;text-align:center;">
              <img src="${LOGO_BASE64}" alt="Curieus" style="display:block;width:100px;margin:0 auto 16px;" />
              <p style="margin:0 0 8px;font-size:13px;color:#666666;">
                <a href="https://curieus.net" style="color:#4c49ea;text-decoration:none;">홈페이지</a> | 
                <a href="mailto:curieus@connects.so" style="color:#4c49ea;text-decoration:none;">문의하기</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#999999;">© 2025 Curieus. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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