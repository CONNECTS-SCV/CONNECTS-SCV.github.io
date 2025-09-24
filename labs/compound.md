---
layout: main
title: Drug Discovery Tools
description: 신약 개발 및 화합물 분석 도구 모음
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

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }

  .tool-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;
    display: block;
    color: inherit;
  }

  .tool-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
    border-color: #A6F0FF;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .tool-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.75rem;
  }

  .tool-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .tool-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tool-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(166, 240, 255, 0.15);
    color: #A6F0FF;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">{{ page.title }}</h1>
    <p class="hero-description">{{ page.description }}</p>
  </div>
</section>

<!-- Content Section -->
<div class="content-section">

<div class="tools-grid">
  <a href="/blog/ADMET-AI" class="tool-card">
    <h3 class="tool-title">ADMET-AI</h3>
    <p class="tool-description">약물 후보물질의 약동/독성 예측 도구. ADMET 특성을 종합적으로 평가하여 신약 개발 효율을 높입니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">ADMET</span>
      <span class="tool-tag">약동학</span>
      <span class="tool-tag">독성</span>
    </div>
  </a>

  <a href="/blog/DLKcat" class="tool-card">
    <h3 class="tool-title">DLKcat</h3>
    <p class="tool-description">효소 활성도 예측을 위한 Kcat 딥러닝 모델. 효소-기질 반응의 turnover number를 정확히 예측합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">효소</span>
      <span class="tool-tag">Kcat</span>
      <span class="tool-tag">활성도</span>
    </div>
  </a>

  <a href="/blog/ToxinPred3" class="tool-card">
    <h3 class="tool-title">ToxinPred3</h3>
    <p class="tool-description">펩타이드 독성 예측 모델. 머신러닝과 motif 분석을 통해 펩타이드의 잠재적 독성을 평가합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">독성 예측</span>
      <span class="tool-tag">펩타이드</span>
      <span class="tool-tag">안전성</span>
    </div>
  </a>

  <a href="/blog/MHCflurry" class="tool-card">
    <h3 class="tool-title">MHCflurry</h3>
    <p class="tool-description">MHC class I 펩타이드 결합 친화도 예측 모델. 백신 개발과 암 면역치료에 활용되는 면역원성 분석 도구입니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">MHC</span>
      <span class="tool-tag">면역원성</span>
      <span class="tool-tag">백신</span>
    </div>
  </a>
</div>
</div>