// Web3Forms 무료 이메일 서비스 사용 (서버 없이 가능)
// https://web3forms.com/ - 무료 플랜: 월 250건

interface EmailData {
  to: string[];
  subject: string;
  body: string;
  isHtml?: boolean;
}

// Web3Forms를 사용한 이메일 전송 (CORS 지원, 무료)
export async function sendEmailViaWeb3Forms(data: EmailData) {
  const WEB3FORMS_KEY = '0e4f7b5a-8c9d-4e3f-b2a1-6d8c9e5f4b3a'; // 실제 키로 교체 필요
  
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: data.subject,
        from_name: 'Curieus',
        from_email: 'noreply@curieus.net',
        to: data.to.join(', '),
        message: data.body,
        replyto: 'support@curieus.net'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      return { success: true, message: '이메일이 전송되었습니다.' };
    } else {
      throw new Error(result.message || '이메일 전송 실패');
    }
  } catch (error) {
    console.error('Email error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '이메일 전송 실패' 
    };
  }
}

// Formspree를 사용한 대체 방법 (무료 50건/월)
export async function sendEmailViaFormspree(data: EmailData) {
  const FORMSPREE_ID = 'YOUR_FORM_ID'; // https://formspree.io 에서 생성
  
  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _replyto: data.to[0],
        _subject: data.subject,
        message: data.body,
        _cc: data.to.slice(1).join(',')
      })
    });

    if (response.ok) {
      return { success: true, message: '이메일이 전송되었습니다.' };
    } else {
      throw new Error('이메일 전송 실패');
    }
  } catch (error) {
    console.error('Formspree error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '이메일 전송 실패' 
    };
  }
}

// 기존 Naver Cloud 방식 (프록시 서버 필요)
export async function sendEmailViaNaver(data: EmailData) {
  // GitHub Pages에서는 직접 호출 불가 (CORS)
  // 옵션 1: Cloudflare Workers 사용 (무료)
  // 옵션 2: Netlify Functions 사용 (무료)
  // 옵션 3: 아래 Web3Forms 사용 권장
  
  console.warn('Naver Cloud API는 서버사이드에서만 사용 가능합니다.');
  return sendEmailViaWeb3Forms(data); // 대체 방법 사용
}