---
layout: main
title: Contact
description: CONNECTS와 협업하고 문의하실 수 있는 채널입니다
---

<style>
  /* Hero Section Styles */
  .hero-section {
    position: relative;
    width: 100%;
    min-height: 30vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 3rem;
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 122%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: 0;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 25, 38, 0.5);
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-title {
    color: white;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .hero-description {
    color: rgba(255, 255, 255, 0.9);
    font-size: clamp(1.125rem, 2vw, 1.5rem);
    font-weight: 400;
    font-family: 'Noto Sans KR', sans-serif;
    line-height: 1.4;
  }

  /* Content Section */
  .content-section {
    padding: 0 20px 60px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-top: 2rem;
  }

  .contact-info {
    padding: 2rem;
  }

  .contact-title {
    font-size: 2rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1rem;
    font-family: 'Noto Sans KR', sans-serif;
  }

  .contact-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .contact-item {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
  }

  .contact-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: #A6F0FF;
    transform: translateX(4px);
  }

  .contact-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .contact-value {
    font-size: 1.2rem;
    font-weight: 500;
  }

  .contact-value a {
    color: #A6F0FF;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .contact-value a:hover {
    color: #67d4e8;
  }

  .collaboration-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2.5rem;
  }

  .collaboration-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1.5rem;
    font-family: 'Noto Sans KR', sans-serif;
  }

  .collaboration-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .collaboration-list li {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    line-height: 1.8;
    padding-left: 1.5rem;
    position: relative;
    margin-bottom: 1rem;
  }

  .collaboration-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: #A6F0FF;
  }

  @media (max-width: 768px) {
    .contact-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">Contact Us</h1>
    <p class="hero-description">CONNECTS와 함께하세요</p>
  </div>
</section>

<!-- Content Section -->
<div class="content-section">
  <div class="contact-grid">
    <!-- Contact Information -->
    <div class="contact-info">
      <h2 class="contact-title">문의하기</h2>
      <p class="contact-text">협업 제안, 기술 문의, 파트너십 등 다양한 문의를 환영합니다.</p>
      
      <div class="contact-item">
        <div class="contact-label">Email</div>
        <div class="contact-value">
          <a href="mailto:contact@connects-scv.com">contact@connects-scv.com</a>
        </div>
      </div>
      
      <div class="contact-item">
        <div class="contact-label">GitHub</div>
        <div class="contact-value">
          <a href="https://github.com/CONNECTS-SCV" target="_blank">github.com/CONNECTS-SCV</a>
        </div>
      </div>
      
      <div class="contact-item">
        <div class="contact-label">Business Hours</div>
        <div class="contact-value">
          Mon - Fri: 9:00 AM - 6:00 PM (KST)
        </div>
      </div>
    </div>
    
    <!-- Collaboration Areas -->
    <div class="collaboration-card">
      <h3 class="collaboration-title">협업 분야</h3>
      <ul class="collaboration-list">
        <li>신약 개발 프로젝트</li>
        <li>AI 모델 공동 연구</li>
        <li>데이터 파트너십</li>
        <li>기술 라이선싱</li>
        <li>학술 연구 협력</li>
        <li>컨설팅 및 기술 자문</li>
        <li>맞춤형 솔루션 개발</li>
      </ul>
    </div>
  </div>
</div>