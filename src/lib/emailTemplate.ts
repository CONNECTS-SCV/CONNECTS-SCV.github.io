export interface EmailTemplateData {
  recipientName?: string;
  recipientEmail?: string;
  subject: string;
  mainContent: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
}

export function generateEmailTemplate(data: EmailTemplateData): string {
  const {
    recipientName = '고객님',
    recipientEmail = '',
    subject,
    mainContent,
    buttonText,
    buttonUrl,
    footerText
  } = data;

  // 안전한 이메일 제목 (스팸 필터 회피)
  const safeSubject = subject
    .replace(/free|무료|100%|보장|클릭하세요/gi, '')
    .replace(/!!!|\$\$\$/g, '')
    .replace(/ALL CAPS/g, (match) => match.toLowerCase());

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeSubject}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #ffffff;
        }
        
        .email-wrapper {
            background-color: #ffffff;
            padding: 60px 20px;
        }
        
        .email-container {
            max-width: 640px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        .email-header {
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 32px;
            margin-bottom: 40px;
        }
        
        .logo-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
        }
        
        .logo-tag {
            font-size: 12px;
            color: #888;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .email-subject-wrapper {
            margin-top: 24px;
        }
        
        .email-date {
            font-size: 13px;
            color: #888;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .email-subject {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            line-height: 1.3;
            margin: 0;
        }
        
        .email-body {
            padding: 0;
        }
        
        .greeting {
            font-size: 16px;
            color: #1a1a1a;
            margin-bottom: 24px;
            font-weight: 500;
        }
        
        .main-content {
            font-size: 15px;
            color: #4a4a4a;
            line-height: 1.8;
            margin-bottom: 40px;
            white-space: pre-wrap;
        }
        
        .main-content strong {
            color: #1a1a1a;
            font-weight: 600;
        }
        
        .highlight-box {
            background: #f8f9fa;
            border-left: 3px solid #1a1a1a;
            padding: 20px 24px;
            margin: 32px 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.7;
        }
        
        .button-container {
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: #1a1a1a;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            font-weight: 600;
            font-size: 15px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .cta-button:hover {
            background: #000000;
            transform: translateY(-1px);
        }
        
        .divider {
            height: 1px;
            background: #f0f0f0;
            margin: 48px 0;
        }
        
        .info-section {
            background: #fafafa;
            padding: 32px;
            margin: 40px -32px;
            border-radius: 8px;
        }
        
        .info-title {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }
        
        .info-item {
            text-align: left;
        }
        
        .info-item-title {
            font-size: 13px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 4px;
        }
        
        .info-item-desc {
            font-size: 12px;
            color: #666;
            line-height: 1.5;
        }
        
        .email-footer {
            margin-top: 60px;
            padding-top: 32px;
            border-top: 1px solid #f0f0f0;
        }
        
        .footer-company {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 16px;
        }
        
        .footer-links {
            margin-bottom: 24px;
        }
        
        .footer-links a {
            color: #666;
            text-decoration: none;
            margin-right: 24px;
            font-size: 13px;
            font-weight: 500;
            transition: color 0.2s ease;
        }
        
        .footer-links a:hover {
            color: #1a1a1a;
        }
        
        .footer-text {
            font-size: 12px;
            color: #888;
            line-height: 1.6;
            margin-bottom: 8px;
        }
        
        .footer-address {
            font-size: 12px;
            color: #aaa;
            margin-top: 16px;
        }
        
        .unsubscribe {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #f0f0f0;
        }
        
        .unsubscribe a {
            color: #aaa;
            text-decoration: none;
            font-size: 11px;
            transition: color 0.2s ease;
        }
        
        .unsubscribe a:hover {
            color: #666;
            text-decoration: underline;
        }
        
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 32px 16px;
            }
            
            .email-subject {
                font-size: 24px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .info-section {
                margin: 32px -16px;
                padding: 24px 16px;
            }
            
            .footer-links a {
                display: block;
                margin: 8px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <div class="logo-section">
                    <div>
                        <img src="https://curie.kr/assets/logo.webp" alt="Curieus Logo" width="150" height="40" style="display: block;" />
                        <div class="logo-tag" style="margin-top: 8px;">AI-Powered Analysis Platform</div>
                    </div>
                </div>
                <div class="email-subject-wrapper">
                    <div class="email-date">${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <h1 class="email-subject">${safeSubject}</h1>
                </div>
            </div>
            
            <!-- Body -->
            <div class="email-body">
                <div class="greeting">안녕하세요, ${recipientName}님</div>
                
                <div class="main-content">${mainContent}</div>
                
                ${buttonText && buttonUrl ? `
                <div class="button-container">
                    <a href="${buttonUrl}" class="cta-button">${buttonText} →</a>
                </div>
                ` : ''}
                
                ${footerText ? `
                <div class="highlight-box">
                    ${footerText}
                </div>
                ` : ''}
                
                <!-- Info Section -->
<!--                <div class="info-section">-->
<!--                    <div class="info-title">Curieus 핵심 기능</div>-->
<!--                    <div class="info-grid">-->
<!--                        <div class="info-item">-->
<!--                            <div class="info-item-title">단백질 구조 예측</div>-->
<!--                            <div class="info-item-desc">AlphaFold3 기반 고정밀 3D 구조 분석</div>-->
<!--                        </div>-->
<!--                        <div class="info-item">-->
<!--                            <div class="info-item-title">리간드 도킹</div>-->
<!--                            <div class="info-item-desc">AI 최적화 분자 결합 시뮬레이션</div>-->
<!--                        </div>-->
<!--                        <div class="info-item">-->
<!--                            <div class="info-item-title">상호작용 분석</div>-->
<!--                            <div class="info-item-desc">단백질-단백질 인터페이스 예측</div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
            
            <!-- Footer -->
            <div class="email-footer">
                <div class="footer-company">Curieus</div>
                <div class="footer-links">
                    <a href="https://curieus.net">홈페이지</a>
<!--                    <a href="https://curieus.net/features">기능</a>-->
<!--                    <a href="https://curieus.net/pricing">요금제</a>-->
<!--                    <a href="https://curieus.net/support">지원</a>-->
                </div>
                
                <div class="footer-text">
                    본 메일은 Curieus 서비스 이용자에게 발송되는 안내 메일입니다.
                </div>
                <div class="footer-address">
                    © 2025 Curieus. All rights reserved.<br>
                    경기도 성남시 분당구 판교로289번길 20(판교스타트업캠퍼스, 3층)
                </div>
                
                <div class="unsubscribe">
                    <p style="font-size: 11px; color: #aaa; margin-bottom: 8px;">이 이메일을 원하지 않으시면 언제든 수신을 거부할 수 있습니다.</p>
<!--                    <a href="https://curieus.net/unsubscribe?email=${encodeURIComponent(recipientEmail)}">수신 거부</a> · -->
<!--                    <a href="https://curieus.net/settings?email=${encodeURIComponent(recipientEmail)}">설정 변경</a> · -->
<!--                    <a href="https://curieus.net/privacy">개인정보처리방침</a>-->
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `.trim();
}

export function generatePlainTextEmail(data: EmailTemplateData): string {
  const {
    recipientName = '고객님',
    recipientEmail = '',
    subject,
    mainContent,
    buttonText,
    buttonUrl,
    footerText
  } = data;

  // 안전한 이메일 제목
  const safeSubject = subject
    .replace(/free|무료|100%|보장|클릭하세요/gi, '')
    .replace(/!!!|\$\$\$/g, '')
    .replace(/ALL CAPS/g, (match) => match.toLowerCase());

  let plainText = `Curieus\n\n`;
  plainText += `${safeSubject}\n\n`;
  plainText += `안녕하세요, ${recipientName}!\n\n`;
  plainText += `${mainContent}\n\n`;

  if (buttonText && buttonUrl) {
    plainText += `${buttonText}: ${buttonUrl}\n\n`;
  }

  if (footerText) {
    plainText += `---\n${footerText}\n---\n\n`;
  }

  plainText += `Curieus 주요 기능:\n`;
  plainText += `• 단백질 분석 - AlphaFold3 기반 구조 예측\n`;
  plainText += `• 리간드 도킹 - 정밀한 결합 분석\n`;
  plainText += `• 상호작용 예측 - 분자간 관계 분석\n\n`;

  plainText += `홈페이지: https://curieus.net\n`;
  plainText += `기능 소개: https://curieus.net/features\n`;
  plainText += `문의하기: https://curieus.net/support\n\n`;

  plainText += `© 2024 Curieus. All rights reserved.\n\n`;
  plainText += `수신 거부: https://curieus.net/unsubscribe?email=${encodeURIComponent(recipientEmail)}\n`;

  return plainText;
}
