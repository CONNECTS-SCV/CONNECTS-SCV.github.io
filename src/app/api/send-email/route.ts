import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface EmailRequest {
  to: string[];
  subject: string;
  body: string;
  isHtml?: boolean;
}

function makeSignature(method: string, url: string, timestamp: string, accessKey: string, secretKey: string): string {
  const message = `${method} ${url}\n${timestamp}\n${accessKey}`;
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(message);
  return hmac.digest('base64');
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();

    // 환경변수 가져오기 (서버사이드에서는 NEXT_PUBLIC_ 없어도 됨)
    const accessKey = process.env.NCP_ACCESS_KEY || process.env.NEXT_PUBLIC_NCP_ACCESS_KEY || '';
    const secretKey = process.env.NCP_SECRET_KEY || process.env.NEXT_PUBLIC_NCP_SECRET_KEY || '';
    const senderAddress = process.env.NCLOUD_SENDER_EMAIL || process.env.NEXT_PUBLIC_NCLOUD_SENDER_EMAIL || 'curieus@connects.so';

    if (!accessKey || !secretKey) {
      console.error('Missing Naver Cloud credentials');
      return NextResponse.json(
        { success: false, message: 'Email service not configured' },
        { status: 500 }
      );
    }

    const timestamp = Date.now().toString();
    const method = 'POST';
    const apiPath = '/api/v1/mails';
    const signature = makeSignature(method, apiPath, timestamp, accessKey, secretKey);

    const emailData = {
      senderAddress,
      senderName: 'Curieus',
      replyTo: 'support@curieus.net',
      recipients: body.to.map(email => ({
        address: email,
        type: 'R'
      })),
      individual: true,
      advertising: false,
      title: body.subject,
      body: body.body,
      parameters: {
        'List-Unsubscribe': '<https://curieus.net/unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Precedence': 'bulk'
      }
    };

    console.log('Sending email via Naver Cloud API...');

    const response = await fetch('https://mail.apigw.ntruss.com' + apiPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-signature-v2': signature,
        'x-ncp-lang': 'ko-KR'
      },
      body: JSON.stringify(emailData)
    });

    const responseData = await response.json();

    if (response.ok && responseData.requestId) {
      console.log('Email sent successfully:', responseData.requestId);
      return NextResponse.json({
        success: true,
        message: '이메일이 성공적으로 전송되었습니다.',
        requestId: responseData.requestId
      });
    } else {
      console.error('Naver Cloud API error:', responseData);
      return NextResponse.json(
        {
          success: false,
          message: responseData.message || '이메일 전송에 실패했습니다.'
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send email'
      },
      { status: 500 }
    );
  }
}
