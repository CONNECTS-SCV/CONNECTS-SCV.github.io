---
layout: page
title: "Analysis Tools"
description: >
  CONNECTS 플랫폼의 모든 분석 도구들
permalink: /analysis/
---

## 🔬 분석 도구 모음

CONNECTS 플랫폼에서 제공하는 다양한 구조 생물학 및 분자 설계 분석 도구들을 소개합니다.

---

### 📂 카테고리별 보기

<div class="category-cards">
  <div class="category-card">
    <h3><a href="{{ '/analysis/protein/' | relative_url }}">🧬 Protein Analysis</a></h3>
    <p>단백질 구조 분석, 서열 설계, 상호작용 예측</p>
    {% assign protein_count = site.posts | where_exp: "post", "post.categories contains 'protein'" | size %}
    <span class="count">{{ protein_count }}개 도구</span>
  </div>
  
  <div class="category-card">
    <h3><a href="{{ '/analysis/ligand/' | relative_url }}">💊 Ligand Analysis</a></h3>
    <p>리간드 도킹, 가상 스크리닝, ADMET 예측</p>
    {% assign ligand_count = site.posts | where_exp: "post", "post.categories contains 'ligand'" | size %}
    <span class="count">{{ ligand_count }}개 도구</span>
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
