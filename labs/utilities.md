---
layout: main
title: Utility Tools
description: 구조 분석 및 시뮬레이션 유틸리티 도구 모음
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
  <a href="/blog/GROMACS" class="tool-card">
    <h3 class="tool-title">GROMACS</h3>
    <p class="tool-description">분자동역학 시뮬레이션 도구. 단백질과 리간드의 동적 거동을 원자 수준에서 시뮬레이션하고 분석합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">MD 시뮬레이션</span>
      <span class="tool-tag">동역학</span>
      <span class="tool-tag">구조 분석</span>
    </div>
  </a>

  <a href="/blog/FixPDB" class="tool-card">
    <h3 class="tool-title">FixPDB</h3>
    <p class="tool-description">단백질 구조 정리 자동화 도구. PDB 파일의 문제를 자동으로 감지하고 수정하여 후속 분석을 원활하게 합니다.</p>
    <div class="tool-tags">
      <span class="tool-tag">PDB</span>
      <span class="tool-tag">전처리</span>
      <span class="tool-tag">자동화</span>
    </div>
  </a>
</div>
</div>