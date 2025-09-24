---
layout: main
title: Release Notes | CONNECTS
description: CONNECTS 플랫폼 업데이트 및 릴리즈 정보
permalink: /release/
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

  .release-notice {
    background: rgba(166, 240, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(166, 240, 255, 0.3);
    border-radius: 16px;
    padding: 2.5rem;
    margin-bottom: 3rem;
    text-align: center;
  }

  .release-notice-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }

  .release-notice-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1rem;
    font-family: 'Noto Sans KR', sans-serif;
  }

  .release-notice-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .release-notice {
      padding: 2rem;
    }

    .release-notice-title {
      font-size: 1.5rem;
    }
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">Release Notes</h1>
    <p class="hero-description">{{ page.description }}</p>
  </div>
</section>

<!-- Content Section -->
<div class="content-section">
  <div class="release-notice">
    <div class="release-notice-icon">📝</div>
    <h2 class="release-notice-title">릴리즈 노트 작성 예정</h2>
    <p class="release-notice-text">
      CONNECTS 플랫폼의 새로운 기능, 개선사항, 버그 수정 등 모든 업데이트 내역을 곧 확인하실 수 있습니다.<br>
      저희는 지속적으로 플랫폼을 개선하고 새로운 기능을 추가하여<br>
      연구자 여러분께 최고의 분석 경험을 제공하고자 노력하고 있습니다.
    </p>
  </div>
</div>