---
layout: main
title: Updates
description: CONNECTS의 최신 소식과 업데이트
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

  .updates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .update-card {
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

  .update-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
    border-color: #A6F0FF;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .update-icon {
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

  .update-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1rem;
    font-family: 'Noto Sans KR', sans-serif;
  }

  .update-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .update-link {
    display: inline-flex;
    align-items: center;
    color: #A6F0FF;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .update-link:hover {
    color: #67d4e8;
    transform: translateX(4px);
  }

  .update-link::after {
    content: '→';
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }

  .update-link:hover::after {
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    .updates-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">Updates</h1>
    <p class="hero-description">{{ page.description }}</p>
  </div>
</section>

<!-- Content Section -->
<div class="content-section">
  <div class="updates-grid">
    <!-- Release Notes -->
    <a href="/release/" class="update-card">
      <div class="update-icon">📋</div>
      <h2 class="update-title">Release Notes</h2>
      <p class="update-description">플랫폼 업데이트 및 새로운 기능 소개</p>
      <span class="update-link">릴리스 노트 보기</span>
    </a>

    <!-- Feature Improvements -->
    <a href="#" class="update-card">
      <div class="update-icon">⚡</div>
      <h2 class="update-title">Feature Improvements</h2>
      <p class="update-description">기능 개선 사항 및 성능 최적화 내역</p>
      <span class="update-link">개선 사항 보기</span>
    </a>

    <!-- Announcements -->
    <a href="#" class="update-card">
      <div class="update-icon">📢</div>
      <h2 class="update-title">Announcements</h2>
      <p class="update-description">중요 공지사항 및 이벤트 안내</p>
      <span class="update-link">공지사항 보기</span>
    </a>
  </div>
</div>