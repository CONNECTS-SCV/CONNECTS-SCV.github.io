---
layout: main
title: Products
description: 혁신적인 AI 기반 신약 개발 플랫폼
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

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .product-card {
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

  .product-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
    border-color: #A6F0FF;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .product-card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .product-name {
    font-size: 1.75rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1rem;
    font-family: 'Noto Sans KR', sans-serif;
  }

  .product-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .product-status {
    display: inline-block;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .status-active {
    background: rgba(166, 240, 255, 0.15);
    color: #A6F0FF;
  }

  .status-coming {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
  }

  .product-link {
    display: inline-flex;
    align-items: center;
    color: #A6F0FF;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }

  .product-link:hover {
    color: #67d4e8;
    transform: translateX(4px);
  }

  .product-link::after {
    content: '→';
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }

  .product-link:hover::after {
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    .products-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">Products</h1>
    <p class="hero-description">{{ page.description }}</p>
  </div>
</section>

<!-- Content Section -->
<div class="content-section">
  <div class="products-grid">
    <!-- Curie -->
    <div class="product-card">
      <h2 class="product-name">Curie</h2>
      <p class="product-description">통합 AI 분석 플랫폼으로 단백질 구조 예측부터 리간드 도킹까지 전체 워크플로우를 지원합니다.</p>
      <span class="product-status status-active">Available Now</span>
      <br>
      <a href="https://curie.kr" target="_blank" class="product-link">Visit Curie</a>
    </div>

    <!-- Twin -->
    <div class="product-card disabled">
      <h2 class="product-name">Twin</h2>
      <p class="product-description">디지털 트윈 기술을 활용한 가상 실험 플랫폼으로 실제 실험 전 결과를 예측합니다.</p>
      <span class="product-status status-coming">Coming Soon</span>
    </div>

    <!-- Pensive -->
    <div class="product-card disabled">
      <h2 class="product-name">Pensive</h2>
      <p class="product-description">심층 학습 기반 분자 특성 예측 시스템으로 약물 후보 물질을 효율적으로 스크리닝합니다.</p>
      <span class="product-status status-coming">Coming Soon</span>
    </div>
  </div>
</div>