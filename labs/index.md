---
layout: main
title: Labs - All Tools
description: CONNECTS 플랫폼에서 제공하는 모든 분석 도구
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

  /* Background */
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

  /* Dark Overlay */
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 25, 38, 0.5);
    z-index: 1;
  }

  /* Hero Content */
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

  .category-section {
    margin-bottom: 4rem;
  }

  .category-header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  }

  .category-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: white;
    margin: 0;
  }

  .category-count {
    display: inline-block;
    margin-left: 1rem;
    padding: 0.25rem 0.75rem;
    background: rgba(166, 240, 255, 0.1);
    color: #A6F0FF;
    border-radius: 999px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
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
    margin-bottom: 0.5rem;
  }

  .tool-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.95rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">Labs - All Tools</h1>
    <p class="hero-description">{{ page.description }}</p>
  </div>
</section>

<!-- Content Section -->
<div class="content-section">

<div class="category-section">
  <div class="category-header">
    <h2 class="category-title">Protein Structure</h2>
    <span class="category-count">7 tools</span>
  </div>
  <div class="tools-grid">
    <a href="/blog/Antifold" class="tool-card">
      <h3 class="tool-title">Antifold</h3>
      <p class="tool-description">항체 구조 기반 서열 최적화 모델</p>
    </a>
    <a href="/blog/Immunebuilder" class="tool-card">
      <h3 class="tool-title">Immunebuilder</h3>
      <p class="tool-description">항체 및 TCR 구조 예측 전용 모델</p>
    </a>
    <a href="/blog/Bioemu" class="tool-card">
      <h3 class="tool-title">Bioemu</h3>
      <p class="tool-description">빠르고 정확한 단백질 구조 샘플링 도구</p>
    </a>
    <a href="/blog/DeepFRI" class="tool-card">
      <h3 class="tool-title">DeepFRI</h3>
      <p class="tool-description">단백질 기능 및 중요 잔기 예측 도구</p>
    </a>
    <a href="/blog/Netsolp" class="tool-card">
      <h3 class="tool-title">NetsolP</h3>
      <p class="tool-description">단백질 용해도 예측을 위한 딥러닝 모델</p>
    </a>
    <a href="/blog/Dscript" class="tool-card">
      <h3 class="tool-title">Dscript</h3>
      <p class="tool-description">단백질 상호작용 예측을 위한 서열 기반 AI 도구</p>
    </a>
    <a href="/blog/FixPDB" class="tool-card">
      <h3 class="tool-title">FixPDB</h3>
      <p class="tool-description">단백질 구조 정리 자동화 도구</p>
    </a>
  </div>
</div>

<div class="category-section">
  <div class="category-header">
    <h2 class="category-title">Docking & Binding</h2>
    <span class="category-count">5 tools</span>
  </div>
  <div class="tools-grid">
    <a href="/blog/DiffDock" class="tool-card">
      <h3 class="tool-title">DiffDock</h3>
      <p class="tool-description">리간드 도킹 포즈 예측 도구</p>
    </a>
    <a href="/blog/Boltz-2" class="tool-card">
      <h3 class="tool-title">Boltz-2</h3>
      <p class="tool-description">확률 기반 단백질 구조 생성 및 도킹 예측</p>
    </a>
    <a href="/blog/Chai" class="tool-card">
      <h3 class="tool-title">Chai</h3>
      <p class="tool-description">단백질-Ligand/Glycan 결합 예측 도구</p>
    </a>
    <a href="/blog/LigandMPNN" class="tool-card">
      <h3 class="tool-title">LigandMPNN</h3>
      <p class="tool-description">단백질-리간드 결합 최적화 도구</p>
    </a>
    <a href="/blog/PLIP" class="tool-card">
      <h3 class="tool-title">PLIP</h3>
      <p class="tool-description">단백질-리간드 상호작용 분석 도구</p>
    </a>
  </div>
</div>

<div class="category-section">
  <div class="category-header">
    <h2 class="category-title">Drug Discovery</h2>
    <span class="category-count">4 tools</span>
  </div>
  <div class="tools-grid">
    <a href="/blog/ADMET-AI" class="tool-card">
      <h3 class="tool-title">ADMET-AI</h3>
      <p class="tool-description">약물 후보물질의 약동/독성 예측 도구</p>
    </a>
    <a href="/blog/DLKcat" class="tool-card">
      <h3 class="tool-title">DLKcat</h3>
      <p class="tool-description">효소 활성도 예측을 위한 Kcat 딥러닝 모델</p>
    </a>
    <a href="/blog/ToxinPred3" class="tool-card">
      <h3 class="tool-title">ToxinPred3</h3>
      <p class="tool-description">펩타이드 독성 예측 모델</p>
    </a>
    <a href="/blog/MHCflurry" class="tool-card">
      <h3 class="tool-title">MHCflurry</h3>
      <p class="tool-description">MHC class I 펩타이드 결합 친화도 예측 모델</p>
    </a>
  </div>
</div>

<div class="category-section">
  <div class="category-header">
    <h2 class="category-title">Utilities</h2>
    <span class="category-count">2 tools</span>
  </div>
  <div class="tools-grid">
    <a href="/blog/GROMACS" class="tool-card">
      <h3 class="tool-title">GROMACS</h3>
      <p class="tool-description">분자동역학 시뮬레이션 도구</p>
    </a>
    <a href="/blog/FixPDB" class="tool-card">
      <h3 class="tool-title">FixPDB</h3>
      <p class="tool-description">단백질 구조 정리 자동화 도구</p>
    </a>
  </div>
</div>
</div>