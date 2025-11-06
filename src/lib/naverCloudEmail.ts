// 네이버 클라우드 Cloud Outbound Mailer 이메일 전송 서비스
// https://guide.ncloud-docs.com/docs/ko/cloudoutboundmailer-overview

import crypto from 'crypto';

interface EmailData {
  to: string[];
  subject: string;
  body: string;
  isHtml?: boolean;
}

interface NaverCloudEmailConfig {
  accessKey: string;
  secretKey: string;
  serviceId: string;
  senderAddress: string;
  senderName?: string;
}

// 네이버 클라우드 설정 - 환경변수로 관리
const config: NaverCloudEmailConfig = {
  accessKey: process.env.NEXT_PUBLIC_NCP_ACCESS_KEY || '',
  secretKey: process.env.NEXT_PUBLIC_NCP_SECRET_KEY || '',
  serviceId: '', // Service ID는 Cloud Outbound Mailer v2에서는 사용하지 않음
  senderAddress: process.env.NEXT_PUBLIC_NCLOUD_SENDER_EMAIL || 'noreply@connects.com',
  senderName: 'CONNECTS',
};

// Debug: Check if environment variables are loaded
if (typeof window !== 'undefined') {
  console.log('Naver Cloud Email Config:', {
    hasAccessKey: !!config.accessKey,
    hasSecretKey: !!config.secretKey,
    senderAddress: config.senderAddress
  });
}

// HMAC 서명 생성
function makeSignature(method: string, url: string, timestamp: string): string {
  const space = ' ';
  const newLine = '\n';
  const hmac = crypto.createHmac('sha256', config.secretKey);

  const message = method + space + url + newLine + timestamp + newLine + config.accessKey;
  hmac.update(message);

  return hmac.digest('base64');
}

// 네이버 클라우드 이메일 전송 API 호출 (Next.js API Route 사용)
export async function sendEmailWithNaverCloud(data: EmailData): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Sending email via API route...');
    console.log('Recipients:', data.to);

    // Next.js API route로 요청 전송
    const response = await fetch('https://send-email.tumornavigator.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: data.to,
        subject: data.subject,
        body: data.body
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('Email sent successfully:', result.requestId);
      return {
        success: true,
        message: result.message || '이메일이 성공적으로 전송되었습니다.'
      };
    } else {
      console.error('Email API error:', result);
      return {
        success: false,
        message: result.message || '이메일 전송에 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('Email sending error:', error);

    // CORS 에러 처리
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        success: false,
        message: 'CORS 오류: 브라우저에서 직접 이메일을 전송할 수 없습니다. 서버리스 함수나 백엔드 API를 사용하세요.'
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : '이메일 전송 중 오류가 발생했습니다.'
    };
  }
}

// 이메일 전송 상태 확인
export async function checkEmailStatus(requestId: string): Promise<any> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_NCP_MAIL_API_URL || 'https://mail.apigw.ntruss.com';
    const apiPath = `/api/v1/mails/requests/${requestId}`;
    const url = `${baseUrl}${apiPath}`;

    const timestamp = Date.now().toString();
    const signature = makeSignature('GET', apiPath, timestamp);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': config.accessKey,
        'x-ncp-apigw-signature-v2': signature,
        'x-ncp-lang': 'ko-KR'
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Error checking email status:', error);
    return null;
  }
}

// 이메일 템플릿
export function createEmailTemplate(
  type: 'newsletter' | 'announcement' | 'welcome' | 'custom',
  language: 'ko' | 'en',
  data?: any
): { subject: string; body: string; isHtml: boolean } {
  const templates = {
    newsletter: {
      ko: {
        subject: `CONNECTS 뉴스레터 - ${new Date().toLocaleDateString('ko-KR')}`,
        body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-radius: 0 0 10px 10px; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #667eea; margin-bottom: 15px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 14px; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CONNECTS Newsletter</h1>
      <p>AI 기반 구조 생물학 분석 플랫폼</p>
    </div>
    <div class="content">
      <p>안녕하세요,</p>
      <p>이번 주 CONNECTS의 새로운 소식을 전해드립니다.</p>
      
      <div class="section">
        <h2>📊 새로운 분석 도구</h2>
        <p>${data?.newTools || '새로운 도구들이 추가되었습니다.'}</p>
      </div>
      
      <div class="section">
        <h2>📝 업데이트 내용</h2>
        <p>${data?.updates || '다양한 기능이 개선되었습니다.'}</p>
      </div>
      
      <div class="section">
        <h2>🔬 연구 하이라이트</h2>
        <p>${data?.research || '최신 연구 성과를 확인하세요.'}</p>
      </div>
      
      <center>
        <a href="https://connects-scv.github.io/" class="button">웹사이트 방문하기</a>
      </center>
      
      <div class="footer">
        <p>감사합니다.<br>CONNECTS 팀</p>
        <p>이 이메일은 CONNECTS 뉴스레터를 구독하신 분들께 발송되었습니다.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
        isHtml: true
      },
      en: {
        subject: `CONNECTS Newsletter - ${new Date().toLocaleDateString('en-US')}`,
        body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-radius: 0 0 10px 10px; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #667eea; margin-bottom: 15px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 14px; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CONNECTS Newsletter</h1>
      <p>AI-Powered Structural Biology Analysis Platform</p>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Here are this week's updates from CONNECTS.</p>
      
      <div class="section">
        <h2>📊 New Analysis Tools</h2>
        <p>${data?.newTools || 'New tools have been added.'}</p>
      </div>
      
      <div class="section">
        <h2>📝 Recent Updates</h2>
        <p>${data?.updates || 'Various features have been improved.'}</p>
      </div>
      
      <div class="section">
        <h2>🔬 Research Highlights</h2>
        <p>${data?.research || 'Check out the latest research achievements.'}</p>
      </div>
      
      <center>
        <a href="https://connects-scv.github.io/" class="button">Visit Website</a>
      </center>
      
      <div class="footer">
        <p>Best regards,<br>CONNECTS Team</p>
        <p>This email was sent to CONNECTS newsletter subscribers.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
        isHtml: true
      }
    },
    announcement: {
      ko: {
        subject: 'CONNECTS 중요 공지사항',
        body: `<p>안녕하세요,</p><p>${data?.content || '중요한 공지사항이 있습니다.'}</p><p>감사합니다.<br>CONNECTS 팀</p>`,
        isHtml: true
      },
      en: {
        subject: 'CONNECTS Important Announcement',
        body: `<p>Hello,</p><p>${data?.content || 'We have an important announcement.'}</p><p>Best regards,<br>CONNECTS Team</p>`,
        isHtml: true
      }
    },
    welcome: {
      ko: {
        subject: 'CONNECTS 뉴스레터 구독을 환영합니다!',
        body: `<p>안녕하세요,</p><p>CONNECTS 뉴스레터를 구독해주셔서 감사합니다.</p><p>앞으로 최신 소식과 업데이트를 이메일로 받아보실 수 있습니다.</p><p>감사합니다.<br>CONNECTS 팀</p>`,
        isHtml: true
      },
      en: {
        subject: 'Welcome to CONNECTS Newsletter!',
        body: `<p>Hello,</p><p>Thank you for subscribing to CONNECTS Newsletter.</p><p>You will receive the latest news and updates via email.</p><p>Best regards,<br>CONNECTS Team</p>`,
        isHtml: true
      }
    },
    custom: {
      ko: { subject: '', body: '', isHtml: false },
      en: { subject: '', body: '', isHtml: false }
    }
  };

  return templates[type][language];
}
