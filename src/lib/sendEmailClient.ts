import crypto from 'crypto-js';

interface EmailData {
  to: string[];
  subject: string;
  body: string;
  isHtml?: boolean;
}

function makeSignature(method: string, url: string, timestamp: string, accessKey: string, secretKey: string): string {
  const message = `${method} ${url}\n${timestamp}\n${accessKey}`;
  const hmac = crypto.HmacSHA256(message, secretKey);
  return crypto.enc.Base64.stringify(hmac);
}

// CORS 프록시 서비스를 사용한 이메일 전송
export async function sendEmailViaProxy(data: EmailData) {
  try {
    const accessKey = process.env.NEXT_PUBLIC_NCP_ACCESS_KEY || '';
    const secretKey = process.env.NEXT_PUBLIC_NCP_SECRET_KEY || '';
    const senderEmail = process.env.NEXT_PUBLIC_NCLOUD_SENDER_EMAIL || 'curieus@connects.so';

    if (!accessKey || !secretKey) {
      throw new Error('Missing email configuration');
    }

    const timestamp = Date.now().toString();
    const method = 'POST';
    const apiPath = '/api/v1/mails';
    const signature = makeSignature(method, apiPath, timestamp, accessKey, secretKey);

    // CORS 프록시 사용 (무료 공개 프록시)
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'https://mail.apigw.ntruss.com' + apiPath;

    const emailPayload = {
      senderAddress: senderEmail,
      senderName: 'Curieus',
      replyTo: 'support@curieus.net',
      recipients: data.to.map(email => ({
        address: email,
        type: 'R'
      })),
      individual: true,
      advertising: false,
      title: data.subject,
      body: data.body
    };

    const response = await fetch(proxyUrl + apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-signature-v2': signature,
        'x-ncp-lang': 'ko-KR'
      },
      body: JSON.stringify(emailPayload)
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

// EmailJS를 사용한 대체 방법 (무료, 설정 필요)
export async function sendEmailViaEmailJS(data: EmailData) {
  // EmailJS 계정 생성 후 사용
  // https://www.emailjs.com/
  
  const SERVICE_ID = 'your_service_id'; // EmailJS에서 생성
  const TEMPLATE_ID = 'your_template_id'; // EmailJS에서 생성
  const PUBLIC_KEY = 'your_public_key'; // EmailJS에서 생성

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: {
          to_email: data.to.join(','),
          subject: data.subject,
          message: data.body
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error('EmailJS error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}