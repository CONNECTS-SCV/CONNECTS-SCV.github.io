// 네이버 메일 전용 템플릿 (실제 네이버에서 작동하는 형식)

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

  // 줄바꿈을 <br>로 변환
  const formattedContent = mainContent.replace(/\n/g, '<br><br>');

  // 네이버 메일 호환 템플릿 (초단순화 버전)
  return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;">
    <tr>
      <td align="center" style="padding: 20px; background-color: #f5f5f5;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; padding: 30px;">
          
          <!-- 헤더 -->
          <tr>
            <td style="border-bottom: 2px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 30px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <img src="https://curieus.net/assets/logo.png" alt="Curieus" width="150" height="40" style="display: block;">
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 8px;">
                    <font color="#888888" size="2">AI-Powered Analysis Platform</font>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- 날짜와 제목 -->
          <tr>
            <td style="padding: 30px 0 0 0;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <font color="#888888" size="1">${new Date().toLocaleDateString('ko-KR')}</font>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 10px;">
                    <font color="#1a1a1a" size="5"><b>${safeSubject}</b></font>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- 본문 -->
          <tr>
            <td style="padding: 30px 0;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <font color="#1a1a1a" size="3"><b>${language === 'ko' ? `안녕하세요, ${recipientName}님` : `Hello, ${recipientName}`}</b></font>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <font color="#333333" size="3">${formattedContent}</font>
                  </td>
                </tr>
                
                ${buttonText && buttonUrl ? `
                <tr>
                  <td style="padding-top: 30px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color: #4c49ea; padding: 14px 32px;">
                          <a href="${buttonUrl}" style="color: #ffffff; text-decoration: none; font-weight: bold;" target="_blank">${buttonText}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                
                ${footerText ? `
                <tr>
                  <td style="padding-top: 30px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; border-left: 4px solid #4c49ea;">
                      <tr>
                        <td style="padding: 16px;">
                          <font color="#555555" size="2">${footerText}</font>
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
            <td style="border-top: 1px solid #e5e5e5; padding-top: 30px; text-align: center;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <img src="https://curieus.net/assets/logo.png" alt="Curieus" width="100" style="display: block; margin: 0 auto 16px auto;">
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <font color="#666666" size="2">
                      <a href="https://curieus.net" style="color: #4c49ea; text-decoration: none;" target="_blank">${language === 'ko' ? '홈페이지' : 'Homepage'}</a>
                      <font color="#cccccc"> | </font>
                      <a href="mailto:curieus@connects.so" style="color: #4c49ea; text-decoration: none;">${language === 'ko' ? '문의하기' : 'Contact'}</a>
                    </font>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <font color="#999999" size="1">
                      ${language === 'ko' ? '경기도 성남시 분당구 판교로289번길 20' : '20, Pangyo-ro 289beon-gil, Bundang-gu, Seongnam-si'}<br>
                      © 2025 Curieus. All Rights Reserved
                    </font>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>`;
}