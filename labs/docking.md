---
layout: main
title: Docking & Binding Tools
description: 분자 도킹 및 결합 예측 도구 모음
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
  <a href="/blog/DiffDock" class="tool-card">
    <h3 class="tool-title">DiffDock</h3>
    <p class="tool-description">리간드 도킹 포즈 예측 도구. Diffusion 모델을 활용하여 높은 정확도의 결합 구조를 생성합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">도킹</span>
      <span class="tool-tag">리간드</span>
      <span class="tool-tag">AI</span>
    </div>
  </a>

  <a href="/blog/Boltz-2" class="tool-card">
    <h3 class="tool-title">Boltz-2</h3>
    <p class="tool-description">확률 기반 단백질 구조 생성 및 도킹 예측. 복합체 구조를 앙상블로 생성하여 신뢰도 높은 예측을 제공합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">복합체</span>
      <span class="tool-tag">앙상블</span>
      <span class="tool-tag">구조 예측</span>
    </div>
  </a>

  <a href="/blog/Chai" class="tool-card">
    <h3 class="tool-title">Chai</h3>
    <p class="tool-description">단백질-Ligand/Glycan 결합 예측 도구. 다양한 분자 유형의 복합체 구조를 통합적으로 예측합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">복합체</span>
      <span class="tool-tag">Glycan</span>
      <span class="tool-tag">통합 예측</span>
    </div>
  </a>

  <a href="/blog/LigandMPNN" class="tool-card">
    <h3 class="tool-title">LigandMPNN</h3>
    <p class="tool-description">단백질-리간드 결합 최적화 도구. 리간드 결합 부위의 서열을 디자인하여 친화도를 향상시킵니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">서열 디자인</span>
      <span class="tool-tag">결합 최적화</span>
    </div>
  </a>

  <a href="/blog/PLIP" class="tool-card">
    <h3 class="tool-title">PLIP</h3>
    <p class="tool-description">단백질-리간드 상호작용 분석 도구. 수소결합, 소수성 상호작용 등을 자동으로 탐지하고 시각화합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">상호작용 분석</span>
      <span class="tool-tag">시각화</span>
    </div>
  </a>
</div>
</div>