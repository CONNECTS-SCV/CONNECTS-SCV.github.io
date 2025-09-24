---
layout: main
title: 비전 | CONNECTS
description: AI와 구조 생물학의 융합으로 인류 건강의 미래를 열어갑니다
permalink: /vision/
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

  .vision-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 3rem;
    margin-bottom: 2rem;
    transition: all 0.3s ease;
  }

  .vision-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: #A6F0FF;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .vision-card h2 {
    font-size: 2rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1.5rem;
    font-family: 'Noto Sans KR', sans-serif;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .vision-icon {
    width: 48px;
    height: 48px;
    background: rgba(166, 240, 255, 0.15);
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .vision-icon::before {
    content: '✨';
    font-size: 1.5rem;
  }

  .vision-card p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }

  .vision-card p:last-child {
    margin-bottom: 0;
  }

  .vision-card strong {
    color: #A6F0FF;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .vision-card {
      padding: 2rem;
    }

    .vision-card h2 {
      font-size: 1.5rem;
    }
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">우리의 비전</h1>
    <p class="hero-description">{{ page.description }}</p>
  </div>
</section>

<!-- Content Section -->
<div class="content-section">
  <div class="vision-card">
    <h2><div class="vision-icon"></div>혁신적인 구조 생물학 플랫폼</h2>
    <p>CONNECTS는 AI 기술과 구조 생물학을 융합하여 생명과학 연구의 새로운 패러다임을 제시합니다. 우리는 복잡한 생물학적 시스템을 이해하고, 신약 개발 과정을 혁신하며, 연구자들이 더 나은 치료법을 발견할 수 있도록 돕습니다.</p>
    <p>단백질-리간드 상호작용, 분자 도킹, 가상 스크리닝부터 독성 평가까지 - 모든 구조 생물학 분석이 하나의 통합된 플랫폼에서 가능합니다. 최첨단 AI 모델과 클라우드 컴퓨팅의 힘으로 연구의 속도와 정확성을 동시에 향상시킵니다.</p>
  </div>

  <div class="vision-card">
    <h2><div class="vision-icon"></div>우리의 미션</h2>
    <p><strong>접근성 향상:</strong> 고도의 전문 지식이 필요했던 구조 생물학 분석을 누구나 쉽게 사용할 수 있는 직관적인 웹 플랫폼으로 제공합니다. 복잡한 소프트웨어 설치나 고성능 컴퓨터 없이도 브라우저에서 바로 세계 최고 수준의 분석을 수행할 수 있습니다.</p>
    <p><strong>정확성 증대:</strong> AlphaFold, ESMFold 등 최신 AI 모델과 검증된 과학적 방법론을 결합하여 신뢰할 수 있는 분석 결과를 보장합니다. 모든 예측과 분석은 엄격한 검증 과정을 거쳐 연구자들이 확신을 가지고 사용할 수 있습니다.</p>
    <p><strong>협업 촉진:</strong> 전 세계 연구자들이 데이터와 인사이트를 공유하고 협력할 수 있는 통합된 환경을 구축합니다. 실시간 협업 기능과 결과 공유 시스템을 통해 과학적 발견의 속도를 가속화합니다.</p>
  </div>

  <div class="vision-card">
    <h2><div class="vision-icon"></div>미래를 향한 도전</h2>
    <p>2030년까지 CONNECTS는 글로벌 구조 생물학 연구의 표준 플랫폼이 되어, 수많은 혁신적인 치료법 발견에 기여하고 인류의 건강한 미래를 만들어 나갈 것입니다.</p>
    <p>우리는 AI와 생물학의 경계를 허물고, 연구자들이 상상했던 것보다 훨씬 빠르고 정확하게 생명의 신비를 해독할 수 있도록 돕겠습니다. 희귀질환부터 암, 감염병까지 - 모든 질병에 대한 새로운 치료 가능성을 열어가겠습니다.</p>
    <p>CONNECTS와 함께 과학의 한계를 뛰어넘어 더 건강한 세상을 만들어 나갑시다.</p>
  </div>
</div>