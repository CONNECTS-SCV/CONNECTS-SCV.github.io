---
layout: main
title: Protein Structure Tools
description: 단백질 구조 예측 및 분석 도구 모음
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
  <a href="/blog/Antifold" class="tool-card">
    <h3 class="tool-title">Antifold</h3>
    <p class="tool-description">항체 구조 기반 서열 최적화 모델. CDR 영역의 구조적 특성을 고려하여 안정성과 특이성을 향상시킵니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">항체</span>
      <span class="tool-tag">구조 예측</span>
      <span class="tool-tag">서열 최적화</span>
    </div>
  </a>

  <a href="/blog/Immunebuilder" class="tool-card">
    <h3 class="tool-title">Immunebuilder</h3>
    <p class="tool-description">항체 및 TCR 구조 예측 전용 모델. 면역글로불린 도메인의 특성을 활용한 고정확도 예측을 제공합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">항체</span>
      <span class="tool-tag">TCR</span>
      <span class="tool-tag">구조 예측</span>
    </div>
  </a>

  <a href="/blog/Bioemu" class="tool-card">
    <h3 class="tool-title">Bioemu</h3>
    <p class="tool-description">빠르고 정확한 단백질 구조 샘플링 도구. 다양한 conformational state를 효율적으로 탐색합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">구조 샘플링</span>
      <span class="tool-tag">컨포메이션</span>
    </div>
  </a>

  <a href="/blog/DeepFRI" class="tool-card">
    <h3 class="tool-title">DeepFRI</h3>
    <p class="tool-description">단백질 기능 및 중요 잔기 예측 도구. 구조 정보를 활용하여 GO term과 EC number를 예측합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">기능 예측</span>
      <span class="tool-tag">GO annotation</span>
    </div>
  </a>

  <a href="/blog/Netsolp" class="tool-card">
    <h3 class="tool-title">NetsolP</h3>
    <p class="tool-description">단백질 용해도 예측을 위한 딥러닝 모델. E. coli 발현 시스템에서의 solubility를 정확히 예측합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">용해도</span>
      <span class="tool-tag">발현 예측</span>
    </div>
  </a>

  <a href="/blog/Dscript" class="tool-card">
    <h3 class="tool-title">Dscript</h3>
    <p class="tool-description">단백질 상호작용 예측을 위한 서열 기반 AI 도구. PPI 네트워크 구축과 상호작용 파트너 발굴에 활용됩니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">PPI</span>
      <span class="tool-tag">상호작용</span>
    </div>
  </a>

  <a href="/blog/FixPDB" class="tool-card">
    <h3 class="tool-title">FixPDB</h3>
    <p class="tool-description">단백질 구조 정리 자동화 도구. PDB 파일의 문제를 자동으로 감지하고 수정합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">PDB</span>
      <span class="tool-tag">전처리</span>
    </div>
  </a>
</div>
</div>