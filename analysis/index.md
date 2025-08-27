---
layout: page
title: "Analysis Tools"
description: >
  CONNECTS 플랫폼의 모든 분석 도구들
permalink: /analysis/
---

## 🔬 분석 도구 모음

CONNECTS 플랫폼에서 제공하는 다양한 구조 생물학 및 분자 설계 분석 도구들을 소개합니다.

### 📊 주요 카테고리

<div class="category-grid">
  <div class="category-section">
    <h4>🧬 분자 구조</h4>
    <div class="category-links">
      <a href="{{ '/analysis/protein/' | relative_url }}">단백질</a>
      <a href="{{ '/analysis/structure/' | relative_url }}">구조 분석</a>
      <!-- <a href="{{ '/analysis/ligand/' | relative_url }}">리간드</a> -->
    </div>
  </div>
  
  <div class="category-section">
    <h4>🔮 예측 & AI</h4>
    <div class="category-links">
      <a href="{{ '/analysis/prediction/' | relative_url }}">예측</a>
      <a href="{{ '/analysis/ml/' | relative_url }}">머신러닝</a>
      <!-- <a href="{{ '/analysis/design/' | relative_url }}">설계</a> -->
    </div>
  </div>
  
  <div class="category-section">
    <h4>🤝 상호작용</h4>
    <div class="category-links">
      <a href="{{ '/analysis/docking/' | relative_url }}">도킹</a>
      <!-- <a href="{{ '/analysis/interaction/' | relative_url }}">상호작용</a> -->
    </div>
  </div>
</div>

---

### 📝 최근 업데이트된 도구

{% assign analysis_posts = site.posts | where_exp: "post", "post.categories contains 'analysis'" | limit: 5 %}

{% if analysis_posts.size > 0 %}
{% for post in analysis_posts %}
<article class="post-card">
  <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
  <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y년 %m월 %d일" }}</time>
  <p>{{ post.description | default: post.excerpt | strip_html | truncate: 160 }}</p>
  <div class="tags">
    {% for tag in post.tags limit:3 %}
      <span class="tag">{{ tag }}</span>
    {% endfor %}
  </div>
</article>
<hr/>
  {% endfor %}
{% else %}
  <p class="message">아직 등록된 분석 도구가 없습니다.</p>
{% endif %}
