---
layout: main
---

<style>
  /* Hero Section Styles */
  .hero-section {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  /* Background Image */
  .hero-background {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 122%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
  }

  /* Dark Overlay */
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 25, 38, 0.75);
    z-index: 1;
  }

  /* Hero Content */
  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-subtitle {
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    font-family: 'Noto Sans KR', sans-serif;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  .hero-title {
    color: white;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 700;
    margin-bottom: 3rem;
    line-height: 1.2;
  }

  .title-line-1 {
    display: block;
    font-size: clamp(2rem, 5vw, 4.5rem);
    margin-bottom: 0.5rem;
  }

  .title-line-2 {
    display: block;
    font-size: clamp(2.5rem, 6vw, 5rem);
  }

  .hero-description {
    color: white;
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    font-family: 'Noto Sans KR', sans-serif;
    margin-bottom: 3rem;
    line-height: 1.4;
  }

  .cta-button {
    display: inline-block;
    padding: 1.25rem 3.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 3px solid white;
    border-radius: 50px;
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    font-family: 'Noto Sans KR', sans-serif;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .cta-button:hover {
    background: white;
    color: #001926;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-subtitle {
      font-size: 1.25rem;
    }

    .hero-description {
      font-size: 1.5rem;
    }

    .cta-button {
      font-size: 1.25rem;
      padding: 1rem 2.5rem;
    }
  }

  @media (max-width: 480px) {
    .hero-subtitle {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }

    .title-line-1 {
      font-size: 1.75rem;
    }

    .title-line-2 {
      font-size: 2rem;
    }

    .hero-description {
      font-size: 1.25rem;
      margin-bottom: 2rem;
    }

    .cta-button {
      font-size: 1.1rem;
      padding: 0.875rem 2rem;
    }
  }
</style>

<!-- Hero Section -->
<section class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>

  <!-- Hero Content -->
  <div class="hero-content">
    <p class="hero-subtitle">AI와 구조 생물학의 융합으로 인류 건강의 미래를 열어갑니다.</p>
    <h1 class="hero-title">
      <span class="title-line-1">Make Technology Accessible,</span>
      <span class="title-line-2">Connects</span>
    </h1>
    <p class="hero-description">제약 연구를 위한 AI 기반 구조 생물학 분석 플랫폼</p>
    <a href="/analysis/" class="cta-button">Curie 바로가기</a>
  </div>
</section>