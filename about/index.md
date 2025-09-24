---
layout: main
title: About Us
description: AI와 구조 생물학의 융합을 선도하는 CONNECTS
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
    max-width: 1400px;
    margin: 0 auto;
  }

  .about-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .about-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2.5rem;
    transition: all 0.3s ease;
    text-decoration: none;
    display: block;
    color: inherit;
  }

  .about-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
    border-color: #A6F0FF;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .about-icon {
    width: 48px;
    height: 48px;
    background: rgba(166, 240, 255, 0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .about-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1rem;
    font-family: 'Noto Sans KR', sans-serif;
  }

  .about-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .about-link {
    display: inline-flex;
    align-items: center;
    color: #A6F0FF;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .about-link:hover {
    color: #67d4e8;
    transform: translateX(4px);
  }

  .about-link::after {
    content: '→';
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }

  .about-link:hover::after {
    transform: translateX(4px);
  }

  /* Mission Section */
  .mission-section {
    margin-top: 4rem;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    text-align: center;
  }

  .mission-title {
    font-size: 2rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1.5rem;
    font-family: 'Noto Sans KR', sans-serif;
  }

  .mission-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
    line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .about-grid {
      grid-template-columns: 1fr;
    }

    .mission-section {
      padding: 2rem;
    }
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">About Us</h1>
    <p class="hero-description">{{ page.description }}</p>
  </div>
</section>

<!-- Content Section -->
<div class="content-section">
  <div class="about-grid">
    <!-- History -->
    <a href="#" class="about-card">
      <div class="about-icon">📚</div>
      <h2 class="about-title">History</h2>
      <p class="about-description">CONNECTS의 발자취와 성장 과정</p>
      <span class="about-link">연혁 보기</span>
    </a>

    <!-- Vision -->
    <a href="/vision" class="about-card">
      <div class="about-icon">🔮</div>
      <h2 class="about-title">Vision</h2>
      <p class="about-description">인류 건강의 미래를 위한 우리의 비전</p>
      <span class="about-link">비전 보기</span>
    </a>

    <!-- Contact -->
    <a href="/about/contact/" class="about-card">
      <div class="about-icon">💬</div>
      <h2 class="about-title">Contact</h2>
      <p class="about-description">문의사항 및 협업 제안</p>
      <span class="about-link">연락하기</span>
    </a>
  </div>

  <!-- Mission Section -->
  <div class="mission-section">
    <h2 class="mission-title">Our Mission</h2>
    <p class="mission-text">
      AI 기술을 통해 신약 개발 과정을 혁신하고,<br>
      더 빠르고 정확한 치료제 개발로 인류 건강에 기여합니다.
    </p>
  </div>
</div>