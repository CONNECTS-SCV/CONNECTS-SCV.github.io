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
  const formattedContent = mainContent.replace(/\n/g, '<br>');

  // 네이버 메일 호환 템플릿
  return `<div style="margin: 0px; padding: 0px; background-color: #fafafa; width: 100%; line-height: 100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="630" style="margin: 0px; padding: 0px; width: 100%;">
    <tbody>
      <tr>
        <td>
          <table border="0" cellpadding="0" cellspacing="0" width="630" style="border-top: 0px solid transparent; border-radius: 0px; margin: 0px auto; padding: 4px 24px 24px 24px; background-color: #ffffff;">
            <tbody>
              <!-- 헤더 이미지/로고 -->
              <tr>
                <td style="padding: 20px 0px;">
                  <img src="https://curieus.net/assets/logo.png" alt="Curieus" style="max-width: 150px; display: block;" loading="lazy">
                </td>
              </tr>
              
              <!-- 제목 -->
              <tr>
                <td>
                  <h1 style="display: block; font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-size: 24px; font-weight: bold; line-height: 1.5; margin: 0px; padding: 20px 0px 10px; text-align: left; color: #222222;">
                    ${safeSubject}
                    <br><br>
                  </h1>
                </td>
              </tr>
              
              <!-- 본문 내용 -->
              <tr>
                <td>
                  <p style="color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-size: 14px; line-height: 1.6;">
                    ${language === 'ko' ? `안녕하세요, ${recipientName}님` : `Hello, ${recipientName}`}<br><br>
                    ${formattedContent}
                    <br><br>
                    
                    ${buttonText && buttonUrl ? `
                    <br>
                    <a href="${buttonUrl}" style="display: inline-block; padding: 12px 24px; background-color: #333333; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif; font-size: 14px; font-weight: bold; border-radius: 4px;" target="_blank" rel="noreferrer noopener">${buttonText}</a>
                    <br><br>
                    ` : ''}
                    
                    ${footerText ? `
                    <br>
                    <div style="background-color: #f8f9fa; border-left: 3px solid #667eea; padding: 15px 20px; margin: 20px 0px; font-size: 13px; color: #555555; line-height: 1.6;">
                      ${footerText}
                    </div>
                    <br>
                    ` : ''}
                    
                  </p>
                </td>
              </tr>
              
              <!-- 푸터 -->
              <tr>
                <td style="margin: 50px auto; padding: 20px 0px 8px;">
                  <hr style="color: #333333; background-color: #E5E8EB; height: 1px; border: 0px; margin: 30px 0px 20px;">
                  <img src="https://curieus.net/assets/logo.png" alt="Curieus" style="width: 100px;" loading="lazy">
                  <p style="color: #777777; font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif; font-size: 12px; line-height: 1.6;">
                    <strong>Curieus</strong> ${language === 'ko' ? '경기도 성남시 분당구 판교로289번길 20' : '20, Pangyo-ro 289beon-gil, Bundang-gu, Seongnam-si'}<br>
                    <strong>${language === 'ko' ? '홈페이지' : 'Homepage'}</strong> <a href="https://curieus.net" style="color: #888888;" target="_blank" rel="noreferrer noopener">curieus.net</a> | 
                    <strong>${language === 'ko' ? '이메일' : 'Email'}</strong> curieus@connects.so<br>
                    ${language === 'ko' 
                      ? '본 메일은 Curieus 서비스 이용자에게 발송되는 안내 메일입니다.' 
                      : 'This is a service notification email for Curieus users.'}<br>
                    Copyright ⓒ Curieus. All Rights Reserved
                  </p>
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